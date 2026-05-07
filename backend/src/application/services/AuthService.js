const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../../domain/entities/Usuario");

class AuthService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async cadastrar({ nome, email, senha, cpfCnpj, telefone }) {
    const existente = await this.usuarioRepository.buscarPorEmail(email);
    if (existente) throw new Error("E-mail já cadastrado.");

    const usuario = new Usuario({ nome, email, senha, cpfCnpj, telefone });
    usuario.validar();

    const senhaHash = await bcrypt.hash(senha, 10);
    const criado = await this.usuarioRepository.criar({
      ...usuario,
      senha: senhaHash,
      cargo: "Cliente",
      role: "cliente",
    });

    const token = jwt.sign(
      { id: criado.id, role: "cliente" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      usuario: { id: criado.id, nome, email, cargo: "Cliente", role: "cliente" },
    };
  }

  async login({ email, senha }) {
    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) throw new Error("E-mail ou senha inválidos.");

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("E-mail ou senha inválidos.");

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        role: usuario.role,
      },
    };
  }
}

module.exports = AuthService;