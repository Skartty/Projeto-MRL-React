export const onlyDigits = (value) => String(value ?? "").replace(/\D/g, "");

export function maskCpfCnpj(value) {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function maskPhone(value) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskDate(value) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}

export function maskPercent(value) {
  const number = Number(onlyDigits(value).slice(0, 3));
  if (!Number.isFinite(number)) return "";
  if (number > 100) return "100";
  return String(number);
}

export function maskCurrency(value) {
  const digits = onlyDigits(value).slice(0, 13);
  const amount = Number(digits || 0) / 100;

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function currencyToNumber(value) {
  return Number(onlyDigits(value)) / 100 || 0;
}

export function blockInvalidNumericInput(event) {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
  ];

  if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) return;
  if (!/^\d$/.test(event.key)) event.preventDefault();
}
