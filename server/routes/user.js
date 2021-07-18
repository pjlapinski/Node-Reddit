const client = require('../config/postgresClient');
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/user/user',
    failureFlash: true,
  })
);

router.post('/logout', (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

router.get('/user', (req, res) => {
  res.json(req.user);
});

router.post('/password-change', async (req, res) => {
  if (req.user === undefined) return res.sendStatus(404);
  const oldPassword = await client.query(`SELECT password FROM reddit_user WHERE id=${req.user.id}`);
  if (oldPassword.rows[0].password !== req.body.oldPassword) {
    return res.json({ error: 'Old password does not match' });
  }
  await client.query(`UPDATE reddit_user SET password='${req.body.newPassword}' WHERE id=${req.user.id}`);
  res.sendStatus(200);
});

router.post('/register', async (req, res, next) => {
  if (req.user !== undefined) return res.sendStatus(404);
  const userData = req.body;
  const userInDb = await client.query(`SELECT COUNT(*) FROM reddit_user WHERE email='${userData.email}'`);
  if (userInDb.rows[0].count !== '0') {
    console.log(userInDb);
    res.json({ error: `User with email ${userData.email} already exists` });
  } else {
    const insertedUser = await client.query(
      `INSERT INTO reddit_user (nickname, password, email)
      VALUES ('${userData.email}', '${userData.password}', '${userData.email}')
      RETURNING *`
    );
    req.logIn(insertedUser.rows[0], err => {
      if (err) next(err);
    });
    res.json(insertedUser.rows[0]);
  }
});

router.get('/subreddits', async (req, res) => {
  if (req.user === undefined) return res.json([]);
  const subscribed = await client.query(
    `SELECT s.* FROM subreddit_user su
    INNER JOIN reddit_user ru ON ru.id=su.user_id
    INNER JOIN subreddit s ON s.id=su.subreddit_id
    WHERE ru.id=${req.user.id}`
  );
  res.json(subscribed.rows);
});

module.exports = router;
