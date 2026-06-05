import { parsePositiveId } from "../validators/commonValidators.js";
import {
  addServiceFavorite,
  getFavorites,
  removeServiceFavorite
} from "../services/favoriteService.js";

// CLEAN ARCHITECTURE: lista favoritos.
export async function list(req, res) {
  return res.json(await getFavorites(req.user));
}

// NEW FEATURE: adiciona favorito sem duplicados.
export async function create(req, res) {
  const serviceId = parsePositiveId(req.body.id_servico, "id_servico");
  const result = await addServiceFavorite(req.user, serviceId);
  return res.status(result.created ? 201 : 200).json({ success: true });
}

// CLEAN ARCHITECTURE: remove favorito.
export async function remove(req, res) {
  const serviceId = parsePositiveId(req.body.id_servico, "id_servico");
  await removeServiceFavorite(req.user, serviceId);
  return res.json({ success: true });
}
