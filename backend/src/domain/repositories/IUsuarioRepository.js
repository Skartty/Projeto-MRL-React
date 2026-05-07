class IUsuarioRepository {
  async buscarPorEmail(email) { throw new Error("Não implementado"); }
  async buscarPorId(id) { throw new Error("Não implementado"); }
  async criar(usuario) { throw new Error("Não implementado"); }
}

module.exports = IUsuarioRepository;