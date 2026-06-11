import {
  optionalString,
  parsePositiveId,
  requiredString,
  validateEnum,
  validateNonNegativeNumber
} from "./commonValidators.js";

// NEW FEATURE: estados novos para contrapropostas.
export const quoteStates = ["novo", "aceite", "rejeitado", "concluido"];

// CLEAN ARCHITECTURE: estados antigos ainda aceites para não quebrar o frontend existente.
export const compatibleQuoteStates = [...quoteStates, "em_analise", "respondido", "fechado"];

// CLEAN ARCHITECTURE: valida criação/edição de contraproposta.
export function validateQuotePayload(body, { partial = false } = {}) {
  const payload = {};

  if (!partial || body.id_servico != null) {
    payload.id_servico = parsePositiveId(body.id_servico, "id_servico");
  }
  if (!partial || body.detalhes != null) {
    payload.detalhes = requiredString(body.detalhes, "detalhes");
  }

  payload.localizacao = optionalString(body.localizacao);
  payload.data_preferida = optionalString(body.data_preferida);
  payload.periodo = optionalString(body.periodo) || "Flexível";
  payload.urgencia = optionalString(body.urgencia) || "Normal";
  payload.orcamento_estimado = validateNonNegativeNumber(body.orcamento_estimado, "contraproposta", { required: false });
  payload.contacto = optionalString(body.contacto);

  return payload;
}

// CLEAN ARCHITECTURE: valida estado da contraproposta.
export function validateQuoteStatus(body) {
  return validateEnum(body.estado, compatibleQuoteStates, "estado");
}
