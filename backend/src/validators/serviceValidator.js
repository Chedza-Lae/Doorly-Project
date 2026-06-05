import {
  optionalString,
  requiredString,
  validateNonNegativeNumber
} from "./commonValidators.js";
import { createHttpError } from "../utils/httpError.js";

// CLEAN ARCHITECTURE: campos permitidos para PATCH seguro.
export const allowedServiceUpdateFields = [
  "titulo",
  "descricao",
  "categoria",
  "preco",
  "localizacao",
  "ativo",
  "imagem_url"
];

// CLEAN ARCHITECTURE: valida payload completo de servico.
export function validateServicePayload(body) {
  return {
    titulo: requiredString(body.titulo, "titulo"),
    descricao: requiredString(body.descricao, "descricao"),
    categoria: requiredString(body.categoria, "categoria"),
    preco: validateNonNegativeNumber(body.preco, "preco"),
    localizacao: optionalString(body.localizacao),
    imagem_url: optionalString(body.imagem_url)
  };
}

// CLEAN ARCHITECTURE: valida payload parcial de servico.
export function validatePartialServicePayload(body) {
  const entries = allowedServiceUpdateFields
    .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
    .map((field) => {
      if (field === "ativo") return [field, Boolean(body[field])];
      if (field === "preco") return [field, validateNonNegativeNumber(body[field], "preco")];
      return [field, optionalString(body[field])];
    });

  if (!entries.length) {
    throw createHttpError(400, "Nenhum campo para atualizar");
  }

  return Object.fromEntries(entries);
}
