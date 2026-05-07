class IProjetoRepository {
  async buscarTodos() { throw new Error("Não implementado"); }
  async buscarPorId(id) { throw new Error("Não implementado"); }
  async criar(projeto) { throw new Error("Não implementado"); }
  async atualizar(id, projeto) { throw new Error("Não implementado"); }
  async deletar(id) { throw new Error("Não implementado"); }
}

module.exports = IProjetoRepository;