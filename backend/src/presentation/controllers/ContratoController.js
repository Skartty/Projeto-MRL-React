const ContratoService = require("../../application/services/ContratoService");
const ContratoRepository = require("../../infrastructure/repositories/ContratoRepository");

const service = new ContratoService(new ContratoRepository());

class ContratoController {
  async listar(req, res) {
    try {
      const contratos = await service.listar();
      res.json(contratos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const contrato = await service.buscarPorId(req.params.id);
      res.json(contrato);
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }

  async criar(req, res) {
    try {
      const contrato = await service.criar(req.body);
      res.status(201).json(contrato);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const contrato = await service.atualizar(req.params.id, req.body);
      res.json(contrato);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async deletar(req, res) {
    try {
      await service.deletar(req.params.id);
      res.json({ mensagem: "Contrato excluído com sucesso." });
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }
}

module.exports = new ContratoController();