import { parsePositiveId } from "../validators/commonValidators.js";
import { validateReviewPayload } from "../validators/reviewValidator.js";
import {
  createServiceReview,
  getProviderReviews,
  getServiceReviews
} from "../services/reviewService.js";

// CLEAN ARCHITECTURE: avaliacoes por servico.
export async function byService(req, res) {
  const serviceId = parsePositiveId(req.params.id, "id_servico");
  return res.json(await getServiceReviews(serviceId));
}

// CLEAN ARCHITECTURE: avaliacoes do prestador.
export async function provider(req, res) {
  return res.json(await getProviderReviews(req.user));
}

// NEW FEATURE: cria avaliacao sem duplicados.
export async function create(req, res) {
  const payload = validateReviewPayload(req.body);
  const summary = await createServiceReview(req.user, payload);
  return res.status(201).json({
    message: "Avaliacao criada",
    rating: summary.rating,
    total_avaliacoes: summary.total_avaliacoes
  });
}
