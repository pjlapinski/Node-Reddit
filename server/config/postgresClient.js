const config = require('./config');
const { Client } = require('pg');

module.exports = new Client({
  host: config.PGHOST,
  port: config.PGPORT,
  database: config.PGDATABASE,
  user: config.PGUSER,
  password: config.PGPASSWORD,
});
