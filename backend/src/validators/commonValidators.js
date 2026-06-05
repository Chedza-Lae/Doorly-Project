import { createHttpError } from "../utils/httpError.js";

// CLEAN ARCHITECTURE: validadores reutilizaveis para todas as camadas HTTP.
export function parsePositiveId(value, field = "id") {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw createHttpError(400, `${field} invalido`);
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

// CLEAN ARCHITECTURE: valida email em auth/users.
export function validateEmail(value) {
  const email = requiredString(value, "email").toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createHttpError(400, "Email invalido");
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

// CLEAN ARCHITECTURE: valida precos e orcamentos.
export function validateNonNegativeNumber(value, field, { required = true } = {}) {
  if ((value == null || value === "") && !required) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw createHttpError(400, `${field} invalido`);
  }
  return number;
}

// CLEAN ARCHITECTURE: valida notas de avaliacao.
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
    throw createHttpError(400, `${field} invalido`);
  }
  return text;
}

// NEW FEATURE: valida datas ISO simples para agendamentos e pedidos.
export function validateDate(value, field = "data") {
  const text = requiredString(value, field);
  const date = new Date(`${text}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError(400, `${field} invalida`);
  }
  return text;
}

// NEW FEATURE: valida horarios HH:mm para agendamentos.
export function validateTime(value, field = "hora") {
  const text = requiredString(value, field);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) {
    throw createHttpError(400, `${field} invalida`);
  }
  return text;
}

// NEW FEATURE: garante intervalo horario coerente.
export function validateTimeRange(start, end) {
  const horaInicio = validateTime(start, "hora_inicio");
  const horaFim = validateTime(end, "hora_fim");
  if (horaInicio >= horaFim) {
    throw createHttpError(400, "hora_fim deve ser posterior a hora_inicio");
  }
  return { hora_inicio: horaInicio, hora_fim: horaFim };
}
