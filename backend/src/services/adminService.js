import bcrypt from "bcrypt";
import { createHttpError } from "../utils/httpError.js";
import { withTransaction } from "../utils/transactions.js";
import { createAdminLog, listAdminLogs } from "../repositories/adminLogRepository.js";
import {
  deleteUserCascade,
  listUsers,
  updatePassword,
  updateUserRole,
  updateUserStatus
} from "../repositories/userRepository.js";
import {
  deleteServiceCascade,
  listAdminServices
} from "../repositories/serviceRepository.js";

// CLEAN ARCHITECTURE: lista logs admin.
export function getAdminLogs() {
  return listAdminLogs();
}

// CLEAN ARCHITECTURE: lista utilizadores admin.
export function getAdminUsers() {
  return listUsers();
}

// CLEAN ARCHITECTURE: lista serviços admin.
export function getAdminServices() {
  return listAdminServices();
}

// NEW FEATURE: eliminar utilizador com admin log automático.
export async function removeUserAsAdmin(admin, userId) {
  await withTransaction(async (client) => {
    const rowCount = await deleteUserCascade(userId, client);
    if (rowCount === 0) {
      throw createHttpError(404, "Utilizador não encontrado");
    }

    await createAdminLog({
      admin_id: admin.id,
      action: "DELETE_USER",
      target_user_id: userId,
      details: `Utilizador eliminado: ${userId}`
    }, client);
  });
}

// NEW FEATURE: eliminar serviço com admin log automático.
export async function removeServiceAsAdmin(admin, serviceId) {
  await withTransaction(async (client) => {
    const rowCount = await deleteServiceCascade(serviceId, client);
    if (rowCount === 0) {
      throw createHttpError(404, "Serviço não encontrado");
    }

    await createAdminLog({
      admin_id: admin.id,
      action: "DELETE_SERVICE",
      target_user_id: null,
      details: `Serviço eliminado: ${serviceId}`
    }, client);
  });
}

// CLEAN ARCHITECTURE: reset password admin.
export async function resetUserPassword(userId, password) {
  if (!password || password.length < 5) {
    throw createHttpError(400, "Password deve ter pelo menos 5 caracteres");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const rowCount = await updatePassword(userId, hashedPassword);

  if (rowCount === 0) {
    throw createHttpError(404, "Utilizador nÃ£o encontrado");
  }
}

// NEW FEATURE: banir utilizador com log automático.
export async function banUser(admin, userId, reason = "Violação dos termos") {
  const rowCount = await updateUserStatus(userId, {
    status: "banido",
    ban_reason: reason
  });

  if (rowCount === 0) {
    throw createHttpError(404, "Utilizador não encontrado");
  }

  await createAdminLog({
    admin_id: admin.id,
    action: "BAN_USER",
    target_user_id: userId,
    details: reason
  });
}

// NEW FEATURE: desbanir utilizador com log automático.
export async function unbanUser(admin, userId) {
  const rowCount = await updateUserStatus(userId, {
    status: "ativo",
    ban_reason: null,
    ban_until: null
  });

  if (rowCount === 0) {
    throw createHttpError(404, "Utilizador não encontrado");
  }

  await createAdminLog({
    admin_id: admin.id,
    action: "UNBAN_USER",
    target_user_id: userId,
    details: "Reativado pelo admin"
  });
}

// NEW FEATURE: alterar permissões com log automático.
export async function changeUserRole(admin, userId, tipo) {
  if (!["cliente", "prestador", "admin"].includes(tipo)) {
    throw createHttpError(400, "Tipo de utilizador inválido");
  }

  const rowCount = await updateUserRole(userId, tipo);
  if (rowCount === 0) {
    throw createHttpError(404, "Utilizador não encontrado");
  }

  await createAdminLog({
    admin_id: admin.id,
    action: "CHANGE_ROLE",
    target_user_id: userId,
    details: `Novo tipo: ${tipo}`
  });
}
