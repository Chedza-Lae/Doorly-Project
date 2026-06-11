import { createHttpError } from "../utils/httpError.js";
import {
  createSchedule,
  deleteSchedule,
  findScheduleById,
  findScheduleConflict,
  findServiceForSchedule,
  listAllSchedules,
  listClientSchedules,
  listProviderSchedules,
  updateSchedule,
  updateScheduleStatus
} from "../repositories/scheduleRepository.js";

function assertCanAccessSchedule(user, schedule) {
  if (!schedule) {
    throw createHttpError(404, "Agendamento não encontrado");
  }

  if (
    user.tipo !== "admin" &&
    Number(schedule.cliente_id ?? schedule.id_cliente) !== Number(user.id) &&
    Number(schedule.prestador_id ?? schedule.id_prestador) !== Number(user.id)
  ) {
    throw createHttpError(403, "Sem permissão para este agendamento");
  }
}

// NEW FEATURE: cria agendamento validando conflito.
export async function createServiceSchedule(user, payload) {
  if (user.tipo !== "cliente") {
    throw createHttpError(403, "Apenas clientes podem criar agendamentos");
  }

  const service = await findServiceForSchedule(payload.servico_id);
  if (!service) {
    throw createHttpError(404, "Serviço não encontrado");
  }

  if (Number(service.id_prestador) === Number(user.id)) {
    throw createHttpError(400, "Não podes agendar o teu próprio serviço");
  }

  const conflict = await findScheduleConflict({
    id_prestador: service.id_prestador,
    data_agendada: payload.data_agendada,
    hora_inicio: payload.hora_inicio,
    hora_fim: payload.hora_fim
  });

  if (conflict) {
    throw createHttpError(409, "Já existe um agendamento nesse horário");
  }

  return createSchedule({
    ...payload,
    id_cliente: user.id,
    id_prestador: service.id_prestador
  });
}

// NEW FEATURE: agendamentos do cliente.
export function getMySchedules(user) {
  if (user.tipo === "prestador") {
    return listProviderSchedules(user);
  }

  if (user.tipo === "admin") {
    return listAllSchedules();
  }

  return listClientSchedules(user.id);
}

// NEW FEATURE: agendamentos do prestador/admin.
export function getProviderSchedules(user) {
  if (user.tipo !== "prestador" && user.tipo !== "admin") {
    throw createHttpError(403, "Acesso apenas para prestadores");
  }
  return listProviderSchedules(user);
}

// NEW FEATURE: edita agendamento com permissão e conflito.
export async function editSchedule(user, scheduleId, payload) {
  const schedule = await findScheduleById(scheduleId);
  assertCanAccessSchedule(user, schedule);

  const conflict = await findScheduleConflict({
    id_prestador: schedule.prestador_id ?? schedule.id_prestador,
    data_agendada: payload.data_agendada,
    hora_inicio: payload.hora_inicio,
    hora_fim: payload.hora_fim,
    ignoreId: scheduleId
  });

  if (conflict) {
    throw createHttpError(409, "Já existe um agendamento nesse horário");
  }

  return updateSchedule(scheduleId, payload);
}

// NEW FEATURE: atualiza estado do agendamento.
export async function changeScheduleStatus(user, scheduleId, estado) {
  const schedule = await findScheduleById(scheduleId);
  if (!schedule) {
    throw createHttpError(404, "Agendamento não encontrado");
  }

  if (user.tipo !== "prestador" || Number(schedule.prestador_id) !== Number(user.id)) {
    throw createHttpError(403, "Apenas o prestador dono do agendamento pode alterar o estado");
  }

  return updateScheduleStatus(scheduleId, estado);
}

// NEW FEATURE: elimina agendamento com permissão.
export async function removeSchedule(user, scheduleId) {
  const schedule = await findScheduleById(scheduleId);
  assertCanAccessSchedule(user, schedule);

  const rowCount = await deleteSchedule(scheduleId);
  if (rowCount === 0) {
    throw createHttpError(404, "Agendamento não encontrado");
  }
}
