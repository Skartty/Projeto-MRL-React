const bcrypt = require("bcryptjs");
const { sincronizarTodosContratos } = require("./contractSync");

const clientesSeed = [
  { nome: "Maria Albuquerque Cavalcanti", cpfCnpj: "123.456.789-00", status: "ativo" },
  { nome: "Vanguarda Soluções Tecnológicas Ltda", cpfCnpj: "12.345.678/0001-90", status: "ativo" },
  { nome: "EcoHorizonte Logística Sustentável S.A", cpfCnpj: "98.765.432/0001-10", status: "suspenso" },
  { nome: "Richard Montes de Oliveira", cpfCnpj: "987.654.321-11", status: "suspenso" },
];

const projetosSeed = [
  {
    titulo: "Desenvolvimento de microserviços e APIs",
    cpfCnpj: "12.345.678/0001-90",
    dataContratacao: "10/01/2026",
    previsaoEntrega: "15/04/2026",
    valor: 45000.00,
    progresso: 0,
    descricao: "Criação de arquitetura escalável para comunicação entre módulos internos",
    status: "planejamento",
  },
  {
    titulo: "DevOps & Cloud",
    cpfCnpj: "12.345.678/0001-90",
    dataContratacao: "05/02/2026",
    previsaoEntrega: "20/05/2026",
    valor: 32500.00,
    progresso: 25,
    descricao: "Migração de servidores locais para infraestrutura em nuvem de alta disponibilidade",
    status: "andamento",
  },
  {
    titulo: "Sistemas corporativos (ERP/CRM)",
    cpfCnpj: "98.765.432/0001-10",
    dataContratacao: "15/12/2025",
    previsaoEntrega: "30/06/2026",
    valor: 120000.00,
    progresso: 0,
    descricao: "Implementação de módulo personalizado para gestão de frotas e emissão de carbono",
    status: "suspenso",
  },
  {
    titulo: "Integrações e automação de processos",
    cpfCnpj: "98.765.432/0001-10",
    dataContratacao: "02/03/2026",
    previsaoEntrega: "10/08/2026",
    valor: 18000.00,
    progresso: 100,
    descricao: "Automação do fluxo de notas fiscais entre o galpão logístico e a contabilidade",
    status: "finalizado",
  },
  {
    titulo: "Desenvolvimento de e-commerces",
    cpfCnpj: "123.456.789-00",
    dataContratacao: "20/01/2026",
    previsaoEntrega: "15/03/2026",
    valor: 12000.00,
    progresso: 100,
    descricao: "Criação de loja virtual para comercialização de produtos artesanais de luxo",
    status: "finalizado",
  },
  {
    titulo: "Desenvolvimento de websites",
    cpfCnpj: "123.456.789-00",
    dataContratacao: "01/04/2026",
    previsaoEntrega: "01/05/2026",
    valor: 5500.00,
    progresso: 50,
    descricao: "Landing page institucional focada em portfólio de arquitetura contemporânea",
    status: "andamento",
  },
  {
    titulo: "Desenvolvimento de aplicativos mobile",
    cpfCnpj: "123.456.789-00",
    dataContratacao: "10/11/2025",
    previsaoEntrega: "25/02/2026",
    valor: 28000.00,
    progresso: 25,
    descricao: "Aplicativo para controle de rotina de treinos e dieta com integração a wearables",
    status: "andamento",
  },
  {
    titulo: "Manutenção e suporte técnico",
    cpfCnpj: "12.345.678/0001-90",
    dataContratacao: "01/02/2026",
    previsaoEntrega: "01/02/2027",
    valor: 14400.00,
    progresso: 10,
    descricao: "Suporte técnico especializado para estação de trabalho remota de alta performance",
    status: "planejamento",
  },
];

async function seedClientes(connection) {
  let inseridos = 0;

  for (const cliente of clientesSeed) {
    const [existentes] = await connection.query(
      "SELECT id FROM clientes WHERE cpf_cnpj = ? LIMIT 1",
      [cliente.cpfCnpj]
    );

    if (!existentes.length) {
      await connection.query(
        "INSERT INTO clientes (nome, cpf_cnpj, status) VALUES (?, ?, ?)",
        [cliente.nome, cliente.cpfCnpj, cliente.status]
      );
      inseridos += 1;
    }
  }

  console.log(inseridos ? `[SEED] Clientes inseridos: ${inseridos}` : "[SEED] Clientes já existentes");
}

async function seedProjetos(connection) {
  let inseridos = 0;

  for (const projeto of projetosSeed) {
    const [clientes] = await connection.query(
      "SELECT id FROM clientes WHERE cpf_cnpj = ? LIMIT 1",
      [projeto.cpfCnpj]
    );

    if (!clientes.length) {
      throw new Error(`Cliente do projeto "${projeto.titulo}" não encontrado.`);
    }

    const clienteId = clientes[0].id;
    const [existentes] = await connection.query(
      "SELECT id FROM projetos WHERE titulo = ? AND cliente_id = ? LIMIT 1",
      [projeto.titulo, clienteId]
    );

    if (!existentes.length) {
      await connection.query(
        `INSERT INTO projetos
          (titulo, cliente_id, status, data_contratacao, previsao_entrega, valor, progresso, descricao)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projeto.titulo,
          clienteId,
          projeto.status,
          projeto.dataContratacao,
          projeto.previsaoEntrega,
          projeto.valor,
          projeto.progresso,
          projeto.descricao,
        ]
      );
      inseridos += 1;
    }
  }

  console.log(inseridos ? `[SEED] Projetos inseridos: ${inseridos}` : "[SEED] Projetos já existentes");
}

async function seedAdmin(connection) {
  const email = process.env.ADMIN_EMAIL || "admin@mrl.com";
  const senha = process.env.ADMIN_PASSWORD || "admin123";

  const [admins] = await connection.query("SELECT id FROM usuarios WHERE email = ? LIMIT 1", [email]);

  if (!admins.length) {
    const senhaHash = await bcrypt.hash(senha, 10);

    await connection.query(
      "INSERT INTO usuarios (nome, email, senha, cargo, role) VALUES (?, ?, ?, ?, ?)",
      ["Mirael Ribeiro", email, senhaHash, "Diretor Presidente", "admin"]
    );
  }

  console.log("[SEED] Admin verificado/criado");
}

async function executarSeeds(pool) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await seedClientes(connection);
    await seedProjetos(connection);
    await sincronizarTodosContratos(connection);
    console.log("[SEED] Contratos sincronizados");
    await seedAdmin(connection);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { executarSeeds };
