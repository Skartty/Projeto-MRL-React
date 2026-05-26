function toString(value) {
  return String(value ?? "");
}

function sanitizeText(value, maxLength = 255) {
  return toString(value)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function onlyDigits(value) {
  return toString(value).replace(/\D/g, "");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(toString(email).trim());
}

function isValidSenha(senha) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{6,72}$/.test(toString(senha));
}

function isValidCpfCnpj(value) {
  const digits = onlyDigits(value);
  return digits.length === 11 || digits.length === 14;
}

function isValidPhone(value) {
  const digits = onlyDigits(value);
  return !digits || digits.length === 10 || digits.length === 11;
}

function isValidDateBR(value) {
  const text = toString(value).trim();
  if (!text) return true;
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    year >= 1900 &&
    year <= 2100 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function parseDateBR(value) {
  const text = toString(value).trim();
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match || !isValidDateBR(text)) return null;

  return {
    day: Number(match[1]),
    month: Number(match[2]),
    year: Number(match[3]),
  };
}

function isEntregaDepoisOuIgualContratacao(dataContratacao, previsaoEntrega) {
  if (!dataContratacao || !previsaoEntrega) return true;

  const inicio = parseDateBR(dataContratacao);
  const fim = parseDateBR(previsaoEntrega);
  if (!inicio || !fim) return true;

  const inicioValor = inicio.year * 10000 + inicio.month * 100 + inicio.day;
  const fimValor = fim.year * 10000 + fim.month * 100 + fim.day;
  return fimValor >= inicioValor;
}

function normalizeNumber(value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(Math.max(number, min), max);
}

module.exports = {
  sanitizeText,
  onlyDigits,
  isValidEmail,
  isValidSenha,
  isValidCpfCnpj,
  isValidPhone,
  isValidDateBR,
  isEntregaDepoisOuIgualContratacao,
  normalizeNumber,
};
