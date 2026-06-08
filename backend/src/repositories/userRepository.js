import pool from "../config/db.js";

// SUPABASE MIGRATION: repository PostgreSQL para utilizadores.
export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM utilizadores WHERE email = $1", [email]);
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: INSERT com RETURNING em vez de insertId.
export async function createUser({ nome, email, password_hash, tipo }) {
  const result = await pool.query(
    `INSERT INTO utilizadores (nome, email, password_hash, tipo)
     VALUES ($1, $2, $3, $4)
     RETURNING id_utilizador, nome, email, tipo`,
    [nome, email, password_hash, tipo]
  );
  return result.rows[0];
}

// SUPABASE MIGRATION: leitura por id com result.rows.
export async function findUserById(id) {
  const result = await pool.query(
    "SELECT * FROM utilizadores WHERE id_utilizador = $1",
    [id]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: perfil publico/autenticado.
export async function findProfileById(id) {
  const result = await pool.query(
    "SELECT id_utilizador AS id, nome, email, tipo, ativo, data_registo FROM utilizadores WHERE id_utilizador = $1",
    [id]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: procura email duplicado em PostgreSQL.
export async function findOtherUserByEmail(email, userId) {
  const result = await pool.query(
    "SELECT id_utilizador FROM utilizadores WHERE email = $1 AND id_utilizador <> $2",
    [email, userId]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: atualiza reset token.
export async function setResetToken(userId, token, expires) {
  await pool.query(
    `UPDATE utilizadores
     SET reset_token = $1, reset_expires = $2
     WHERE id_utilizador = $3`,
    [token, expires, userId]
  );
}

// SUPABASE MIGRATION: usa CURRENT_TIMESTAMP nas queries que precisem comparar datas.
export async function findUserByResetToken(token) {
  const result = await pool.query(
    `SELECT *
     FROM utilizadores
     WHERE reset_token = $1
       AND reset_expires > CURRENT_TIMESTAMP`,
    [token]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: limpa reset token apos alterar password.
export async function updatePassword(userId, passwordHash) {
  await pool.query(
    `UPDATE utilizadores
     SET password_hash = $1, reset_token = NULL, reset_expires = NULL
     WHERE id_utilizador = $2`,
    [passwordHash, userId]
  );
}

// SUPABASE MIGRATION: atualizacao de perfil com ou sem password.
export async function updateProfile(userId, { nome, email, password_hash }) {
  if (password_hash) {
    await pool.query(
      "UPDATE utilizadores SET nome = $1, email = $2, password_hash = $3 WHERE id_utilizador = $4",
      [nome, email, password_hash, userId]
    );
  } else {
    await pool.query(
      "UPDATE utilizadores SET nome = $1, email = $2 WHERE id_utilizador = $3",
      [nome, email, userId]
    );
  }
  return findProfileById(userId);
}

// SUPABASE MIGRATION: listagem admin.
export async function listUsers() {
  const result = await pool.query(
    "SELECT id_utilizador AS id, nome, email, tipo, status FROM utilizadores ORDER BY id_utilizador DESC"
  );
  return result.rows;
}

// SUPABASE MIGRATION: ban/unban com rowCount.
export async function updateUserStatus(userId, { status, ban_reason = null, ban_until = null }) {
  const result = await pool.query(
    `UPDATE utilizadores
     SET status = $1, ban_reason = $2, ban_until = $3
     WHERE id_utilizador = $4`,
    [status, ban_reason, ban_until, userId]
  );
  return result.rowCount;
}

// SUPABASE MIGRATION: alteracao de tipo para permissoes.
export async function updateUserRole(userId, tipo) {
  const result = await pool.query(
    "UPDATE utilizadores SET tipo = $1 WHERE id_utilizador = $2",
    [tipo, userId]
  );
  return result.rowCount;
}

// SUPABASE MIGRATION: delete por client transacional quando fornecido.
export async function deleteUser(userId, client = pool) {
  const result = await client.query(
    "DELETE FROM utilizadores WHERE id_utilizador = $1",
    [userId]
  );
  return result.rowCount;
}

// SUPABASE MIGRATION: elimina dependencias do utilizador antes do DELETE para respeitar FKs PostgreSQL.
export async function deleteUserCascade(userId, client = pool) {
  await client.query("DELETE FROM favoritos WHERE id_cliente = $1", [userId]);
  await client.query("DELETE FROM avaliacoes WHERE id_cliente = $1", [userId]);
  await client.query("DELETE FROM mensagens WHERE id_remetente = $1 OR id_destinatario = $2", [userId, userId]);
  await client.query("DELETE FROM pedidos_orcamento WHERE id_cliente = $1 OR id_prestador = $2", [userId, userId]);
  await client.query("DELETE FROM agendamentos WHERE id_cliente = $1 OR id_prestador = $2", [userId, userId]);
  await client.query("DELETE FROM historico_servicos WHERE id_cliente = $1 OR id_prestador = $2", [userId, userId]);

  const services = await client.query(
    "SELECT id_servico FROM servicos WHERE id_prestador = $1",
    [userId]
  );

  for (const service of services.rows) {
    await client.query("DELETE FROM favoritos WHERE id_servico = $1", [service.id_servico]);
    await client.query("DELETE FROM estatisticas WHERE id_servico = $1", [service.id_servico]);
    await client.query("DELETE FROM avaliacoes WHERE id_servico = $1", [service.id_servico]);
    await client.query("DELETE FROM mensagens WHERE id_servico = $1", [service.id_servico]);
    await client.query("DELETE FROM pedidos_orcamento WHERE id_servico = $1", [service.id_servico]);
    await client.query("DELETE FROM agendamentos WHERE id_servico = $1", [service.id_servico]);
    await client.query("DELETE FROM historico_servicos WHERE id_servico = $1", [service.id_servico]);
  }

  await client.query("DELETE FROM servicos WHERE id_prestador = $1", [userId]);
  return deleteUser(userId, client);
}
