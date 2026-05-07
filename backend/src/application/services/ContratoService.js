class ContratoService {
  constructor(contratoRepository) {
    this.contratoRepository = contratoRepository;
  }

  async listar() {
    return await this.contratoRepository.buscarTodos();
  }

  async buscarPorId(id) {
    const contrato = await this.contratoRepository.buscarPorId(id);
    if (!contrato) throw new Error("Contrato não encontrado.");
    return contrato;
  }

  async criar(dados) {
    throw new Error("Contratos são gerados automaticamente a partir dos projetos.");
  }

  async atualizar(id, dados) {
    throw new Error("Atualize o projeto relacionado para sincronizar o contrato automaticamente.");
  }

  async deletar(id) {
    throw new Error("Contratos são removidos automaticamente conforme o relacionamento com clientes e projetos.");
  }
}

module.exports = ContratoService;
