import { createHttpError } from "../utils/httpError.js";

// CLEAN ARCHITECTURE: validadores reutilizáveis para todas as camadas HTTP.
export function parsePositiveId(value, field = "id") {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw createHttpError(400, `${field} inválido`);
  }
  return id;
}

// CLEAN ARCHITECTURE: normaliza strings obrigatorias.
export function requiredString(value, field) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    throw createHttpError(400, `${field} e obrigatorio`);
  }
  return text;
}

// CLEAN ARCHITECTURE: normaliza strings opcionais para null.
export function optionalString(value) {
  if (value == null) return null;
  const text = typeof value === "string" ? value.trim() : String(value).trim();
  return text || null;
}

// CLEAN ARCHITECTURE: valida URLs opcionais usadas em imagens de serviços/perfis.
export function validateOptionalUrl(value, field = "url") {
  const text = optionalString(value);
  if (!text) return null;

  try {
    const url = new URL(text);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("invalid protocol");
    }
    return text;
  } catch {
    throw createHttpError(400, `${field} inválido`);
  }
}

// CLEAN ARCHITECTURE: valida email em auth/users.
export function validateEmail(value) {
  const email = requiredString(value, "email").toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createHttpError(400, "Email inválido");
  }
  return email;
}

// CLEAN ARCHITECTURE: valida password forte para registo/reset.
export function validateStrongPassword(value) {
  const password = requiredString(value, "password");
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  if (!strongPassword.test(password)) {
    throw createHttpError(400, "Password fraca");
  }
  return password;
}

// CLEAN ARCHITECTURE: valida preços e contrapropostas.
export function validateNonNegativeNumber(value, field, { required = true } = {}) {
  if ((value == null || value === "") && !required) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw createHttpError(400, `${field} inválido`);
  }
  return number;
}

// CLEAN ARCHITECTURE: valida notas de avaliação.
export function validateRating(value) {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw createHttpError(400, "A nota deve ser entre 1 e 5");
  }
  return rating;
}

// CLEAN ARCHITECTURE: valida enums de estado.
export function validateEnum(value, allowed, field = "estado") {
  const text = requiredString(value, field);
  if (!allowed.includes(text)) {
    throw createHttpError(400, `${field} inválido`);
  }
  return text;
}

// NEW FEATURE: valida datas ISO simples para agendamentos e contrapropostas.
export function validateDate(value, field = "data") {
  const text = requiredString(value, field);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) {
    throw createHttpError(400, `${field} inválida`);
  }

  const [, year, month, day] = match;
  const date = new Date(`${text}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() + 1 !== Number(month) ||
    date.getUTCDate() !== Number(day)
  ) {
    throw createHttpError(400, `${field} inválida`);
  }
  return text;
}

// NEW FEATURE: valida horários HH:mm para agendamentos.
export function validateTime(value, field = "hora") {
  const text = requiredString(value, field);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) {
    throw createHttpError(400, `${field} invalida`);
  }
  return text;
}

// NEW FEATURE: garante intervalo horário coerente.
export function validateTimeRange(start, end) {
  const horaInicio = validateTime(start, "hora_inicio");
  const horaFim = validateTime(end, "hora_fim");
  if (horaInicio >= horaFim) {
    throw createHttpError(400, "hora_fim deve ser posterior a hora_inicio");
  }
  return { hora_inicio: horaInicio, hora_fim: horaFim };
}
