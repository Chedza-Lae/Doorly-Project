import pool from "../config/db.js";

// SUPABASE MIGRATION: procura serviço para envio de mensagem.
export async function findMessageService(serviceId) {
  const result = await pool.query(
    "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = $1",
    [serviceId]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: INSERT com RETURNING id_mensagem.
export async function createMessage({ id_servico, id_remetente, id_destinatario, conteudo }, client = pool) {
  const result = await client.query(
    `INSERT INTO mensagens (id_servico, id_remetente, id_destinatario, conteudo)
     VALUES ($1, $2, $3, $4)
     RETURNING id_mensagem`,
    [id_servico, id_remetente, id_destinatario, conteudo]
  );
  return result.rows[0];
}

// SUPABASE MIGRATION: inbox com placeholders PostgreSQL.
export async function listInbox(userId) {
  const result = await pool.query(
    `SELECT
       m.id_mensagem AS id,
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
         grouped.id_servico,
         grouped.other_id,
         MAX(grouped.id_mensagem) AS last_message_id
       FROM (
         SELECT
           id_mensagem,
           id_servico,
           CASE
             WHEN id_remetente = $1 THEN id_destinatario
             ELSE id_remetente
           END AS other_id
         FROM mensagens
         WHERE id_remetente = $2 OR id_destinatario = $3
       ) grouped
       GROUP BY grouped.id_servico, grouped.other_id
     ) latest ON latest.last_message_id = m.id_mensagem
     JOIN servicos s ON s.id_servico = m.id_servico
     JOIN utilizadores remetente ON remetente.id_utilizador = m.id_remetente
     JOIN utilizadores interlocutor ON interlocutor.id_utilizador = latest.other_id
     ORDER BY m.data_envio DESC, m.id_mensagem DESC`,
    [userId, userId, userId]
  );

  return result.rows;
}

// SUPABASE MIGRATION: thread ordenada e limitada ao par autenticado.
export async function listThread({ id_servico, userId, other_id }) {
  const result = await pool.query(
    `SELECT
       m.id_mensagem AS id,
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
     ORDER BY m.data_envio ASC, m.id_mensagem ASC`,
    [id_servico, userId, other_id, other_id, userId]
  );
  return result.rows;
}
