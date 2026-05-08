import { onlyDigits } from "./masks";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SAFE_TEXT_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;:()/_@&+-]+$/;

export function sanitizeText(value, maxLength = 255) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email ?? "").trim());
}

export function isValidCpfCnpj(value) {
  const digits = onlyDigits(value);
  return digits.length === 11 || digits.length === 14;
}

export function isValidPhone(value) {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

export function isValidDateBR(value) {
  const digits = onlyDigits(value);
  if (digits.length !== 8) return false;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);

  return (
    year >= 1900 &&
    year <= 2100 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isSafeText(value, { required = true, maxLength = 255 } = {}) {
  const text = sanitizeText(value, maxLength);
  if (required && !text) return false;
  if (!text) return true;
  return SAFE_TEXT_REGEX.test(text);
}
