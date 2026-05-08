const { isValidDateBR, normalizeNumber, sanitizeText } = require("../../utils/validation");

class Projeto {
  constructor({ id, titulo, clienteId, status, dataContratacao, previsaoEntrega, valor, progresso, descricao } = {}) {
    this.id = id;
    this.titulo = sanitizeText(titulo, 200);
    this.clienteId = Number(clienteId);
    this.status = status || "planejamento";
    this.dataContratacao = sanitizeText(dataContratacao, 10);
    this.previsaoEntrega = sanitizeText(previsaoEntrega, 10);
    this.valor = normalizeNumber(valor, { min: 0, max: 999999999999.99 });
    this.progresso = normalizeNumber(progresso, { min: 0, max: 100 });
    this.descricao = sanitizeText(descricao, 1000);
  }

  validar() {
    if (!this.titulo) throw new Error("Título é obrigatório.");
    if (!Number.isInteger(this.clienteId) || this.clienteId <= 0) throw new Error("Cliente é obrigatório.");
    const statusValidos = ["planejamento", "andamento", "finalizado", "suspenso"];
    if (!statusValidos.includes(this.status)) throw new Error("Status inválido.");
    if (!isValidDateBR(this.dataContratacao)) throw new Error("Data de contratação inválida.");
    if (!isValidDateBR(this.previsaoEntrega)) throw new Error("Previsão de entrega inválida.");
    if (this.progresso < 0 || this.progresso > 100) throw new Error("Progresso deve ser entre 0 e 100.");
  }
}

module.exports = Projeto;
