import { createHttpError } from "../utils/httpError.js";
import {
  addFavorite,
  findActiveService,
  listFavorites,
  removeFavorite
} from "../repositories/favoriteRepository.js";

// CLEAN ARCHITECTURE: lista favoritos do utilizador autenticado.
export function getFavorites(user) {
  return listFavorites(user.id);
}

// NEW FEATURE: adiciona favorito sem duplicados.
export async function addServiceFavorite(user, serviceId) {
  const service = await findActiveService(serviceId);
  if (!service) {
    throw createHttpError(404, "Serviço não encontrado");
  }

  const inserted = await addFavorite(user.id, serviceId);
  return { created: inserted > 0 };
}

// CLEAN ARCHITECTURE: remove favorito do utilizador autenticado.
export async function removeServiceFavorite(user, serviceId) {
  await removeFavorite(user.id, serviceId);
}
