const IProjetoRepository = require("../../domain/repositories/IProjetoRepository");
const pool = require("../../config/database");
const { sincronizarContratoDoProjeto } = require("../../database/contractSync");

class ProjetoRepository extends IProjetoRepository {
  async buscarTodos() {
    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS cliente_nome, c.cpf_cnpj AS cliente_cpf_cnpj
      FROM projetos p
      LEFT JOIN clientes c ON c.id = p.cliente_id
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query(
      "SELECT p.*, c.nome AS cliente_nome, c.cpf_cnpj AS cliente_cpf_cnpj FROM projetos p LEFT JOIN clientes c ON c.id = p.cliente_id WHERE p.id = ?",
      [id]
    );
    return rows[0] || null;
  }

  async clienteExiste(clienteId) {
    const [rows] = await pool.query("SELECT id FROM clientes WHERE id = ? LIMIT 1", [clienteId]);
    return rows.length > 0;
  }

  async criar(projeto) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        `INSERT INTO projetos (titulo, cliente_id, status, data_contratacao, previsao_entrega, valor, progresso, descricao)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [projeto.titulo, projeto.clienteId, projeto.status, projeto.dataContratacao,
         projeto.previsaoEntrega, projeto.valor, projeto.progresso, projeto.descricao]
      );
      await sincronizarContratoDoProjeto(connection, result.insertId);
      await connection.commit();
      return { id: result.insertId, ...projeto };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async atualizar(id, projeto) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.query(
        `UPDATE projetos SET titulo=?, cliente_id=?, status=?, data_contratacao=?,
         previsao_entrega=?, valor=?, progresso=?, descricao=? WHERE id=?`,
        [projeto.titulo, projeto.clienteId, projeto.status, projeto.dataContratacao,
         projeto.previsaoEntrega, projeto.valor, projeto.progresso, projeto.descricao, id]
      );
      await sincronizarContratoDoProjeto(connection, id);
      await connection.commit();
      return { id, ...projeto };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deletar(id) {
    await pool.query("DELETE FROM projetos WHERE id = ?", [id]);
    return true;
  }
}

module.exports = ProjetoRepository;
