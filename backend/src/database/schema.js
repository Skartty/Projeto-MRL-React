async function criarSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id int NOT NULL AUTO_INCREMENT,
      nome varchar(150) NOT NULL,
      cpf_cnpj varchar(20) NOT NULL,
      status enum('ativo','suspenso') DEFAULT 'ativo',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY cpf_cnpj (cpf_cnpj)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projetos (
      id int NOT NULL AUTO_INCREMENT,
      titulo varchar(200) NOT NULL,
      cliente_id int DEFAULT NULL,
      status enum('planejamento','andamento','finalizado','suspenso') DEFAULT 'planejamento',
      data_contratacao varchar(10) DEFAULT NULL,
      previsao_entrega varchar(10) DEFAULT NULL,
      valor decimal(15,2) DEFAULT '0.00',
      progresso int DEFAULT '0',
      descricao text,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY cliente_id (cliente_id),
      CONSTRAINT projetos_ibfk_1
        FOREIGN KEY (cliente_id)
        REFERENCES clientes (id)
        ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contratos (
      id int NOT NULL AUTO_INCREMENT,
      projeto_id int DEFAULT NULL,
      cliente_id int NOT NULL,
      status enum('ativo','suspenso','finalizado') DEFAULT 'ativo',
      andamento int DEFAULT '0',
      custo decimal(15,2) DEFAULT '0.00',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY projeto_id (projeto_id),
      KEY cliente_id (cliente_id),
      CONSTRAINT contratos_ibfk_1
        FOREIGN KEY (projeto_id)
        REFERENCES projetos (id)
        ON DELETE SET NULL,
      CONSTRAINT contratos_ibfk_2
        FOREIGN KEY (cliente_id)
        REFERENCES clientes (id)
        ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id int NOT NULL AUTO_INCREMENT,
      nome varchar(150) NOT NULL,
      email varchar(150) NOT NULL,
      senha varchar(255) NOT NULL,
      cpf_cnpj varchar(20) DEFAULT NULL,
      telefone varchar(20) DEFAULT NULL,
      cargo varchar(100) DEFAULT 'Usuário',
      role enum('admin','cliente') DEFAULT 'cliente',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY email (email)
    )
  `);
}

module.exports = { criarSchema };
