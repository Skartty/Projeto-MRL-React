const IClienteRepository = require("../../domain/repositories/IClienteRepository");
const pool = require("../../config/database");

class ClienteRepository extends IClienteRepository {
  async buscarTodos() {
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        COUNT(ct.id) AS contratos,
        COALESCE(SUM(ct.custo), 0) AS custo
      FROM clientes c
      LEFT JOIN contratos ct ON ct.cliente_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM clientes WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async criar(cliente) {
    const [result] = await pool.query(
      "INSERT INTO clientes (nome, cpf_cnpj, status) VALUES (?, ?, ?)",
      [cliente.nome, cliente.cpfCnpj, cliente.status]
    );
    return { id: result.insertId, ...cliente };
  }

  async atualizar(id, cliente) {
    await pool.query(
      "UPDATE clientes SET nome = ?, cpf_cnpj = ?, status = ? WHERE id = ?",
      [cliente.nome, cliente.cpfCnpj, cliente.status, id]
    );
    return { id, ...cliente };
  }

  async deletar(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.query("DELETE FROM contratos WHERE cliente_id = ?", [id]);
      await connection.query("DELETE FROM projetos WHERE cliente_id = ?", [id]);
      await connection.query("DELETE FROM clientes WHERE id = ?", [id]);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = ClienteRepository;
