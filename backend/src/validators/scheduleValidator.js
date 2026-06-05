import {
  optionalString,
  parsePositiveId,
  validateDate,
  validateEnum,
  validateTimeRange
} from "./commonValidators.js";

// NEW FEATURE: estados suportados por agendamentos.
export const scheduleStates = ["pendente", "aceite", "recusado", "concluido"];

// NEW FEATURE: valida criacao/edicao de agendamento.
export function validateSchedulePayload(body, { partial = false } = {}) {
  const payload = {};

  if (!partial || body.id_servico != null) {
    payload.id_servico = parsePositiveId(body.id_servico, "id_servico");
  }
  if (!partial || body.data_agendamento != null || body.data != null) {
    payload.data_agendamento = validateDate(body.data_agendamento ?? body.data, "data_agendamento");
  }
  if (!partial || body.hora_inicio != null || body.hora_fim != null) {
    Object.assign(payload, validateTimeRange(body.hora_inicio, body.hora_fim));
  }

  payload.notas = optionalString(body.notas);
  return payload;
}

// NEW FEATURE: valida estado de agendamento.
export function validateScheduleStatus(body) {
  return validateEnum(body.estado, scheduleStates, "estado");
}
