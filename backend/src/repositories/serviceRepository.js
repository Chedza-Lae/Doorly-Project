import pool from "../config/db.js";

const detailedSelect = `
  SELECT
    s.*,
    u.nome AS prestador,
    u.email AS prestador_email,
    COALESCE(e.visualizacoes, 0) AS visualizacoes,
    COALESCE(e.pedidos, 0) AS pedidos,
    COALESCE(AVG(a.nota), 0) AS rating,
    COUNT(a.id_avaliacao) AS total_avaliacoes
  FROM servicos s
  JOIN utilizadores u ON u.id_utilizador = s.id_prestador
  LEFT JOIN estatisticas e ON e.id_servico = s.id_servico
  LEFT JOIN avaliacoes a ON a.id_servico = s.id_servico
`;

const detailedGroup = `
  GROUP BY s.id_servico, u.nome, u.email, e.visualizacoes, e.pedidos
`;

// SUPABASE MIGRATION: lista publica com ILIKE e boolean true.
export async function listPublicServices({ q } = {}) {
  const params = [];
  let where = "WHERE s.ativo = true";

  if (q) {
    const term = `%${q}%`;
    params.push(term, term, term, term, term);
    where += `
      AND (
        s.titulo ILIKE $1
        OR s.categoria ILIKE $2
        OR s.descricao ILIKE $3
        OR s.localizacao ILIKE $4
        OR u.nome ILIKE $5
      )
    `;
  }

  const result = await pool.query(
    `${detailedSelect}
     ${where}
     ${detailedGroup}
     ORDER BY s.data_publicacao DESC, s.id_servico DESC`,
    params
  );
  return result.rows;
}

// SUPABASE MIGRATION: lista serviços do prestador/admin.
export async function listProviderServices(user) {
  const params = [];
  let where = "";

  if (user.tipo !== "admin") {
    params.push(user.id);
    where = "WHERE s.id_prestador = $1";
  }

  const result = await pool.query(
    `${detailedSelect}
     ${where}
     ${detailedGroup}
     ORDER BY s.data_publicacao DESC, s.id_servico DESC`,
    params
  );
  return result.rows;
}

// SUPABASE MIGRATION: procura serviço bruto.
export async function findServiceById(id, client = pool) {
  const result = await client.query("SELECT * FROM servicos WHERE id_servico = $1", [id]);
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: detalhes de serviço com joins.
export async function findDetailedServiceById(id) {
  const result = await pool.query(
    `${detailedSelect}
     WHERE s.id_servico = $1
     ${detailedGroup}`,
    [id]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: INSERT com RETURNING.
export async function createService(payload, client = pool) {
  const result = await client.query(
    `INSERT INTO servicos
       (id_prestador, titulo, descricao, categoria, preco, localizacao, imagem_url, ativo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true)
     RETURNING id_servico`,
    [
      payload.id_prestador,
      payload.titulo,
      payload.descricao,
      payload.categoria,
      payload.preco,
      payload.localizacao,
      payload.imagem_url
    ]
  );
  return result.rows[0];
}

// SUPABASE MIGRATION: update completo usa boolean para ativo.
export async function updateService(id, payload) {
  const result = await pool.query(
    `UPDATE servicos
     SET titulo = $1,
         descricao = $2,
         categoria = $3,
         preco = $4,
         localizacao = $5,
         imagem_url = $6,
         ativo = $7
     WHERE id_servico = $8
     RETURNING *`,
    [
      payload.titulo,
      payload.descricao,
      payload.categoria,
      payload.preco,
      payload.localizacao,
      payload.imagem_url,
      payload.ativo,
      id
    ]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: patch dinamico com placeholders PostgreSQL.
export async function patchService(id, payload) {
  const entries = Object.entries(payload);
  const setClause = entries.map(([field], index) => `${field} = $${index + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE servicos
     SET ${setClause}
     WHERE id_servico = $${entries.length + 1}
     RETURNING *`,
    [...entries.map(([, value]) => value), id]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: lista admin.
export async function listAdminServices() {
  const result = await pool.query(
    `SELECT s.id_servico AS id, s.titulo, s.id_prestador, u.nome AS nome_prestador
     FROM servicos s
     JOIN utilizadores u ON u.id_utilizador = s.id_prestador
     ORDER BY s.id_servico DESC`
  );
  return result.rows;
}

// SUPABASE MIGRATION: apaga dependências de serviço numa transaction pg.
export async function deleteServiceCascade(id, client = pool) {
  await client.query("DELETE FROM favoritos WHERE id_servico = $1", [id]);
  await client.query("DELETE FROM estatisticas WHERE id_servico = $1", [id]);
  await client.query("DELETE FROM avaliacoes WHERE id_servico = $1", [id]);
  await client.query("DELETE FROM mensagens WHERE id_servico = $1", [id]);
  await client.query("DELETE FROM propostas WHERE id_servico = $1", [id]);
  await client.query("DELETE FROM agendamentos WHERE servico_id = $1", [id]);
  await client.query("DELETE FROM historico_servicos WHERE id_servico = $1", [id]);
  const result = await client.query("DELETE FROM servicos WHERE id_servico = $1", [id]);
  return result.rowCount;
}

// SUPABASE MIGRATION: apaga serviços associados a um utilizador.
export async function deleteServicesByUser(userId, client = pool) {
  const result = await client.query(
    "DELETE FROM servicos WHERE id_prestador = $1",
    [userId]
  );
  return result.rowCount;
}
