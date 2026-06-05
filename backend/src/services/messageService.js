import { createHttpError } from "../utils/httpError.js";
import {
  createMessage,
  findMessageService,
  listInbox,
  listThread
} from "../repositories/messageRepository.js";

// CLEAN ARCHITECTURE: envio inicial de mensagem.
export async function sendInitialMessage(user, payload) {
  const service = await findMessageService(payload.id_servico);
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  const id_destinatario = service.id_prestador;
  if (Number(id_destinatario) === Number(user.id)) {
    throw createHttpError(400, "Nao podes enviar mensagem para ti mesmo");
  }

  await createMessage({
    id_servico: payload.id_servico,
    id_remetente: user.id,
    id_destinatario,
    conteudo: payload.conteudo
  });

  return { other_id: id_destinatario };
}

// CLEAN ARCHITECTURE: inbox do utilizador.
export function getInbox(user) {
  return listInbox(user.id);
}

// CLEAN ARCHITECTURE: thread do utilizador.
export function getThread(user, payload) {
  return listThread({ ...payload, userId: user.id });
}

// CLEAN ARCHITECTURE: resposta em thread.
export async function replyToMessage(user, payload) {
  if (Number(payload.other_id) === Number(user.id)) {
    throw createHttpError(400, "Nao podes responder para ti mesmo");
  }

  const service = await findMessageService(payload.id_servico);
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  await createMessage({
    id_servico: payload.id_servico,
    id_remetente: user.id,
    id_destinatario: payload.other_id,
    conteudo: payload.conteudo
  });
}
