const ClienteService = require("../../application/services/ClienteService");
const ClienteRepository = require("../../infrastructure/repositories/ClienteRepository");

const service = new ClienteService(new ClienteRepository());

class ClienteController {
  async listar(req, res) {
    try {
      const clientes = await service.listar();
      res.json(clientes);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const cliente = await service.buscarPorId(req.params.id);
      res.json(cliente);
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }

  async criar(req, res) {
    try {
      const cliente = await service.criar(req.body);
      res.status(201).json(cliente);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const cliente = await service.atualizar(req.params.id, req.body);
      res.json(cliente);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async deletar(req, res) {
    try {
      await service.deletar(req.params.id);
      res.json({ mensagem: "Cliente excluído com sucesso." });
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }
}

module.exports = new ClienteController();