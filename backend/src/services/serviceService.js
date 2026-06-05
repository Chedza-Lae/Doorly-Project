import { createHttpError } from "../utils/httpError.js";
import { withTransaction } from "../utils/transactions.js";
import {
  createService,
  deleteServiceCascade,
  findDetailedServiceById,
  findServiceById,
  listProviderServices,
  listPublicServices,
  patchService,
  updateService
} from "../repositories/serviceRepository.js";
import {
  createStatisticsForService,
  incrementViews
} from "../repositories/statisticsRepository.js";
import { createAdminLog } from "../repositories/adminLogRepository.js";

function assertCanManageService(service, user) {
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  if (user.tipo !== "admin" && Number(service.id_prestador) !== Number(user.id)) {
    throw createHttpError(403, "Sem permissao para gerir este servico");
  }
}

// CLEAN ARCHITECTURE: lista publica de servicos.
export function getPublicServices(query) {
  return listPublicServices(query);
}

// CLEAN ARCHITECTURE: lista servicos do prestador.
export function getProviderServices(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderServices(user);
}

// SUPABASE MIGRATION: incrementa estatisticas antes de devolver detalhe.
export async function getServiceDetails(id) {
  const service = await findServiceById(id);
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  await incrementViews(id);
  return findDetailedServiceById(id);
}

// CLEAN ARCHITECTURE: cria servico e estatisticas na mesma transaction.
export async function createProviderService(user, payload, explicitProviderId = null) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Apenas prestadores podem criar servicos");
  }

  const id_prestador = user.tipo === "admin" && explicitProviderId ? explicitProviderId : user.id;

  const created = await withTransaction(async (client) => {
    const service = await createService({ ...payload, id_prestador }, client);
    await createStatisticsForService(service.id_servico, client);
    return service;
  });

  return findDetailedServiceById(created.id_servico);
}

// CLEAN ARCHITECTURE: modo dev mantido para compatibilidade.
export async function createDevService(payload) {
  const created = await withTransaction(async (client) => {
    const service = await createService(payload, client);
    await createStatisticsForService(service.id_servico, client);
    return service;
  });
  return findDetailedServiceById(created.id_servico);
}

// CLEAN ARCHITECTURE: update completo com permissao.
export async function updateProviderService(id, user, payload) {
  const service = await findServiceById(id);
  assertCanManageService(service, user);
  const ativo = payload.ativo == null ? service.ativo : Boolean(payload.ativo);
  await updateService(id, { ...payload, ativo });
  return findDetailedServiceById(id);
}

// CLEAN ARCHITECTURE: patch parcial com permissao.
export async function patchProviderService(id, user, payload) {
  const service = await findServiceById(id);
  assertCanManageService(service, user);
  await patchService(id, payload);
  return findDetailedServiceById(id);
}

// SUPABASE MIGRATION: delete cascade numa transaction pg.
export async function deleteProviderService(id, user) {
  const service = await findServiceById(id);
  assertCanManageService(service, user);

  await withTransaction(async (client) => {
    await deleteServiceCascade(id, client);
    if (user.tipo === "admin") {
      // NEW FEATURE: admin log automatico ao eliminar servico.
      await createAdminLog({
        admin_id: user.id,
        action: "DELETE_SERVICE",
        target_user_id: service.id_prestador,
        details: `Servico eliminado: ${id}`
      }, client);
    }
  });
}
