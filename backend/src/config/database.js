const mysql2 = require("mysql2/promise");
const databaseConfig = require("./databaseConfig");

const pool = mysql2.createPool({
  ...databaseConfig,
});

module.exports = pool;
