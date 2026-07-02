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
import { uploadServiceImage } from "../utils/profileStorage.js";

function assertCanManageService(service, user) {
  if (!service) {
    throw createHttpError(404, "Serviço não encontrado");
  }

  if (user.tipo !== "admin" && Number(service.id_prestador) !== Number(user.id)) {
    throw createHttpError(403, "Sem permissão para gerir este serviço");
  }
}

function assertCanDeleteProviderService(service, user) {
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Apenas prestadores podem eliminar servicos nesta rota");
  }

  if (user.tipo !== "admin" && Number(service.id_prestador) !== Number(user.id)) {
    throw createHttpError(403, "Este servico nao pertence ao prestador autenticado");
  }
}

// CLEAN ARCHITECTURE: lista publica de serviços.
export function getPublicServices(query) {
  return listPublicServices(query);
}

// CLEAN ARCHITECTURE: lista serviços do prestador.
export function getProviderServices(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderServices(user);
}

// SUPABASE MIGRATION: incrementa estatísticas antes de devolver detalhe.
export async function getServiceDetails(id) {
  const service = await findServiceById(id);
  if (!service) {
    throw createHttpError(404, "Serviço não encontrado");
  }

  await incrementViews(id);
  return findDetailedServiceById(id);
}

// CLEAN ARCHITECTURE: cria serviço e estatísticas na mesma transaction.
export async function createProviderService(user, payload, explicitProviderId = null) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Apenas prestadores podem criar serviços");
  }

  const id_prestador = user.tipo === "admin" && explicitProviderId ? explicitProviderId : user.id;

  const created = await withTransaction(async (client) => {
    const service = await createService({ ...payload, id_prestador }, client);
    await createStatisticsForService(service.id_servico, client);
    return service;
  });

  return findDetailedServiceById(created.id_servico);
}

// CLEAN ARCHITECTURE: update completo com permissão.
export async function uploadProviderServiceImage(user, payload) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Apenas prestadores podem enviar imagens de servicos");
  }

  const url = await uploadServiceImage(user.id, payload);
  return { url };
}

export async function updateProviderService(id, user, payload) {
  const service = await findServiceById(id);
  assertCanManageService(service, user);
  const ativo = payload.ativo == null ? service.ativo : Boolean(payload.ativo);
  await updateService(id, { ...payload, ativo });
  return findDetailedServiceById(id);
}

// CLEAN ARCHITECTURE: patch parcial com permissão.
export async function patchProviderService(id, user, payload) {
  const service = await findServiceById(id);
  assertCanManageService(service, user);
  await patchService(id, payload);
  return findDetailedServiceById(id);
}

// SUPABASE MIGRATION: delete cascade numa transaction pg.
export async function deleteProviderService(id, user) {
  const service = await findServiceById(id);
  assertCanDeleteProviderService(service, user);

  await withTransaction(async (client) => {
    const rowCount = await deleteServiceCascade(id, client);
    if (rowCount === 0) {
      throw createHttpError(404, "Servico nao encontrado");
    }
  });
}
