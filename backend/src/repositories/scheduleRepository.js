import pool from "../config/db.js";

// NEW FEATURE: resposta normalizada para frontend sem expor dados sensiveis.
const scheduleSelect = `
  SELECT
    a.id,
    a.cliente_id,
    a.prestador_id,
    a.servico_id,
    a.data_agendada::text AS data_agendada,
    a.hora_inicio::text AS hora_inicio,
    a.hora_fim::text AS hora_fim,
    a.estado,
    COALESCE(a.estado_pagamento, 'aguarda_pagamento') AS estado_pagamento,
    a.pagamento_referencia,
    a.pago_em,
    a.descricao,
    a.observacoes_prestador,
    a.created_at,
    a.updated_at,
    c.nome AS nome_cliente,
    c.email AS email_cliente,
    p.nome AS nome_prestador,
    p.email AS email_prestador,
    s.titulo AS nome_servico,
    s.titulo AS titulo_servico,
    s.preco AS preco_servico
  FROM agendamentos a
  JOIN utilizadores c ON c.id_utilizador = a.cliente_id
  JOIN utilizadores p ON p.id_utilizador = a.prestador_id
  JOIN servicos s ON s.id_servico = a.servico_id
`;

// NEW FEATURE: serviço ativo para descobrir o prestador do agendamento.
export async function findServiceForSchedule(serviceId) {
  const result = await pool.query(
    "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = $1 AND ativo = true",
    [serviceId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: valida conflito de horário por prestador/dia/sobreposição.
export async function findScheduleConflict({ id_prestador, data_agendada, hora_inicio, hora_fim, ignoreId = null }) {
  const params = [id_prestador, data_agendada, hora_inicio, hora_fim];
  let ignoreClause = "";

  if (ignoreId) {
    params.push(ignoreId);
    ignoreClause = `AND id <> $${params.length}`;
  }

  const result = await pool.query(
    `SELECT id
     FROM agendamentos
     WHERE prestador_id = $1
       AND data_agendada = $2
       AND estado IN ('pendente', 'aceite')
       AND hora_inicio < $4
       AND hora_fim > $3
       ${ignoreClause}
     LIMIT 1`,
    params
  );
  return result.rows[0] || null;
}

// NEW FEATURE: cria agendamento com estado inicial pendente.
export async function createSchedule(payload) {
  const result = await pool.query(
    `INSERT INTO agendamentos
       (servico_id, cliente_id, prestador_id, data_agendada, hora_inicio, hora_fim, estado, descricao)
     VALUES ($1, $2, $3, $4, $5, $6, 'pendente', $7)
     RETURNING id`,
    [
      payload.servico_id,
      payload.id_cliente,
      payload.id_prestador,
      payload.data_agendada,
      payload.hora_inicio,
      payload.hora_fim,
      payload.descricao
    ]
  );
  return findScheduleById(result.rows[0].id);
}

// NEW FEATURE: agendamentos do cliente.
export async function listClientSchedules(userId) {
  const result = await pool.query(
    `${scheduleSelect}
     WHERE a.cliente_id = $1
     ORDER BY a.data_agendada DESC, a.hora_inicio DESC, a.id DESC`,
    [userId]
  );
  return result.rows;
}

// NEW FEATURE: agendamentos do prestador autenticado/admin.
export async function listProviderSchedules(user) {
  const params = [];
  let where = "";

  if (user.tipo !== "admin") {
    where = "WHERE a.prestador_id = $1";
    params.push(user.id);
  }

  const result = await pool.query(
    `${scheduleSelect}
     ${where}
     ORDER BY a.data_agendada DESC, a.hora_inicio DESC, a.id DESC`,
    params
  );
  return result.rows;
}

// NEW FEATURE: listagem admin.
export async function listAllSchedules() {
  const result = await pool.query(
    `${scheduleSelect}
     ORDER BY a.data_agendada DESC, a.hora_inicio DESC, a.id DESC`
  );
  return result.rows;
}

// NEW FEATURE: detalhe de agendamento.
export async function findScheduleById(scheduleId) {
  const result = await pool.query(
    `${scheduleSelect}
     WHERE a.id = $1`,
    [scheduleId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: edita agendamento mantendo o dono.
export async function updateSchedule(scheduleId, payload) {
  const result = await pool.query(
    `UPDATE agendamentos
     SET data_agendada = $1,
         hora_inicio = $2,
         hora_fim = $3,
         descricao = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id`,
    [
      payload.data_agendada,
      payload.hora_inicio,
      payload.hora_fim,
      payload.descricao,
      scheduleId
    ]
  );

  if (!result.rows[0]) return null;
  return findScheduleById(result.rows[0].id);
}

// NEW FEATURE: prestador atualiza estado de agendamento.
export async function updateScheduleStatus(scheduleId, estado) {
  const result = await pool.query(
    `UPDATE agendamentos
     SET estado = $1,
         estado_pagamento = CASE
           WHEN $1 = 'aceite' AND COALESCE(estado_pagamento, 'aguarda_pagamento') <> 'pago'
             THEN 'aguarda_pagamento'
           ELSE COALESCE(estado_pagamento, 'aguarda_pagamento')
         END,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id`,
    [estado, scheduleId]
  );

  if (!result.rows[0]) return null;
  return findScheduleById(result.rows[0].id);
}

// PAYMENT: simula o registo de pagamento. Futuramente, este update deve ser acionado
// pelo webhook do Stripe Checkout depois de confirmar checkout.session.completed.
export async function updateSchedulePayment(scheduleId, { estado_pagamento, pagamento_referencia = null }) {
  const result = await pool.query(
    `UPDATE agendamentos
     SET estado_pagamento = $1,
         pagamento_referencia = $2,
         pago_em = CASE WHEN $1 = 'pago' THEN CURRENT_TIMESTAMP ELSE NULL END,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id`,
    [estado_pagamento, pagamento_referencia, scheduleId]
  );

  if (!result.rows[0]) return null;
  return findScheduleById(result.rows[0].id);
}

// NEW FEATURE: elimina agendamento.
export async function deleteSchedule(scheduleId) {
  const result = await pool.query(
    "DELETE FROM agendamentos WHERE id = $1",
    [scheduleId]
  );
  return result.rowCount;
}
