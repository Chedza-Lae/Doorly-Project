import pool from "../config/db.js";

// NEW FEATURE: joins de agendamentos para cliente, prestador e servico.
const scheduleSelect = `
  SELECT
    a.*,
    c.nome AS nome_cliente,
    p.nome AS nome_prestador,
    s.titulo AS titulo_servico
  FROM agendamentos a
  JOIN utilizadores c ON c.id_utilizador = a.id_cliente
  JOIN utilizadores p ON p.id_utilizador = a.id_prestador
  JOIN servicos s ON s.id_servico = a.id_servico
`;

// NEW FEATURE: servico ativo para agendamento.
export async function findServiceForSchedule(serviceId) {
  const result = await pool.query(
    "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = $1 AND ativo = true",
    [serviceId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: valida conflito de horario por prestador/dia/sobreposicao.
export async function findScheduleConflict({ id_prestador, data_agendamento, hora_inicio, hora_fim, ignoreId = null }) {
  const params = [id_prestador, data_agendamento, hora_inicio, hora_fim];
  let ignoreClause = "";

  if (ignoreId) {
    params.push(ignoreId);
    ignoreClause = `AND id_agendamento <> $${params.length}`;
  }

  const result = await pool.query(
    `SELECT id_agendamento
     FROM agendamentos
     WHERE id_prestador = $1
       AND data_agendamento = $2
       AND estado IN ('pendente', 'aceite')
       AND hora_inicio < $4
       AND hora_fim > $3
       ${ignoreClause}
     LIMIT 1`,
    params
  );
  return result.rows[0] || null;
}

// NEW FEATURE: cria agendamento.
export async function createSchedule(payload) {
  const result = await pool.query(
    `INSERT INTO agendamentos
       (id_servico, id_cliente, id_prestador, data_agendamento, hora_inicio, hora_fim, estado, notas)
     VALUES ($1, $2, $3, $4, $5, $6, 'pendente', $7)
     RETURNING *`,
    [
      payload.id_servico,
      payload.id_cliente,
      payload.id_prestador,
      payload.data_agendamento,
      payload.hora_inicio,
      payload.hora_fim,
      payload.notas
    ]
  );
  return result.rows[0];
}

// NEW FEATURE: agendamentos do cliente.
export async function listClientSchedules(userId) {
  const result = await pool.query(
    `${scheduleSelect}
     WHERE a.id_cliente = $1
     ORDER BY a.data_agendamento DESC, a.hora_inicio DESC, a.id_agendamento DESC`,
    [userId]
  );
  return result.rows;
}

// NEW FEATURE: agendamentos do prestador/admin.
export async function listProviderSchedules(user) {
  const params = [];
  let where = "";

  if (user.tipo !== "admin") {
    where = "WHERE a.id_prestador = $1";
    params.push(user.id);
  }

  const result = await pool.query(
    `${scheduleSelect}
     ${where}
     ORDER BY a.data_agendamento DESC, a.hora_inicio DESC, a.id_agendamento DESC`,
    params
  );
  return result.rows;
}

// NEW FEATURE: detalhe de agendamento.
export async function findScheduleById(scheduleId) {
  const result = await pool.query(
    `${scheduleSelect}
     WHERE a.id_agendamento = $1`,
    [scheduleId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: edita agendamento.
export async function updateSchedule(scheduleId, payload) {
  const result = await pool.query(
    `UPDATE agendamentos
     SET data_agendamento = $1,
         hora_inicio = $2,
         hora_fim = $3,
         notas = $4
     WHERE id_agendamento = $5
     RETURNING *`,
    [
      payload.data_agendamento,
      payload.hora_inicio,
      payload.hora_fim,
      payload.notas,
      scheduleId
    ]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: atualiza estado de agendamento.
export async function updateScheduleStatus(scheduleId, estado) {
  const result = await pool.query(
    `UPDATE agendamentos
     SET estado = $1
     WHERE id_agendamento = $2
     RETURNING *`,
    [estado, scheduleId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: elimina agendamento.
export async function deleteSchedule(scheduleId) {
  const result = await pool.query(
    "DELETE FROM agendamentos WHERE id_agendamento = $1",
    [scheduleId]
  );
  return result.rowCount;
}
