class Usuario {
  constructor({ id, nome, email, senha, cpfCnpj, telefone, cargo }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.cpfCnpj = cpfCnpj;
    this.telefone = telefone;
    this.cargo = cargo;
  }

  validar() {
    if (!this.nome || !this.nome.trim()) throw new Error("Nome é obrigatório.");
    if (!this.email || !this.email.includes("@")) throw new Error("E-mail inválido.");
    if (!this.senha || this.senha.length < 6) throw new Error("Senha deve ter no mínimo 6 caracteres.");
  }
}

module.exports = Usuario;