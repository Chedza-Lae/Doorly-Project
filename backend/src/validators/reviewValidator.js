import { optionalString, parsePositiveId, validateRating } from "./commonValidators.js";

// CLEAN ARCHITECTURE: valida avaliação.
export function validateReviewPayload(body) {
  return {
    id_servico: parsePositiveId(body.id_servico, "id_servico"),
    nota: validateRating(body.nota),
    comentario: optionalString(body.comentario) || ""
  };
}
