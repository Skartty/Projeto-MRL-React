const IUsuarioRepository = require("../../domain/repositories/IUsuarioRepository");
const pool = require("../../config/database");

class UsuarioRepository extends IUsuarioRepository {
  async buscarPorEmail(email) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    return rows[0] || null;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query(
      "SELECT id, nome, email, cargo, cpf_cnpj, telefone FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }

  async criar(usuario) {
    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, cpf_cnpj, telefone, cargo, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.cpfCnpj || null,
        usuario.telefone || null,
        usuario.cargo || "Cliente",
        usuario.role || "cliente",
      ]
    );
    return { id: result.insertId, ...usuario };
  }
}

module.exports = UsuarioRepository;