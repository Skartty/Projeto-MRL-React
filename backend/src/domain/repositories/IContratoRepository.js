class IContratoRepository {
  async buscarTodos() { throw new Error("Não implementado"); }
  async buscarPorId(id) { throw new Error("Não implementado"); }
  async criar(contrato) { throw new Error("Não implementado"); }
  async atualizar(id, contrato) { throw new Error("Não implementado"); }
  async deletar(id) { throw new Error("Não implementado"); }
}

module.exports = IContratoRepository;