// Will connect to POSTGRESQL database and export the connection pool for use in other modules

// Imports the Pool class from the pg library, which is used to manage connections to a PostgreSQL database
const { Pool } = require('pg');
require('dotenv').config();

// Creates new connnection pool that route files can use to talk to the database
const pool = new Pool({
  host: 'database',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'hackstack'
});

// Exports pool so that other files can use same connection
module.exports = pool;
