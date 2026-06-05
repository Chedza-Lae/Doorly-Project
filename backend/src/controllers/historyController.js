import { parsePositiveId } from "../validators/commonValidators.js";
import { validateHistoryPayload } from "../validators/historyValidator.js";
import {
  createServiceHistory,
  getMyHistory,
  getProviderHistory,
  removeHistory
} from "../services/historyService.js";

// NEW FEATURE: historico do cliente autenticado.
export async function mine(req, res) {
  return res.json(await getMyHistory(req.user));
}

// NEW FEATURE: historico do prestador.
export async function provider(req, res) {
  return res.json(await getProviderHistory(req.user));
}

// NEW FEATURE: criar historico.
export async function create(req, res) {
  const payload = validateHistoryPayload(req.body);
  return res.status(201).json(await createServiceHistory(req.user, payload));
}

// NEW FEATURE: admin elimina historico.
export async function remove(req, res) {
  const id = parsePositiveId(req.params.id, "id_historico");
  await removeHistory(id);
  return res.json({ message: "Historico eliminado" });
}
