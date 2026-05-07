class Projeto {
  constructor({ id, titulo, clienteId, status, dataContratacao, previsaoEntrega, valor, progresso, descricao }) {
    this.id = id;
    this.titulo = titulo;
    this.clienteId = clienteId;
    this.status = status || "planejamento";
    this.dataContratacao = dataContratacao || "";
    this.previsaoEntrega = previsaoEntrega || "";
    this.valor = valor || 0;
    this.progresso = progresso || 0;
    this.descricao = descricao || "";
  }

  validar() {
    if (!this.titulo || !this.titulo.trim()) throw new Error("Título é obrigatório.");
    if (!this.clienteId) throw new Error("Cliente é obrigatório.");
    const statusValidos = ["planejamento", "andamento", "finalizado", "suspenso"];
    if (!statusValidos.includes(this.status)) throw new Error("Status inválido.");
    if (this.progresso < 0 || this.progresso > 100) throw new Error("Progresso deve ser entre 0 e 100.");
  }
}

module.exports = Projeto;
