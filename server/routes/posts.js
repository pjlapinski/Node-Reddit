const client = require('../config/postgresClient');
const upload = require('../config/multer');
const config = require('../config/config');
const isUserAModerator = require('./util').isUserAModerator;
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.user !== undefined ? req.user.id : -1;
  const posts = await client.query(
    `SELECT
    p.id,
    p.title,
    p.creation_date,
    ru.email AS author,
    s.name AS subreddit_name,
	  COALESCE(SUM(pv.vote), 0) AS score,
	  COALESCE((SELECT vote FROM post_vote WHERE post_id=p.id AND user_id=${userId}), 0) AS voted_by_user
    FROM post p
    LEFT JOIN subreddit s ON p.subreddit_id=s.id
    LEFT JOIN reddit_user ru ON p.user_id=ru.id
	  LEFT JOIN post_vote pv ON p.id=pv.post_id
  	GROUP BY p.id, ru.email, s.name
    ORDER BY p.creation_date DESC`
  );
  res.json(posts.rows);
});

router.post('/', async (req, res) => {
  const userId = req.user !== undefined ? req.user.id : -1;
  const posts = await client.query(
    `SELECT
    p.id,
    p.title,
    p.creation_date,
    ru.email AS author,
    s.name AS subreddit_name,
	  COALESCE(SUM(pv.vote), 0) AS score,
	  COALESCE((SELECT vote FROM post_vote WHERE post_id=p.id AND user_id=${userId}), 0) AS voted_by_user
    FROM post p
    LEFT JOIN subreddit s ON p.subreddit_id=s.id
    LEFT JOIN reddit_user ru ON p.user_id=ru.id
	  LEFT JOIN post_vote pv ON p.id=pv.post_id
    WHERE p.title ILIKE '%${req.body.search}%' OR p.content ILIKE '%${req.body.search}%'
  	GROUP BY p.id, ru.email, s.name
    ORDER BY p.creation_date DESC`
  );
  res.json(posts.rows);
});

router.get('/user', async (req, res) => {
  if (req.user === undefined) return res.redirect('/posts');
  const posts = await client.query(
    `SELECT
    p.id,
    p.title,
    p.creation_date,
    ru.email AS author,
    s.name AS subreddit_name,
	  COALESCE(SUM(pv.vote), 0) AS score,
	  COALESCE((SELECT vote FROM post_vote WHERE post_id=p.id AND user_id=${req.user.id}), 0) AS voted_by_user
    FROM post p
    LEFT JOIN subreddit s ON p.subreddit_id=s.id
    LEFT JOIN subreddit_user su ON su.subreddit_id=s.id
    LEFT JOIN reddit_user ru ON p.user_id=ru.id
	  LEFT JOIN post_vote pv ON p.id=pv.post_id
    WHERE su.user_id=${req.user.id}
  	GROUP BY p.id, ru.email, s.name
    ORDER BY p.creation_date DESC`
  );
  if (posts.rowCount !== 0) return res.json(posts.rows);
  res.redirect('/posts');
});

router.get('/r/:subreddit', async (req, res) => {
  const subreddit = req.params.subreddit;
  const exists = await client.query(`SELECT * FROM subreddit WHERE name='${subreddit}'`);
  if (exists.rowCount === 0) return res.sendStatus(404);
  const userId = req.user !== undefined ? req.user.id : -1;
  const posts = await client.query(
    `SELECT
    p.id,
    p.title,
    p.creation_date,
    ru.email AS author,
    s.name AS subreddit_name,
	  COALESCE(SUM(pv.vote), 0) AS score,
	  COALESCE((SELECT vote FROM post_vote WHERE post_id=p.id AND user_id=${userId}), 0) AS voted_by_user
    FROM post p
    LEFT JOIN subreddit s ON p.subreddit_id=s.id
    LEFT JOIN reddit_user ru ON p.user_id=ru.id
	  LEFT JOIN post_vote pv ON p.id=pv.post_id
    WHERE s.name='${subreddit}'
  	GROUP BY p.id, ru.email, s.name
    ORDER BY p.creation_date DESC`
  );
  res.json(posts.rows);
});

