import pool from "../config/db.js";

// SUPABASE MIGRATION: procura servico para envio de mensagem.
export async function findMessageService(serviceId) {
  const result = await pool.query(
    "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = $1",
    [serviceId]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: INSERT com RETURNING idmensagens.
export async function createMessage({ id_servico, id_remetente, id_destinatario, conteudo }, client = pool) {
  const result = await client.query(
    `INSERT INTO mensagens (id_servico, id_remetente, id_destinatario, conteudo)
     VALUES ($1, $2, $3, $4)
     RETURNING idmensagens`,
    [id_servico, id_remetente, id_destinatario, conteudo]
  );
  return result.rows[0];
}

// SUPABASE MIGRATION: inbox com placeholders PostgreSQL.
export async function listInbox(userId) {
  const result = await pool.query(
    `SELECT
       m.idmensagens AS id,
       m.id_servico,
       m.id_remetente,
       m.id_destinatario,
       m.conteudo,
       m.data_envio,
       s.titulo AS titulo_servico,
       remetente.nome AS nome_remetente,
       interlocutor.id_utilizador AS other_id,
       interlocutor.nome AS nome_interlocutor
     FROM mensagens m
     JOIN (
       SELECT
         id_servico,
         CASE
           WHEN id_remetente = $1 THEN id_destinatario
           ELSE id_remetente
         END AS other_id,
         MAX(idmensagens) AS last_message_id
       FROM mensagens
       WHERE id_remetente = $2 OR id_destinatario = $3
       GROUP BY
         id_servico,
         CASE
           WHEN id_remetente = $4 THEN id_destinatario
           ELSE id_remetente
         END
     ) latest ON latest.last_message_id = m.idmensagens
     JOIN servicos s ON s.id_servico = m.id_servico
     JOIN utilizadores remetente ON remetente.id_utilizador = m.id_remetente
     JOIN utilizadores interlocutor ON interlocutor.id_utilizador = latest.other_id
     ORDER BY m.data_envio DESC, m.idmensagens DESC`,
    [userId, userId, userId, userId]
  );
  return result.rows;
}

// SUPABASE MIGRATION: thread ordenada e limitada ao par autenticado.
export async function listThread({ id_servico, userId, other_id }) {
  const result = await pool.query(
    `SELECT
       m.idmensagens AS id,
       m.id_servico,
       m.id_remetente,
       m.id_destinatario,
       m.conteudo,
       m.data_envio,
       u.nome AS nome_remetente
     FROM mensagens m
     JOIN utilizadores u ON u.id_utilizador = m.id_remetente
     WHERE m.id_servico = $1
       AND (
         (m.id_remetente = $2 AND m.id_destinatario = $3)
         OR
         (m.id_remetente = $4 AND m.id_destinatario = $5)
       )
     ORDER BY m.data_envio ASC, m.idmensagens ASC`,
    [id_servico, userId, other_id, other_id, userId]
  );
  return result.rows;
}
