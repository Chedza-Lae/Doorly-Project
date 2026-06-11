import { parsePositiveId, requiredString } from "../validators/commonValidators.js";
import {
  banUser,
  changeUserRole,
  getAdminLogs,
  getAdminServices,
  getAdminUsers,
  removeServiceAsAdmin,
  removeUserAsAdmin,
  resetUserPassword,
  unbanUser
} from "../services/adminService.js";

// CLEAN ARCHITECTURE: logs admin.
export async function logs(req, res) {
  return res.json(await getAdminLogs());
}

// CLEAN ARCHITECTURE: users admin.
export async function users(req, res) {
  return res.json(await getAdminUsers());
}

// NEW FEATURE: eliminar utilizador com log.
export async function removeUser(req, res) {
  const id = parsePositiveId(req.params.id, "id_utilizador");
  await removeUserAsAdmin(req.user, id);
  return res.json({ message: "Utilizador eliminado" });
}

// CLEAN ARCHITECTURE: services admin.
export async function services(req, res) {
  return res.json(await getAdminServices());
}

// NEW FEATURE: eliminar serviço com log.
export async function removeService(req, res) {
  const id = parsePositiveId(req.params.id, "id_servico");
  await removeServiceAsAdmin(req.user, id);
  return res.json({ message: "Serviço eliminado" });
}

// CLEAN ARCHITECTURE: reset password admin.
export async function resetPassword(req, res) {
  const id = parsePositiveId(req.params.id, "id_utilizador");
  const password = requiredString(req.body.password, "password");
  await resetUserPassword(id, password);
  return res.json({ message: "Password alterada com sucesso" });
}

// NEW FEATURE: banir utilizador com log.
export async function ban(req, res) {
  const id = parsePositiveId(req.params.id, "id_utilizador");
  await banUser(req.user, id, req.body.reason || "Violação dos termos");
  return res.json({ message: "Utilizador banido com sucesso" });
}

// NEW FEATURE: desbanir utilizador com log.
export async function unban(req, res) {
  const id = parsePositiveId(req.params.id, "id_utilizador");
  await unbanUser(req.user, id);
  return res.json({ message: "Utilizador reativado" });
}

// NEW FEATURE: alterar permissões com log.
export async function role(req, res) {
  const id = parsePositiveId(req.params.id, "id_utilizador");
  const tipo = requiredString(req.body.tipo, "tipo");
  await changeUserRole(req.user, id, tipo);
  return res.json({ message: "Permissões atualizadas" });
}
