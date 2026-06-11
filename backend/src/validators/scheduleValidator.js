import {
  optionalString,
  parsePositiveId,
  validateDate,
  validateEnum,
  validateTimeRange
} from "./commonValidators.js";

// NEW FEATURE: estados suportados por agendamentos.
export const scheduleStates = ["pendente", "aceite", "rejeitado", "concluido", "cancelado"];

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
  return payload;
}

// NEW FEATURE: valida estado de agendamento.
export function validateScheduleStatus(body) {
  return validateEnum(body.estado, scheduleStates, "estado");
}
