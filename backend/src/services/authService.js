import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../utils/sendEmail.js";
import { createHttpError } from "../utils/httpError.js";
import {
  createUser,
  findUserByEmail,
  findUserByResetToken,
  setResetToken,
  updatePassword
} from "../repositories/userRepository.js";
import { getUserAccessError } from "../utils/userAccess.js";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw createHttpError(500, "JWT_SECRET não configurado");
  }
  return process.env.JWT_SECRET;
}

// CLEAN ARCHITECTURE: service de registo com regras de negocio fora da rota.
export async function registerUser(payload) {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw createHttpError(400, "Email já registado");
  }

  const password_hash = await bcrypt.hash(payload.password, 10);
  return createUser({ ...payload, password_hash });
}

// CLEAN ARCHITECTURE: service de login e JWT.
export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(400, "Credenciais inválidas");
  }

  const accessError = getUserAccessError(user);
  if (accessError) {
    throw createHttpError(403, accessError);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw createHttpError(400, "Credenciais inválidas");
  }

  const token = jwt.sign(
    {
      id: user.id_utilizador,
      tipo: user.tipo,
      email: user.email
    },
    getJwtSecret(),
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id_utilizador,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo
    }
  };
}

// NEW FEATURE: refresh token simples preservando contrato JWT quando usado pelo frontend.
export function refreshAuthToken(user) {
  const token = jwt.sign(
    { id: user.id, tipo: user.tipo, email: user.email },
    getJwtSecret(),
    { expiresIn: "1d" }
  );
  return { token };
}

// CLEAN ARCHITECTURE: forgot password.
export async function forgotPassword({ email }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, "Utilizador não encontrado");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000);
  await setResetToken(user.id_utilizador, token, expires);

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl.replace(/\/$/, "")}/reset-password/${token}`;
  await sendResetEmail(user.email, resetLink);
}

// CLEAN ARCHITECTURE: reset password.
export async function resetPassword(token, { password }) {
  const user = await findUserByResetToken(token);
  if (!user) {
    throw createHttpError(400, "Token inválido ou expirado");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await updatePassword(user.id_utilizador, passwordHash);
}
