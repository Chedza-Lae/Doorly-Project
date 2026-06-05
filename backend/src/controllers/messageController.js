import {
  validateCreateMessagePayload,
  validateReplyPayload,
  validateThreadQuery
} from "../validators/messageValidator.js";
import {
  getInbox,
  getThread,
  replyToMessage,
  sendInitialMessage
} from "../services/messageService.js";

// CLEAN ARCHITECTURE: envia mensagem inicial.
export async function create(req, res) {
  const payload = validateCreateMessagePayload(req.body);
  const result = await sendInitialMessage(req.user, payload);
  return res.json({ message: "Mensagem enviada com sucesso", ...result });
}

// CLEAN ARCHITECTURE: inbox.
export async function inbox(req, res) {
  return res.json(await getInbox(req.user));
}

// CLEAN ARCHITECTURE: conversa.
export async function thread(req, res) {
  const payload = validateThreadQuery(req.query);
  return res.json(await getThread(req.user, payload));
}

// CLEAN ARCHITECTURE: resposta.
export async function reply(req, res) {
  const payload = validateReplyPayload(req.body);
  await replyToMessage(req.user, payload);
  return res.json({ message: "Resposta enviada" });
}
