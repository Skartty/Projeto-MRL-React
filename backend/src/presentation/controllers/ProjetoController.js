const ProjetoService = require("../../application/services/ProjetoService");
const ProjetoRepository = require("../../infrastructure/repositories/ProjetoRepository");

const service = new ProjetoService(new ProjetoRepository());

class ProjetoController {
  async listar(req, res) {
    try {
      const projetos = await service.listar();
      res.json(projetos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const projeto = await service.buscarPorId(req.params.id);
      res.json(projeto);
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }

  async criar(req, res) {
    try {
      const projeto = await service.criar(req.body);
      res.status(201).json(projeto);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const projeto = await service.atualizar(req.params.id, req.body);
      res.json(projeto);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async deletar(req, res) {
    try {
      await service.deletar(req.params.id);
      res.json({ mensagem: "Projeto excluído com sucesso." });
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }
}

module.exports = new ProjetoController();