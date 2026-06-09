const mysql = require("mysql2/promise");
const pool = require("../config/database");
const databaseConfig = require("../config/databaseConfig");
const { criarSchema } = require("./schema");
const { executarSeeds } = require("./seeds");

async function garantirBanco() {
  const connection = await mysql.createConnection({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
  });

  try {
    await connection.query("SELECT 1");
    console.log("[DB] Conexão validada");
  } finally {
    await connection.end();
  }
}

async function inicializarBanco() {
  await garantirBanco();
  await criarSchema(pool);
  await removerRegistrosOrfaos();
  console.log("[DB] Tabelas sincronizadas");
  await executarSeeds(pool);
}

async function removerRegistrosOrfaos() {
  await pool.query(`
    DELETE ct FROM contratos ct
    LEFT JOIN projetos p ON p.id = ct.projeto_id
    LEFT JOIN clientes c ON c.id = ct.cliente_id
    WHERE p.id IS NULL OR c.id IS NULL
  `);

  await pool.query(`
    DELETE p FROM projetos p
    LEFT JOIN clientes c ON c.id = p.cliente_id
    WHERE c.id IS NULL
  `);
}

module.exports = { inicializarBanco };
