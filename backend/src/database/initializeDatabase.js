const mysql = require("mysql2/promise");
const pool = require("../config/database");
const databaseConfig = require("../config/databaseConfig");
const { criarSchema } = require("./schema");
const { executarSeeds } = require("./seeds");

async function garantirBanco() {
  const connection = await mysql.createConnection({
    host: databaseConfig.host,
    user: databaseConfig.user,
    password: databaseConfig.password,
  });

  try {
    const [databases] = await connection.query("SHOW DATABASES LIKE ?", [databaseConfig.database]);

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    console.log(databases.length ? "[DB] Banco verificado" : "[DB] Banco criado com sucesso");
  } finally {
    await connection.end();
  }
}

async function inicializarBanco() {
  await garantirBanco();
  await criarSchema(pool);
  console.log("[DB] Tabelas sincronizadas");
  await executarSeeds(pool);
}

module.exports = { inicializarBanco };
