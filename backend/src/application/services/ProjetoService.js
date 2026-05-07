const Projeto = require("../../domain/entities/Projeto");

class ProjetoService {
  constructor(projetoRepository) {
    this.projetoRepository = projetoRepository;
  }

  async listar() {
    return await this.projetoRepository.buscarTodos();
  }

  async buscarPorId(id) {
    const projeto = await this.projetoRepository.buscarPorId(id);
    if (!projeto) throw new Error("Projeto não encontrado.");
    return projeto;
  }

  async criar(dados) {
    const projeto = new Projeto(dados);
    projeto.validar();
    await this.validarCliente(projeto.clienteId);
    return await this.projetoRepository.criar(projeto);
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id);
    const projeto = new Projeto({ ...dados, id });
    projeto.validar();
    await this.validarCliente(projeto.clienteId);
    return await this.projetoRepository.atualizar(id, projeto);
  }

  async validarCliente(clienteId) {
    if (!clienteId) throw new Error("Selecione um cliente cadastrado para criar o projeto.");

    const clienteExiste = await this.projetoRepository.clienteExiste(clienteId);
    if (!clienteExiste) throw new Error("Cliente selecionado não existe.");
  }

  async deletar(id) {
    await this.buscarPorId(id);
    return await this.projetoRepository.deletar(id);
  }
}

module.exports = ProjetoService;