router.post('/vote', async (req, res) => {
  if (req.user === undefined) return res.sendStatus(404);
  const hasVoted = await client.query(
    `SELECT * FROM post_vote WHERE user_id=${req.user.id} AND post_id=${req.body.post}`
  );
  let newVote;
  if (hasVoted.rowCount === 0) {
    const inserted = await client.query(
      `INSERT INTO post_vote (vote, user_id, post_id)
      VALUES (${req.body.vote}, ${req.user.id}, ${req.body.post})
      RETURNING vote`
    );
    newVote = inserted.rows[0].vote;
  } else if (hasVoted.rows[0].vote === req.body.vote) {
    await client.query(
      `DELETE FROM post_vote
      WHERE user_id=${req.user.id} AND post_id=${req.body.post}`
    );
    newVote = 0;
  } else {
    const updated = await client.query(
      `UPDATE post_vote SET
    vote=${req.body.vote}
    WHERE user_id=${req.user.id} AND post_id=${req.body.post}
    RETURNING vote`
    );
    newVote = updated.rows[0].vote;
  }
  const newScore = await client.query(
    `SELECT COALESCE(SUM(vote), 0) AS score FROM post_vote WHERE post_id=${req.body.post}`
  );
  req.app
    .get('socketio')
    .emit('vote', { userId: req.user.id, postId: req.body.post, score: newScore.rows[0].score, vote: newVote });
});

router.post('/create', upload.single('image'), async (req, res) => {
  if (req.user === undefined) {
    return res.sendStatus(404);
  }
  const subredditId = await client.query(`SELECT id FROM subreddit WHERE name='${req.body.subreddit}'`);
  if (subredditId.rowCount === 0) {
    return res.json({ error: `r/${req.body.subreddit} does not exist` });
  }
  const postInDb = await client.query(
    `INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id) VALUES (
      '${req.body.title}',
      ${req.body.text === '' ? null : "'" + req.body.text + "'"},
      ${req.file === undefined ? null : "'" + config.HOST + '/' + req.file.path + "'"},
      ${req.body.videoUrl === '' ? null : "'" + req.body.videoUrl + "'"},
      NOW(),
      ${subredditId.rows[0].id},
      ${req.user.id}) RETURNING *`
  );
  res.json(postInDb.rows[0]);
});

router.get('/:id', async (req, res) => {
  const userId = req.user !== undefined ? req.user.id : -1;
  const post = await client.query(
    `SELECT
    p.id,
    p.title,
    p.creation_date,
    p.content,
    p.video_url,
    p.image_path,
    ru.email AS author,
    s.name AS subreddit_name,
	  COALESCE(SUM(pv.vote), 0) AS score,
	  COALESCE((SELECT vote FROM post_vote WHERE post_id=p.id AND user_id=${userId}), 0) AS voted_by_user
    FROM post p
    LEFT JOIN subreddit s ON p.subreddit_id=s.id
    LEFT JOIN reddit_user ru ON p.user_id=ru.id
	  LEFT JOIN post_vote pv ON p.id=pv.post_id
    WHERE p.id=${req.params.id}
    GROUP BY p.id, ru.email, s.name`
  );
  if (post.rowCount === 0) return res.sendStatus(404);
  const foundPost = post.rows[0];
  if (foundPost.video_url !== null) {
    foundPost.video_url = foundPost.video_url.replace('watch?v=', 'embed/');
  }
  const comments = await client.query(
    `SELECT c.id, c.content, ru.email AS author
    FROM comment c
    INNER JOIN reddit_user ru ON c.user_id=ru.id WHERE post_id=${req.params.id}
    ORDER BY c.id DESC`
  );
  res.json({ post: foundPost, comments: comments.rows });
});

router.delete('/comment/:id', async (req, res) => {
  const subreddit = await client.query(
    `SELECT s.* FROM subreddit s
    INNER JOIN post p ON p.subreddit_id=s.id
    WHERE p.id=${req.params.id}`
  );
  if (!isUserAModerator(req.user, subreddit.rows[0])) return res.sendStatus(404);
  await client.query(`DELETE FROM comment WHERE id=${req.params.id}`);
  req.app.get('socketio').emit('delete-comment', req.params.id);
});

router.delete('/:id', async (req, res) => {
  const subreddit = await client.query(
    `SELECT s.* FROM subreddit s
    INNER JOIN post p ON p.subreddit_id=s.id
    WHERE p.id=${req.params.id}`
  );
  if (!isUserAModerator(req.user, subreddit.rows[0])) return res.sendStatus(404);
  // db should have ON DELETE CASCADE, this shouldn't be required normally
  await client.query(`DELETE FROM comment WHERE post_id=${req.params.id}`);
  await client.query(`DELETE FROM post_vote WHERE post_id=${req.params.id}`);
  await client.query(`DELETE FROM post WHERE id=${req.params.id}`);
  req.app.get('socketio').emit('delete-post', req.params.id);
});

module.exports = router;
