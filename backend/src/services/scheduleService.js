import { createHttpError } from "../utils/httpError.js";
import {
  createSchedule,
  deleteSchedule,
  findScheduleById,
  findScheduleConflict,
  findServiceForSchedule,
  listClientSchedules,
  listProviderSchedules,
  updateSchedule,
  updateScheduleStatus
} from "../repositories/scheduleRepository.js";

function assertCanAccessSchedule(user, schedule) {
  if (!schedule) {
    throw createHttpError(404, "Agendamento nao encontrado");
  }

  if (
    user.tipo !== "admin" &&
    Number(schedule.id_cliente) !== Number(user.id) &&
    Number(schedule.id_prestador) !== Number(user.id)
  ) {
    throw createHttpError(403, "Sem permissao para este agendamento");
  }
}

// NEW FEATURE: cria agendamento validando conflito.
export async function createServiceSchedule(user, payload) {
  const service = await findServiceForSchedule(payload.id_servico);
  if (!service) {
    throw createHttpError(404, "Servico nao encontrado");
  }

  if (Number(service.id_prestador) === Number(user.id)) {
    throw createHttpError(400, "Nao podes agendar o teu proprio servico");
  }

  const conflict = await findScheduleConflict({
    id_prestador: service.id_prestador,
    data_agendamento: payload.data_agendamento,
    hora_inicio: payload.hora_inicio,
    hora_fim: payload.hora_fim
  });

  if (conflict) {
    throw createHttpError(409, "Ja existe um agendamento nesse horario");
  }

  return createSchedule({
    ...payload,
    id_cliente: user.id,
    id_prestador: service.id_prestador
  });
}

// NEW FEATURE: agendamentos do cliente.
export function getMySchedules(user) {
  return listClientSchedules(user.id);
}

// NEW FEATURE: agendamentos do prestador/admin.
export function getProviderSchedules(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderSchedules(user);
}

// NEW FEATURE: edita agendamento com permissao e conflito.
export async function editSchedule(user, scheduleId, payload) {
  const schedule = await findScheduleById(scheduleId);
  assertCanAccessSchedule(user, schedule);

  const conflict = await findScheduleConflict({
    id_prestador: schedule.id_prestador,
    data_agendamento: payload.data_agendamento,
    hora_inicio: payload.hora_inicio,
    hora_fim: payload.hora_fim,
    ignoreId: scheduleId
  });

  if (conflict) {
    throw createHttpError(409, "Ja existe um agendamento nesse horario");
  }

  return updateSchedule(scheduleId, payload);
}

// NEW FEATURE: atualiza estado do agendamento.
export async function changeScheduleStatus(user, scheduleId, estado) {
  const schedule = await findScheduleById(scheduleId);
  assertCanAccessSchedule(user, schedule);

  if (user.tipo === "cliente" && !["pendente", "recusado"].includes(estado)) {
    throw createHttpError(403, "Cliente so pode cancelar ou repor pendencia");
  }

  return updateScheduleStatus(scheduleId, estado);
}

// NEW FEATURE: elimina agendamento com permissao.
export async function removeSchedule(user, scheduleId) {
  const schedule = await findScheduleById(scheduleId);
  assertCanAccessSchedule(user, schedule);

  const rowCount = await deleteSchedule(scheduleId);
  if (rowCount === 0) {
    throw createHttpError(404, "Agendamento nao encontrado");
  }
}
