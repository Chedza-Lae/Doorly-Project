import { createHttpError } from "../utils/httpError.js";
import { withTransaction } from "../utils/transactions.js";
import { createMessage } from "../repositories/messageRepository.js";
import { incrementRequests } from "../repositories/statisticsRepository.js";
import {
  createQuote,
  deleteQuote,
  findActiveQuoteService,
  findQuoteById,
  linkQuoteMessage,
  listClientQuotes,
  listProviderQuotes,
  updateQuote,
  updateQuoteStatus
} from "../repositories/quoteRepository.js";

function buildQuoteMessage({ service, user, body }) {
  return [
    "Pedido de orcamento",
    "",
    `Servico: ${service.titulo}`,
    `Cliente: ${user.email}`,
    `Detalhes: ${body.detalhes}`,
    `Localizacao: ${body.localizacao || "A combinar"}`,
    `Data preferida: ${body.data_preferida || "A combinar"}`,
    `Periodo: ${body.periodo || "Flexivel"}`,
    `Urgencia: ${body.urgencia || "Normal"}`,
    `Orcamento aproximado: ${body.orcamento_estimado ? `${body.orcamento_estimado} EUR` : "A combinar"}`,
    `Contacto: ${body.contacto || user.email || "A combinar"}`
  ].join("\n");
}

// CLEAN ARCHITECTURE: cria pedido, mensagem e estatisticas numa transaction.
export async function createBudgetRequest(user, payload) {
  const service = await findActiveQuoteService(payload.id_servico);
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  if (Number(service.id_prestador) === Number(user.id)) {
    throw createHttpError(400, "Nao podes pedir orcamento ao teu proprio servico");
  }

  return withTransaction(async (client) => {
    const quote = await createQuote({
      ...payload,
      id_cliente: user.id,
      id_prestador: service.id_prestador,
      contacto: payload.contacto || user.email || null
    }, client);

    const message = await createMessage({
      id_servico: service.id_servico,
      id_remetente: user.id,
      id_destinatario: service.id_prestador,
      conteudo: buildQuoteMessage({ service, user, body: payload })
    }, client);

    await linkQuoteMessage(quote.id_orcamento, message.idmensagens, client);
    await incrementRequests(service.id_servico, client);

    return {
      id_orcamento: quote.id_orcamento,
      other_id: service.id_prestador
    };
  });
}

// NEW FEATURE: CRUD - pedidos do cliente.
export function getMyQuotes(user) {
  return listClientQuotes(user.id);
}

// CLEAN ARCHITECTURE: pedidos do prestador/admin.
export function getProviderQuotes(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderQuotes(user);
}

// NEW FEATURE: CRUD - detalhe com permissao.
export async function getQuote(user, quoteId) {
  const quote = await findQuoteById(quoteId);
  if (!quote) {
    throw createHttpError(404, "Pedido nao encontrado");
  }

  if (user.tipo !== "admin" && Number(quote.id_cliente) !== Number(user.id) && Number(quote.id_prestador) !== Number(user.id)) {
    throw createHttpError(403, "Sem permissao para consultar este pedido");
  }

  return quote;
}

// NEW FEATURE: CRUD - editar pedido pelo cliente/admin.
export async function editQuote(user, quoteId, payload) {
  const quote = await getQuote(user, quoteId);
  if (user.tipo !== "admin" && Number(quote.id_cliente) !== Number(user.id)) {
    throw createHttpError(403, "Apenas o cliente pode editar este pedido");
  }

  const updated = await updateQuote(quoteId, payload);
  if (!updated) {
    throw createHttpError(404, "Pedido nao encontrado");
  }
  return updated;
}

// NEW FEATURE: atualizacao de estado.
export async function changeQuoteStatus(user, quoteId, estado) {
  const rowCount = await updateQuoteStatus(quoteId, estado, user);
  if (rowCount === 0) {
    throw createHttpError(404, "Pedido nao encontrado");
  }
}

// NEW FEATURE: CRUD - eliminar pedido.
export async function removeQuote(user, quoteId) {
  const rowCount = await deleteQuote(quoteId, user);
  if (rowCount === 0) {
    throw createHttpError(404, "Pedido nao encontrado");
  }
}
