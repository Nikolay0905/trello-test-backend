require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_HOST } = process.env;

const config = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_NAME,
  port: DB_PORT,
};

module.exports = config;

module.exports = config;
