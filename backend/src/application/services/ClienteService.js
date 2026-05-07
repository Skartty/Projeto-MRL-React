const Cliente = require("../../domain/entities/Cliente");

class ClienteService {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async listar() {
    return await this.clienteRepository.buscarTodos();
  }

  async buscarPorId(id) {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) throw new Error("Cliente não encontrado.");
    return cliente;
  }

  async criar(dados) {
    const cliente = new Cliente(dados);
    cliente.validar();
    return await this.clienteRepository.criar(cliente);
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id);
    const cliente = new Cliente({ ...dados, id });
    cliente.validar();
    return await this.clienteRepository.atualizar(id, cliente);
  }

  async deletar(id) {
    await this.buscarPorId(id);
    return await this.clienteRepository.deletar(id);
  }
}

module.exports = ClienteService;