const client = require('../config/postgresClient');

const isUserAModerator = async (user, subreddit) => {
  if (user === undefined) return false;
  const isModerator = await client.query(
    `SELECT * FROM subreddit_moderator sm
    INNER JOIN subreddit s ON s.id=sm.subreddit_id
    WHERE s.name='${subreddit}' AND sm.user_id=${user.id}`
  );
  return isModerator.rowCount !== 0;
};

const isAlphanumeric = string => {
  return string.match(/^[A-Za-z0-9]+$/);
};

module.exports = {
  isUserAModerator,
  isAlphanumeric,
};
