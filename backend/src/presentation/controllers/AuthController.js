const AuthService = require("../../application/services/AuthService");
const UsuarioRepository = require("../../infrastructure/repositories/UsuarioRepository");

const service = new AuthService(new UsuarioRepository());

class AuthController {
  async cadastrar(req, res) {
    try {
      const resultado = await service.cadastrar(req.body);
      res.status(201).json(resultado);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async login(req, res) {
    try {
      const resultado = await service.login(req.body);
      res.status(200).json(resultado);
    } catch (err) {
      res.status(401).json({ erro: err.message });
    }
  }
}

module.exports = new AuthController();