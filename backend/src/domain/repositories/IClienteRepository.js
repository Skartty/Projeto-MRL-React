class IClienteRepository {
  async buscarTodos() { throw new Error("Não implementado"); }
  async buscarPorId(id) { throw new Error("Não implementado"); }
  async criar(cliente) { throw new Error("Não implementado"); }
  async atualizar(id, cliente) { throw new Error("Não implementado"); }
  async deletar(id) { throw new Error("Não implementado"); }
}

module.exports = IClienteRepository;