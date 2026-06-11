import bcrypt from "bcrypt";
import { createHttpError } from "../utils/httpError.js";
import {
  findProfileById,
  findUserById,
  updateAccountPassword,
  updateProfile
} from "../repositories/userRepository.js";

// CLEAN ARCHITECTURE: carrega perfil autenticado.
export async function getProfile(userId) {
  const user = await findProfileById(userId);
  if (!user) {
    throw createHttpError(404, "Utilizador não encontrado");
  }
  return user;
}

// CLEAN ARCHITECTURE: atualiza apenas campos editáveis do perfil.
export async function updateMyProfile(userId, payload) {
  const user = await findUserById(userId);
  if (!user) {
    throw createHttpError(404, "Utilizador não encontrado");
  }

  return updateProfile(userId, payload);
}

// CLEAN ARCHITECTURE: password fica num fluxo isolado do perfil.
export async function updateMyPassword(userId, { currentPassword, newPassword }) {
  const user = await findUserById(userId);
  if (!user) {
    throw createHttpError(404, "Utilizador não encontrado");
  }

  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    throw createHttpError(400, "Password atual incorreta");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateAccountPassword(userId, passwordHash);
}
