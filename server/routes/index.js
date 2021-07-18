const express = require('express');
const router = express.Router();
const user = require('./user');
const posts = require('./posts');
const subreddit = require('./subreddit');

router.use('/user', user);
router.use('/posts', posts);
router.use('/r', subreddit);
router.use('/images', express.static('images'));

module.exports = router;
