import { parsePositiveId, requiredString } from "./commonValidators.js";

// CLEAN ARCHITECTURE: valida envio inicial de mensagem.
export function validateCreateMessagePayload(body) {
  return {
    id_servico: parsePositiveId(body.id_servico ?? body.service_id, "id_servico"),
    conteudo: requiredString(body.conteudo ?? body.content, "conteudo")
  };
}

// CLEAN ARCHITECTURE: valida thread.
export function validateThreadQuery(query) {
  return {
    id_servico: parsePositiveId(query.id_servico ?? query.service_id, "id_servico"),
    other_id: parsePositiveId(query.other_id, "other_id")
  };
}

// CLEAN ARCHITECTURE: valida resposta de mensagem.
export function validateReplyPayload(body) {
  return {
    id_servico: parsePositiveId(body.id_servico ?? body.service_id, "id_servico"),
    other_id: parsePositiveId(body.other_id, "other_id"),
    conteudo: requiredString(body.conteudo ?? body.content, "conteudo")
  };
}
