import { optionalString, parsePositiveId } from "./commonValidators.js";

// NEW FEATURE: valida criação de histórico.
export function validateHistoryPayload(body) {
  return {
    id_servico: parsePositiveId(body.id_servico, "id_servico"),
    id_cliente: parsePositiveId(body.id_cliente, "id_cliente"),
    detalhes: optionalString(body.detalhes)
  };
}
