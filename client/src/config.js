require('dotenv').config();
const axios = require('axios').default;

const constants = {
  PORT: process.env.PORT || 5001,
  SERVER_HOST: process.env.VUE_APP_SERVER_HOST || '',
};

axios.defaults.baseURL = constants.SERVER_HOST;
axios.defaults.withCredentials = true;

module.exports = constants;
