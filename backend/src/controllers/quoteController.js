import { parsePositiveId } from "../validators/commonValidators.js";
import {
  validateQuotePayload,
  validateQuoteStatus
} from "../validators/quoteValidator.js";
import {
  changeQuoteStatus,
  createBudgetRequest,
  editQuote,
  getMyQuotes,
  getProviderQuotes,
  getQuote,
  removeQuote
} from "../services/quoteService.js";

// CLEAN ARCHITECTURE: cria pedido de orcamento.
export async function create(req, res) {
  const payload = validateQuotePayload(req.body);
  const result = await createBudgetRequest(req.user, payload);
  return res.status(201).json({
    message: "Pedido de orcamento enviado",
    ...result
  });
}

// NEW FEATURE: CRUD - pedidos do cliente.
export async function mine(req, res) {
  return res.json(await getMyQuotes(req.user));
}

// CLEAN ARCHITECTURE: pedidos do prestador.
export async function provider(req, res) {
  return res.json(await getProviderQuotes(req.user));
}

// NEW FEATURE: CRUD - detalhe.
export async function details(req, res) {
  const id = parsePositiveId(req.params.id, "id_orcamento");
  return res.json(await getQuote(req.user, id));
}

// NEW FEATURE: CRUD - editar.
export async function update(req, res) {
  const id = parsePositiveId(req.params.id, "id_orcamento");
  const payload = validateQuotePayload(req.body);
  return res.json(await editQuote(req.user, id, payload));
}

// NEW FEATURE: atualizacao de estado.
export async function status(req, res) {
  const id = parsePositiveId(req.params.id, "id_orcamento");
  const estado = validateQuoteStatus(req.body);
  await changeQuoteStatus(req.user, id, estado);
  return res.json({ message: "Estado atualizado" });
}

// NEW FEATURE: CRUD - eliminar.
export async function remove(req, res) {
  const id = parsePositiveId(req.params.id, "id_orcamento");
  await removeQuote(req.user, id);
  return res.json({ message: "Pedido eliminado" });
}
