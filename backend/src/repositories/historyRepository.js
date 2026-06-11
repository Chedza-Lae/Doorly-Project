import pool from "../config/db.js";

// NEW FEATURE: joins do histórico com nomes do cliente/prestador e título do serviço.
const historySelect = `
  SELECT
    h.*,
    c.nome AS nome_cliente,
    p.nome AS nome_prestador,
    s.titulo AS titulo_servico
  FROM historico_servicos h
  JOIN utilizadores c ON c.id_utilizador = h.id_cliente
  JOIN utilizadores p ON p.id_utilizador = h.id_prestador
  JOIN servicos s ON s.id_servico = h.id_servico
`;

// NEW FEATURE: histórico do cliente autenticado.
export async function listClientHistory(userId) {
  const result = await pool.query(
    `${historySelect}
     WHERE h.id_cliente = $1
     ORDER BY h.data_conclusao DESC, h.id_historico DESC`,
    [userId]
  );
  return result.rows;
}

// NEW FEATURE: histórico do prestador autenticado/admin.
export async function listProviderHistory(user) {
  const params = [];
  let where = "";

  if (user.tipo !== "admin") {
    where = "WHERE h.id_prestador = $1";
    params.push(user.id);
  }

  const result = await pool.query(
    `${historySelect}
     ${where}
     ORDER BY h.data_conclusao DESC, h.id_historico DESC`,
    params
  );
  return result.rows;
}

// NEW FEATURE: procura serviço para preencher prestador no histórico.
export async function findServiceForHistory(serviceId) {
  const result = await pool.query(
    "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = $1",
    [serviceId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: cria histórico quando um serviço é concluído.
export async function createHistory(payload) {
  const result = await pool.query(
    `INSERT INTO historico_servicos
       (id_servico, id_cliente, id_prestador, data_conclusao, detalhes)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
     RETURNING *`,
    [payload.id_servico, payload.id_cliente, payload.id_prestador, payload.detalhes]
  );
  return result.rows[0];
}

// NEW FEATURE: delete admin-only de histórico.
export async function deleteHistory(historyId) {
  const result = await pool.query(
    "DELETE FROM historico_servicos WHERE id_historico = $1",
    [historyId]
  );
  return result.rowCount;
}
