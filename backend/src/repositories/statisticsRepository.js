import pool from "../config/db.js";

// SUPABASE MIGRATION: cria estatísticas iniciais de serviço.
export async function createStatisticsForService(serviceId, client = pool) {
  await client.query(
    `INSERT INTO estatisticas (id_servico, visualizacoes, pedidos, ultima_atualizacao)
     VALUES ($1, 0, 0, CURRENT_TIMESTAMP)
     ON CONFLICT DO NOTHING`,
    [serviceId]
  );
}

// SUPABASE MIGRATION: atualiza visualizacoes usando rowCount.
export async function incrementViews(serviceId, client = pool) {
  const result = await client.query(
    `UPDATE estatisticas
     SET visualizacoes = COALESCE(visualizacoes, 0) + 1,
         ultima_atualizacao = CURRENT_TIMESTAMP
     WHERE id_servico = $1`,
    [serviceId]
  );

  if (result.rowCount === 0) {
    await client.query(
      `INSERT INTO estatisticas (id_servico, visualizacoes, pedidos, ultima_atualizacao)
       VALUES ($1, 1, 0, CURRENT_TIMESTAMP)`,
      [serviceId]
    );
  }
}

// SUPABASE MIGRATION: atualiza pedidos usando rowCount.
export async function incrementRequests(serviceId, client = pool) {
  const result = await client.query(
    `UPDATE estatisticas
     SET pedidos = COALESCE(pedidos, 0) + 1,
         ultima_atualizacao = CURRENT_TIMESTAMP
     WHERE id_servico = $1`,
    [serviceId]
  );

  if (result.rowCount === 0) {
    await client.query(
      `INSERT INTO estatisticas (id_servico, visualizacoes, pedidos, ultima_atualizacao)
       VALUES ($1, 0, 1, CURRENT_TIMESTAMP)`,
      [serviceId]
    );
  }
}
