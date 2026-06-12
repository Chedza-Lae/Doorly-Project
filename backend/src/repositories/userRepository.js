import pool from "../config/db.js";

// SUPABASE MIGRATION: repository PostgreSQL para utilizadores.
export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM utilizadores WHERE email = $1", [email]);
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: INSERT com RETURNING para obter o id criado.
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
    `SELECT
       id_utilizador AS id,
       id_utilizador,
       nome,
       email,
       tipo,
       foto_perfil,
       telefone,
       localizacao,
       profissao,
       descricao,
       ativo,
       status,
       data_registo,
       updated_at
     FROM utilizadores
     WHERE id_utilizador = $1`,
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

// SUPABASE MIGRATION: limpa reset token após alterar password.
export async function updatePassword(userId, passwordHash) {
  const result = await pool.query(
    `UPDATE utilizadores
     SET password_hash = $1,
         reset_token = NULL,
         reset_expires = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE id_utilizador = $2`,
    [passwordHash, userId]
  );
  return result.rowCount;
}

// SUPABASE MIGRATION: atualização apenas dos campos editáveis do próprio perfil.
export async function updateProfile(userId, { nome, telefone, localizacao, profissao, descricao, foto_perfil }) {
  const result = await pool.query(
    `UPDATE utilizadores
     SET nome = $1,
         telefone = $2,
         localizacao = $3,
         profissao = $4,
         descricao = $5,
         foto_perfil = $6,
         updated_at = CURRENT_TIMESTAMP
     WHERE id_utilizador = $7
     RETURNING
       id_utilizador AS id,
       id_utilizador,
       nome,
       email,
       tipo,
       foto_perfil,
       telefone,
       localizacao,
       profissao,
       descricao,
       ativo,
       status,
       data_registo,
       updated_at`,
    [nome, telefone, localizacao, profissao, descricao, foto_perfil, userId]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: atualiza apenas a fotografia de perfil.
export async function updateProfilePhoto(userId, foto_perfil) {
  const result = await pool.query(
    `UPDATE utilizadores
     SET foto_perfil = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id_utilizador = $2
     RETURNING
       id_utilizador AS id,
       id_utilizador,
       nome,
       email,
       tipo,
       foto_perfil,
       telefone,
       localizacao,
       profissao,
       descricao,
       ativo,
       status,
       data_registo,
       updated_at`,
    [foto_perfil, userId]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: alteração de password sem devolver password_hash.
export async function updateAccountPassword(userId, passwordHash) {
  await pool.query(
    `UPDATE utilizadores
     SET password_hash = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id_utilizador = $2`,
    [passwordHash, userId]
  );
}

// SUPABASE MIGRATION: listagem admin.
export async function listUsers() {
  const result = await pool.query(
    `SELECT
       id_utilizador AS id,
       nome,
       email,
       tipo,
       ativo,
       status,
       ban_reason,
       ban_until
     FROM utilizadores
     ORDER BY id_utilizador DESC`
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

// SUPABASE MIGRATION: alteração de tipo para permissões.
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

// SUPABASE MIGRATION: elimina dependências do utilizador antes do DELETE para respeitar FKs PostgreSQL.
export async function deleteUserCascade(userId, client = pool) {
  await client.query("DELETE FROM favoritos WHERE id_cliente = $1", [userId]);
  await client.query("DELETE FROM avaliacoes WHERE id_cliente = $1", [userId]);
  await client.query("DELETE FROM mensagens WHERE id_remetente = $1 OR id_destinatario = $2", [userId, userId]);
  await client.query("DELETE FROM propostas WHERE id_cliente = $1 OR id_prestador = $2", [userId, userId]);
  await client.query("DELETE FROM agendamentos WHERE cliente_id = $1 OR prestador_id = $2", [userId, userId]);
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
    await client.query("DELETE FROM propostas WHERE id_servico = $1", [service.id_servico]);
    await client.query("DELETE FROM agendamentos WHERE servico_id = $1", [service.id_servico]);
    await client.query("DELETE FROM historico_servicos WHERE id_servico = $1", [service.id_servico]);
  }

  await client.query("DELETE FROM servicos WHERE id_prestador = $1", [userId]);
  return deleteUser(userId, client);
}
