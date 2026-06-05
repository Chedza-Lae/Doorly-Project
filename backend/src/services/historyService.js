import { createHttpError } from "../utils/httpError.js";
import {
  createHistory,
  deleteHistory,
  findServiceForHistory,
  listClientHistory,
  listProviderHistory
} from "../repositories/historyRepository.js";

// NEW FEATURE: historico do cliente autenticado.
export function getMyHistory(user) {
  return listClientHistory(user.id);
}

// NEW FEATURE: historico do prestador/admin.
export function getProviderHistory(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderHistory(user);
}

// NEW FEATURE: cria historico quando servico e concluido.
export async function createServiceHistory(user, payload) {
  const service = await findServiceForHistory(payload.id_servico);
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  if (user.tipo !== "admin" && Number(service.id_prestador) !== Number(user.id)) {
    throw createHttpError(403, "Apenas o prestador ou admin pode criar historico");
  }

  return createHistory({
    ...payload,
    id_prestador: service.id_prestador
  });
}

// NEW FEATURE: elimina historico apenas admin.
export async function removeHistory(historyId) {
  const rowCount = await deleteHistory(historyId);
  if (rowCount === 0) {
    throw createHttpError(404, "Historico nao encontrado");
  }
}
