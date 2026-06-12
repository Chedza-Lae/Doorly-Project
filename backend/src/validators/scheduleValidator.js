import {
  optionalString,
  parsePositiveId,
  validateDate,
  validateEnum,
  validateTimeRange
} from "./commonValidators.js";
import { createHttpError } from "../utils/httpError.js";

// NEW FEATURE: estados suportados por agendamentos.
export const scheduleStates = ["pendente", "aceite", "rejeitado", "concluido", "cancelado"];

function buildLocalDateTime(dateValue, timeValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function validateFutureScheduleDateTime(payload) {
  if (!payload.data_agendada || !payload.hora_inicio || !payload.hora_fim) return;

  const start = buildLocalDateTime(payload.data_agendada, payload.hora_inicio);
  const end = buildLocalDateTime(payload.data_agendada, payload.hora_fim);

  if (end <= start) {
    throw createHttpError(400, "A hora de término deve ser depois da hora de início.");
  }

  if (start <= new Date()) {
    throw createHttpError(400, "Escolhe uma data e hora futura.");
  }
}

// NEW FEATURE: valida criação/edição de agendamento.
export function validateSchedulePayload(body, { partial = false } = {}) {
  const payload = {};

  if (!partial || body.servico_id != null || body.id_servico != null) {
    payload.servico_id = parsePositiveId(body.servico_id ?? body.id_servico, "servico_id");
  }
  if (!partial || body.data_agendada != null || body.data_agendamento != null || body.data != null) {
    payload.data_agendada = validateDate(body.data_agendada ?? body.data_agendamento ?? body.data, "data_agendada");
  }
  if (!partial || body.hora_inicio != null || body.hora_fim != null) {
    Object.assign(payload, validateTimeRange(body.hora_inicio, body.hora_fim));
  }

  payload.descricao = optionalString(body.descricao ?? body.notas);
  validateFutureScheduleDateTime(payload);
  return payload;
}

// NEW FEATURE: valida estado de agendamento.
export function validateScheduleStatus(body) {
  return validateEnum(body.estado, scheduleStates, "estado");
}
