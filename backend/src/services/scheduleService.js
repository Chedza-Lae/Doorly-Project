import crypto from "crypto";
import { createHttpError } from "../utils/httpError.js";
import {
  sendNewScheduleEmailToProvider,
  sendScheduleCreatedEmailToClient,
  sendScheduleStatusEmailToClient
} from "../utils/sendEmail.js";
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
  updateSchedulePayment,
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

  const schedule = await createSchedule({
    ...payload,
    id_cliente: user.id,
    id_prestador: service.id_prestador
  });

  await Promise.all([
    sendScheduleCreatedEmailToClient(schedule),
    sendNewScheduleEmailToProvider(schedule)
  ]);

  return schedule;
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

  const updatedSchedule = await updateScheduleStatus(scheduleId, estado);
  if (["aceite", "rejeitado", "concluido", "cancelado"].includes(estado)) {
    await sendScheduleStatusEmailToClient(updatedSchedule);
  }
  return updatedSchedule;
}

// PAYMENT: fluxo simulado preparado para futura integração com Stripe Checkout.
export async function registerSchedulePayment(user, scheduleId) {
  if (user.tipo !== "cliente") {
    throw createHttpError(403, "Apenas o cliente pode pagar este agendamento");
  }

  const schedule = await findScheduleById(scheduleId);
  if (!schedule) {
    throw createHttpError(404, "Agendamento não encontrado");
  }

  if (Number(schedule.cliente_id) !== Number(user.id)) {
    throw createHttpError(403, "Sem permissão para pagar este agendamento");
  }

  if (schedule.estado !== "aceite") {
    throw createHttpError(400, "O agendamento precisa de estar aceite antes do pagamento");
  }

  if (schedule.estado_pagamento === "pago") {
    return schedule;
  }

  // TODO Stripe Checkout:
  // 1. Criar uma Checkout Session com o valor do serviço.
  // 2. Redirecionar o cliente para session.url.
  // 3. Marcar como "pago" apenas no webhook checkout.session.completed.
  return updateSchedulePayment(scheduleId, {
    estado_pagamento: "pago",
    pagamento_referencia: `SIM-${crypto.randomUUID()}`
  });
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
