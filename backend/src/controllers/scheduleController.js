import { parsePositiveId } from "../validators/commonValidators.js";
import {
  validateSchedulePayload,
  validateScheduleStatus
} from "../validators/scheduleValidator.js";
import {
  changeScheduleStatus,
  createServiceSchedule,
  editSchedule,
  getMySchedules,
  getProviderSchedules,
  removeSchedule
} from "../services/scheduleService.js";

// NEW FEATURE: cria agendamento.
export async function create(req, res) {
  const payload = validateSchedulePayload(req.body);
  return res.status(201).json(await createServiceSchedule(req.user, payload));
}

// NEW FEATURE: agendamentos do cliente.
export async function mine(req, res) {
  return res.json(await getMySchedules(req.user));
}

// NEW FEATURE: agendamentos do prestador.
export async function provider(req, res) {
  return res.json(await getProviderSchedules(req.user));
}

// NEW FEATURE: edita agendamento.
export async function update(req, res) {
  const id = parsePositiveId(req.params.id, "id_agendamento");
  const payload = validateSchedulePayload(req.body);
  return res.json(await editSchedule(req.user, id, payload));
}

// NEW FEATURE: atualiza estado.
export async function status(req, res) {
  const id = parsePositiveId(req.params.id, "id_agendamento");
  const estado = validateScheduleStatus(req.body);
  return res.json(await changeScheduleStatus(req.user, id, estado));
}

// NEW FEATURE: elimina agendamento.
export async function remove(req, res) {
  const id = parsePositiveId(req.params.id, "id_agendamento");
  await removeSchedule(req.user, id);
  return res.json({ message: "Agendamento eliminado" });
}
