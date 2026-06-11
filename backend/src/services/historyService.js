import { createHttpError } from "../utils/httpError.js";
import {
  createHistory,
  deleteHistory,
  findServiceForHistory,
  listClientHistory,
  listProviderHistory
} from "../repositories/historyRepository.js";

// NEW FEATURE: histórico do cliente autenticado.
export function getMyHistory(user) {
  return listClientHistory(user.id);
}

// NEW FEATURE: histórico do prestador/admin.
export function getProviderHistory(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderHistory(user);
}

// NEW FEATURE: cria histórico quando serviço é concluído.
export async function createServiceHistory(user, payload) {
  const service = await findServiceForHistory(payload.id_servico);
  if (!service) {
    throw createHttpError(404, "Serviço não encontrado");
  }

  if (user.tipo !== "admin" && Number(service.id_prestador) !== Number(user.id)) {
    throw createHttpError(403, "Apenas o prestador ou admin pode criar histórico");
  }

  return createHistory({
    ...payload,
    id_prestador: service.id_prestador
  });
}

// NEW FEATURE: elimina histórico apenas admin.
export async function removeHistory(historyId) {
  const rowCount = await deleteHistory(historyId);
  if (rowCount === 0) {
    throw createHttpError(404, "Histórico não encontrado");
  }
}
