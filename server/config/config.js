require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || 'http://localhost:5000',
  HOSTNAME: process.env.HOSTNAME || 'localhost:5000',
  DEVELOPMENT: (process.env.NODE_ENV || 'development') === 'development',
  PASSPORT_SECRET: process.env.PASSPORT_SECRET || 'changeit',
  PGHOST: process.env.PGHOST || '127.0.0.1',
  PGPORT: process.env.PGPORT || 5432,
  PGDATABASE: process.env.PGDATABASE || '',
  PGUSER: process.env.PGUSER || '',
  PGPASSWORD: process.env.PGPASS || '',
  CLIENT_HOST: process.env.CLIENT_HOST || '',
};
