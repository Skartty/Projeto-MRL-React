const {
  sanitizeText,
  isValidCpfCnpj,
  isValidEmail,
  isValidPhone,
} = require("../../utils/validation");

class Usuario {
  constructor({ id, nome, email, senha, cpfCnpj, telefone, cargo } = {}) {
    this.id = id;
    this.nome = sanitizeText(nome, 150);
    this.email = sanitizeText(email, 150).toLowerCase();
    this.senha = String(senha ?? "");
    this.cpfCnpj = sanitizeText(cpfCnpj, 20);
    this.telefone = sanitizeText(telefone, 20);
    this.cargo = sanitizeText(cargo, 100);
  }

  validar() {
    if (!this.nome) throw new Error("Nome é obrigatório.");
    if (!isValidEmail(this.email)) throw new Error("Email inválido.");
    if (!this.senha || this.senha.length < 6 || this.senha.length > 72) {
      throw new Error("Senha deve ter entre 6 e 72 caracteres.");
    }
    if (this.cpfCnpj && !isValidCpfCnpj(this.cpfCnpj)) throw new Error("CPF/CNPJ inválido.");
    if (this.telefone && !isValidPhone(this.telefone)) throw new Error("Telefone inválido.");
  }
}

module.exports = Usuario;
