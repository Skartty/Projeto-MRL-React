class Contrato {
  constructor({ id, projetoId, clienteId, status, andamento, custo }) {
    this.id = id;
    this.projetoId = projetoId;
    this.clienteId = clienteId;
    this.status = status || "ativo";
    this.andamento = andamento || 0;
    this.custo = custo || 0;
  }

  validar() {
    if (!this.clienteId) throw new Error("Cliente é obrigatório.");
    const statusValidos = ["ativo", "suspenso", "finalizado"];
    if (!statusValidos.includes(this.status)) throw new Error("Status inválido.");
    if (this.andamento < 0 || this.andamento > 100) throw new Error("Andamento deve ser entre 0 e 100.");
  }
}

module.exports = Contrato;