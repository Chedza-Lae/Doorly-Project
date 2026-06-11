import {
  optionalString,
  requiredString,
  validateEmail,
  validateOptionalUrl,
  validateStrongPassword
} from "./commonValidators.js";
import { createHttpError } from "../utils/httpError.js";

// CLEAN ARCHITECTURE: valida o registo fora da rota.
export function validateRegisterPayload(body) {
  const nome = requiredString(body.nome, "nome");
  const email = validateEmail(body.email);
  const password = validateStrongPassword(body.password);

  if (!body.acceptedTerms || !body.acceptedPrivacy) {
    throw createHttpError(400, "Tens de aceitar os termos e a política de privacidade");
  }

  const tipo = body.tipo && body.tipo !== "admin" ? body.tipo : "cliente";
  if (!["cliente", "prestador"].includes(tipo)) {
    throw createHttpError(400, "Tipo de utilizador inválido");
  }

  return { nome, email, password, tipo };
}

// CLEAN ARCHITECTURE: valida login.
export function validateLoginPayload(body) {
  return {
    email: validateEmail(body.email),
    password: requiredString(body.password, "password")
  };
}

// CLEAN ARCHITECTURE: valida forgot password.
export function validateForgotPasswordPayload(body) {
  return { email: validateEmail(body.email) };
}

// CLEAN ARCHITECTURE: valida reset password.
export function validateResetPasswordPayload(body) {
  return { password: validateStrongPassword(body.password) };
}

// CLEAN ARCHITECTURE: valida atualização de perfil.
export function validateProfilePayload(body) {
  return {
    nome: requiredString(body.nome, "nome"),
    telefone: optionalString(body.telefone),
    localizacao: optionalString(body.localizacao),
    profissao: optionalString(body.profissao),
    descricao: optionalString(body.descricao),
    foto_perfil: validateOptionalUrl(body.foto_perfil, "foto_perfil")
  };
}

// CLEAN ARCHITECTURE: valida alteração de password fora da rota.
export function validatePasswordPayload(body) {
  const currentPassword = requiredString(body.currentPassword, "currentPassword");
  const newPassword = validateStrongPassword(body.newPassword);

  return { currentPassword, newPassword };
}
