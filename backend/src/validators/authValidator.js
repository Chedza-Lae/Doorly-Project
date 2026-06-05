import {
  optionalString,
  requiredString,
  validateEmail,
  validateStrongPassword
} from "./commonValidators.js";
import { createHttpError } from "../utils/httpError.js";

// CLEAN ARCHITECTURE: valida o registo fora da rota.
export function validateRegisterPayload(body) {
  const nome = requiredString(body.nome, "nome");
  const email = validateEmail(body.email);
  const password = validateStrongPassword(body.password);

  if (!body.acceptedTerms || !body.acceptedPrivacy) {
    throw createHttpError(400, "Tens de aceitar os termos e a politica de privacidade");
  }

  const tipo = body.tipo && body.tipo !== "admin" ? body.tipo : "cliente";
  if (!["cliente", "prestador"].includes(tipo)) {
    throw createHttpError(400, "Tipo de utilizador invalido");
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

// CLEAN ARCHITECTURE: valida atualizacao de perfil.
export function validateProfilePayload(body) {
  return {
    nome: requiredString(body.nome, "nome"),
    email: validateEmail(body.email),
    currentPassword: optionalString(body.currentPassword) || "",
    newPassword: optionalString(body.newPassword) || ""
  };
}
