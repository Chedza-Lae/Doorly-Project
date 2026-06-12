import bcrypt from "bcrypt";
import { createHttpError } from "../utils/httpError.js";
import {
  findProfileById,
  findUserById,
  updateAccountPassword,
  updateProfile,
  updateProfilePhoto
} from "../repositories/userRepository.js";
import { uploadProfileImage } from "../utils/profileStorage.js";

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

// CLEAN ARCHITECTURE: upload de foto de perfil e persistencia da URL publica.
export async function updateMyProfilePhoto(userId, payload) {
  const user = await findUserById(userId);
  if (!user) {
    throw createHttpError(404, "Utilizador nao encontrado");
  }

  const publicUrl = await uploadProfileImage(userId, payload);
  const updated = await updateProfilePhoto(userId, publicUrl);
  if (!updated) {
    throw createHttpError(404, "Utilizador nao encontrado");
  }

  return updated;
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
