function mapProjetoStatusToContratoStatus(status) {
  if (status === "suspenso") return "suspenso";
  if (status === "finalizado") return "finalizado";
  return "ativo";
}

async function sincronizarContratoDoProjeto(connection, projetoId) {
  const [projetos] = await connection.query(
    "SELECT id, cliente_id, status, progresso, valor FROM projetos WHERE id = ?",
    [projetoId]
  );

  const projeto = projetos[0];
  if (!projeto || !projeto.cliente_id) return null;

  const contrato = {
    projetoId: projeto.id,
    clienteId: projeto.cliente_id,
    status: mapProjetoStatusToContratoStatus(projeto.status),
    andamento: projeto.progresso || 0,
    custo: projeto.valor || 0,
  };

  const [contratos] = await connection.query(
    "SELECT id FROM contratos WHERE projeto_id = ? LIMIT 1",
    [projeto.id]
  );

  if (contratos.length) {
    await connection.query(
      "UPDATE contratos SET cliente_id = ?, status = ?, andamento = ?, custo = ? WHERE id = ?",
      [contrato.clienteId, contrato.status, contrato.andamento, contrato.custo, contratos[0].id]
    );
    return { id: contratos[0].id, ...contrato };
  }

  const [result] = await connection.query(
    "INSERT INTO contratos (projeto_id, cliente_id, status, andamento, custo) VALUES (?, ?, ?, ?, ?)",
    [contrato.projetoId, contrato.clienteId, contrato.status, contrato.andamento, contrato.custo]
  );

  return { id: result.insertId, ...contrato };
}

async function sincronizarTodosContratos(connection) {
  const [projetos] = await connection.query("SELECT id FROM projetos WHERE cliente_id IS NOT NULL");

  for (const projeto of projetos) {
    await sincronizarContratoDoProjeto(connection, projeto.id);
  }
}

module.exports = {
  mapProjetoStatusToContratoStatus,
  sincronizarContratoDoProjeto,
  sincronizarTodosContratos,
};
