import {
  optionalString,
  parsePositiveId,
  requiredString,
  validateEnum,
  validateNonNegativeNumber
} from "./commonValidators.js";

// NEW FEATURE: estados novos pedidos para pedidos de orcamento.
export const quoteStates = ["novo", "aceite", "rejeitado", "concluido"];

// CLEAN ARCHITECTURE: estados antigos ainda aceites para nao quebrar o frontend existente.
export const compatibleQuoteStates = [...quoteStates, "em_analise", "respondido", "fechado"];

// CLEAN ARCHITECTURE: valida criacao/edicao de pedido de orcamento.
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
  payload.periodo = optionalString(body.periodo) || "Flexivel";
  payload.urgencia = optionalString(body.urgencia) || "Normal";
  payload.orcamento_estimado = validateNonNegativeNumber(body.orcamento_estimado, "orcamento", { required: false });
  payload.contacto = optionalString(body.contacto);

  return payload;
}

// CLEAN ARCHITECTURE: valida estado do pedido.
export function validateQuoteStatus(body) {
  return validateEnum(body.estado, compatibleQuoteStates, "estado");
}
