const { Pool } = require("pg");

// Connect to database
const pool = new Pool({
  user: "postgres",
  password: "",
  host: "localhost",
  database: "staff_nagivator_db",
});

pool.connect();