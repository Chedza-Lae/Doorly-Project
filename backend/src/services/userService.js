import bcrypt from "bcrypt";
import { createHttpError } from "../utils/httpError.js";
import {
  findOtherUserByEmail,
  findProfileById,
  findUserById,
  updateProfile
} from "../repositories/userRepository.js";

// CLEAN ARCHITECTURE: carrega perfil autenticado.
export async function getProfile(userId) {
  const user = await findProfileById(userId);
  if (!user) {
    throw createHttpError(404, "Utilizador nao encontrado");
  }
  return user;
}

// CLEAN ARCHITECTURE: atualiza perfil com verificacao de email e password atual.
export async function updateMyProfile(userId, payload) {
  const existingEmail = await findOtherUserByEmail(payload.email, userId);
  if (existingEmail) {
    throw createHttpError(400, "Email ja esta em uso");
  }

  let password_hash = null;
  if (payload.newPassword) {
    if (payload.newPassword.length < 8) {
      throw createHttpError(400, "A nova password deve ter pelo menos 8 caracteres");
    }

    const user = await findUserById(userId);
    if (!user) {
      throw createHttpError(404, "Utilizador nao encontrado");
    }

    const matches = await bcrypt.compare(payload.currentPassword, user.password_hash);
    if (!matches) {
      throw createHttpError(400, "Password atual incorreta");
    }

    password_hash = await bcrypt.hash(payload.newPassword, 10);
  }

  return updateProfile(userId, {
    nome: payload.nome,
    email: payload.email,
    password_hash
  });
}
