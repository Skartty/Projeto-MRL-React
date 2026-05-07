class Cliente {
  constructor({ id, nome, cpfCnpj, status, custo, contratos }) {
    this.id = id;
    this.nome = nome;
    this.cpfCnpj = cpfCnpj;
    this.status = status || "ativo";
    this.custo = custo || 0;
    this.contratos = contratos || 0;
  }

  validar() {
    if (!this.nome || !this.nome.trim()) throw new Error("Nome é obrigatório.");
    if (!this.cpfCnpj || !this.cpfCnpj.trim()) throw new Error("CPF/CNPJ é obrigatório.");
    if (!["ativo", "suspenso"].includes(this.status)) throw new Error("Status inválido.");
  }
}

module.exports = Cliente;