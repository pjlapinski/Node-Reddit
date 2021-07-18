const client = require('../config/postgresClient');
const express = require('express');
const router = express.Router();
const util = require('./util');
const isUserAModerator = util.isUserAModerator;
const isAlphanumeric = util.isAlphanumeric;

router.get('/', async (req, res) => {
  const query =
    req.user === undefined
      ? 'SELECT * FROM subreddit ORDER BY name'
      : `SELECT s.*, EXISTS(SELECT * FROM subreddit_user WHERE s.id=subreddit_id AND user_id=${req.user.id}) AS subscribed
      FROM subreddit s ORDER BY s.name`;
  const subreddits = await client.query(query);
  res.json(subreddits.rows);
});

router.post('/', async (req, res) => {
  const query =
    req.user === undefined
      ? `SELECT * FROM subreddit WHERE name LIKE '%${req.body.search}%' ORDER BY name`
      : `SELECT s.*, EXISTS(SELECT * FROM subreddit_user WHERE s.id=subreddit_id AND user_id=${req.user.id}) AS subscribed
      FROM subreddit s WHERE s.name LIKE '%${req.body.search}%' ORDER BY s.name`;
  const subreddits = await client.query(query);
  res.json(subreddits.rows);
});

router.get('/:subreddit', async (req, res) => {
  let subscribed = false;
  const subreddit = req.params.subreddit;
  const info = await client.query(`SELECT * FROM subreddit WHERE name='${subreddit}'`);
  if (info.rowCount === 0) return res.sendStatus(404);
  if (req.user !== undefined) {
    const query = await client.query(
      `SELECT * FROM subreddit_user WHERE subreddit_id=${info.rows[0].id} AND user_id=${req.user.id}`
    );
    subscribed = query.rowCount === 1;
  }
  res.json({
    ...info.rows[0],
    subscribed,
    moderator: await isUserAModerator(req.user, subreddit),
  });
});

router.patch('/:subreddit', async (req, res) => {
  const canEdit = await isUserAModerator(req.user, req.params.subreddit);
  if (!canEdit) return res.json({ error: 'You are not authorized to edit this subreddit' });
  if (isAlphanumeric(req.body.name)) return res.json({ error: 'The name can only contain letters and digits' });
  const existsAlready = await client.query(`SELECT * FROM subreddit WHERE name='${req.body.name}'`);
  if (existsAlready.rowCount !== 0) return res.json({ error: `r/${req.body.name} already exists` });
  const update = await client.query(
    `UPDATE subreddit SET name='${req.body.name}', description='${req.body.description}'
    WHERE name='${req.params.subreddit}' RETURNING *`
  );
  res.json(update.rows[0]);
});

router.post('/create-subreddit', async (req, res) => {
  if (req.user === undefined) return res.sendStatus(404);
  if (isAlphanumeric(req.body.name)) return res.json({ error: 'The name can only contain letters and digits' });
  const existsAlready = await client.query(`SELECT * FROM subreddit WHERE name='${req.body.name}'`);
  if (existsAlready.rowCount !== 0) return res.json({ error: `r/${req.body.name} already exists` });
  const inserted = await client.query(
    `INSERT INTO subreddit (name, description)
    VALUES ('${req.body.name}', '${req.body.description}') RETURNING *`
  );
  const newSubreddit = inserted.rows[0];
  await client.query(`INSERT INTO subreddit_moderator (user_id, subreddit_id)
  VALUES (${req.user.id}, ${newSubreddit.id})`);
  await client.query(`INSERT INTO subreddit_user (user_id, subreddit_id)
  VALUES (${req.user.id}, ${newSubreddit.id})`);
  res.json(newSubreddit);
});

router.get('/:subreddit/mod', (req, res) => {
  isUserAModerator(req.user, req.params.subreddit).then(r => {
    res.json(r);
  });
});

router.post('/:subreddit/subscribe', async (req, res) => {
  const subreddit = req.params.subreddit;
  const subredditObject = await client.query(`SELECT * FROM subreddit WHERE name='${subreddit}'`);
  if (req.user === undefined || subredditObject.rowCount === 0) return res.sendStatus(404);
  const subredditId = subredditObject.rows[0].id;
  const subscribed = await client.query(
    `SELECT * FROM subreddit_user WHERE subreddit_id=${subredditId} AND user_id=${req.user.id}`
  );
  const isSubscribed = subscribed.rowCount === 1;
  if (isSubscribed) {
    await client.query(`DELETE FROM subreddit_user WHERE subreddit_id=${subredditId} AND user_id=${req.user.id}`);
    return res.json({ subscribed: false });
  }
  await client.query(`INSERT INTO subreddit_user (subreddit_id, user_id) VALUES (${subredditId}, ${req.user.id})`);
  res.json({ subscribed: true });
});

module.exports = router;
