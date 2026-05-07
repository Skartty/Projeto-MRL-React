const IContratoRepository = require("../../domain/repositories/IContratoRepository");
const pool = require("../../config/database");

class ContratoRepository extends IContratoRepository {
  async buscarTodos() {
    const [rows] = await pool.query(`
      SELECT 
        ct.*,
        c.nome AS cliente_nome,
        c.cpf_cnpj AS cliente_cpf_cnpj,
        p.titulo AS projeto_titulo
      FROM contratos ct
      LEFT JOIN clientes c ON c.id = ct.cliente_id
      LEFT JOIN projetos p ON p.id = ct.projeto_id
      ORDER BY ct.created_at DESC
    `);
    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT ct.*, c.nome AS cliente_nome, p.titulo AS projeto_titulo
       FROM contratos ct
       LEFT JOIN clientes c ON c.id = ct.cliente_id
       LEFT JOIN projetos p ON p.id = ct.projeto_id
       WHERE ct.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async criar(contrato) {
    const [result] = await pool.query(
      "INSERT INTO contratos (projeto_id, cliente_id, status, andamento, custo) VALUES (?, ?, ?, ?, ?)",
      [contrato.projetoId, contrato.clienteId, contrato.status, contrato.andamento, contrato.custo]
    );
    return { id: result.insertId, ...contrato };
  }

  async atualizar(id, contrato) {
    await pool.query(
      "UPDATE contratos SET projeto_id=?, cliente_id=?, status=?, andamento=?, custo=? WHERE id=?",
      [contrato.projetoId, contrato.clienteId, contrato.status, contrato.andamento, contrato.custo, id]
    );
    return { id, ...contrato };
  }

  async deletar(id) {
    await pool.query("DELETE FROM contratos WHERE id = ?", [id]);
    return true;
  }
}

module.exports = ContratoRepository;