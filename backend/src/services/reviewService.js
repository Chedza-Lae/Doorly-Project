import { createHttpError } from "../utils/httpError.js";
import {
  createReview,
  findReviewByClient,
  findReviewService,
  getReviewSummary,
  listProviderReviews,
  listReviewsByService
} from "../repositories/reviewRepository.js";

// CLEAN ARCHITECTURE: lista avaliações por serviço.
export function getServiceReviews(serviceId) {
  return listReviewsByService(serviceId);
}

// CLEAN ARCHITECTURE: lista avaliações do prestador/admin.
export function getProviderReviews(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderReviews(user);
}

// NEW FEATURE: impede avaliação duplicada do mesmo cliente para o mesmo serviço.
export async function createServiceReview(user, payload) {
  if (user.tipo !== "cliente") {
    throw createHttpError(403, "Apenas clientes podem avaliar serviços");
  }

  const service = await findReviewService(payload.id_servico);
  if (!service) {
    throw createHttpError(404, "Serviço não encontrado");
  }

  if (Number(service.id_prestador) === Number(user.id)) {
    throw createHttpError(400, "Não podes avaliar o teu próprio serviço");
  }

  const existing = await findReviewByClient(payload.id_servico, user.id);
  if (existing) {
    throw createHttpError(409, "Já avaliaste este serviço");
  }

  await createReview({
    id_servico: payload.id_servico,
    id_cliente: user.id,
    nota: payload.nota,
    comentario: payload.comentario
  });

  return getReviewSummary(payload.id_servico);
}
