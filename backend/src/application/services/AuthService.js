const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../../domain/entities/Usuario");
const { isValidEmail, sanitizeText } = require("../../utils/validation");

class AuthService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async cadastrar(dados = {}) {
    const usuario = new Usuario(dados);
    usuario.validar();

    const existente = await this.usuarioRepository.buscarPorEmail(usuario.email);
    if (existente) throw new Error("E-mail já cadastrado.");

    const senhaHash = await bcrypt.hash(usuario.senha, 10);
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
      usuario: { id: criado.id, nome: usuario.nome, email: usuario.email, cargo: "Cliente", role: "cliente" },
    };
  }

  async login(dados = {}) {
    const email = sanitizeText(dados.email, 150).toLowerCase();
    const senha = String(dados.senha ?? "");

    if (!email || !senha) throw new Error("Preencha todos os campos");
    if (!isValidEmail(email)) throw new Error("Email inválido");

    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("Senha incorreta");

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
