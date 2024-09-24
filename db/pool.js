const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: false,
});
// sudo apt-get update && sudo apt-get install postgresql postgresql-contrib -y
// sudo service postgresql start
// psql -U postgres -d postgres -h localhost