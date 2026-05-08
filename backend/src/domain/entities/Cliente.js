const { sanitizeText, isValidCpfCnpj } = require("../../utils/validation");

class Cliente {
  constructor({ id, nome, cpfCnpj, status, custo, contratos } = {}) {
    this.id = id;
    this.nome = sanitizeText(nome, 150);
    this.cpfCnpj = sanitizeText(cpfCnpj, 20);
    this.status = status || "ativo";
    this.custo = custo || 0;
    this.contratos = contratos || 0;
  }

  validar() {
    if (!this.nome) throw new Error("Nome é obrigatório.");
    if (!isValidCpfCnpj(this.cpfCnpj)) throw new Error("CPF/CNPJ inválido.");
    if (!["ativo", "suspenso"].includes(this.status)) throw new Error("Status inválido.");
  }
}

module.exports = Cliente;
