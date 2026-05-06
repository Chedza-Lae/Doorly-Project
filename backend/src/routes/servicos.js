import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const allowedUpdateFields = [
  "titulo",
  "descricao",
  "categoria",
  "preco",
  "localizacao",
  "ativo",
  "imagem_url",
];

function normalizeServicePayload(body) {
  const payload = {
    titulo: typeof body.titulo === "string" ? body.titulo.trim() : "",
    descricao: typeof body.descricao === "string" ? body.descricao.trim() : "",
    categoria: typeof body.categoria === "string" ? body.categoria.trim() : "",
    preco: body.preco,
    localizacao: typeof body.localizacao === "string" ? body.localizacao.trim() : null,
    imagem_url: typeof body.imagem_url === "string" ? body.imagem_url.trim() : null,
  };

  const price = Number(payload.preco);
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Preco invalido" };
  }

  payload.preco = price;
  payload.localizacao = payload.localizacao || null;
  payload.imagem_url = payload.imagem_url || null;

  if (!payload.titulo || !payload.descricao || !payload.categoria) {
    return { error: "Campos obrigatorios em falta" };
  }

  return { payload };
}

async function findServiceForUser(serviceId, user) {
  const [rows] = await pool.query(
    "SELECT * FROM servicos WHERE id_servico = ?",
    [serviceId]
  );

  if (!rows.length) return { errorStatus: 404, message: "Servico nao encontrado" };

  const service = rows[0];
  const canManage =
    user.tipo === "admin" || Number(service.id_prestador) === Number(user.id);

  if (!canManage) {
    return { errorStatus: 403, message: "Sem permissao para gerir este servico" };
  }

  return { service };
}

/**
 * GET /api/servicos
 * Lista publica + pesquisa.
 */
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;

    let sql = `
      SELECT
        s.*,
        u.nome AS prestador,
        COALESCE(AVG(a.nota), 0) AS rating,
        COUNT(a.id_avaliacao) AS total_avaliacoes
      FROM servicos s
      JOIN utilizadores u ON s.id_prestador = u.id_utilizador
      LEFT JOIN avaliacoes a ON a.id_servico = s.id_servico
      WHERE s.ativo = 1
    `;

    const params = [];

    if (q) {
      sql += `
        AND (
          s.titulo LIKE ?
          OR s.categoria LIKE ?
          OR s.descricao LIKE ?
          OR s.localizacao LIKE ?
          OR u.nome LIKE ?
        )
      `;
      const term = `%${q}%`;
      params.push(term, term, term, term, term);
    }

    sql += " GROUP BY s.id_servico ORDER BY s.data_publicacao DESC, s.id_servico DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar servicos" });
  }
});

/**
 * GET /api/servicos/me
 * Servicos do prestador autenticado.
 */
router.get("/me", verifyToken, async (req, res) => {
  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso apenas para prestadores" });
  }

  try {
    const params = [];
    let ownerClause = "";

    if (req.user.tipo !== "admin") {
      ownerClause = "WHERE s.id_prestador = ?";
      params.push(req.user.id);
    }

    const [rows] = await pool.query(
      `
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
        ${ownerClause}
        GROUP BY s.id_servico
        ORDER BY s.data_publicacao DESC, s.id_servico DESC
      `,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter servicos do prestador" });
  }
});

/**
 * POST /api/servicos
 * Criar servico.
 */
router.post("/", verifyToken, async (req, res) => {
  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Apenas prestadores podem criar servicos" });
  }

  const { payload, error } = normalizeServicePayload(req.body);
  if (error) return res.status(400).json({ message: error });

  const idPrestador =
    req.user.tipo === "admin" && req.body.id_prestador
      ? Number(req.body.id_prestador)
      : Number(req.user.id);

  if (!Number.isInteger(idPrestador)) {
    return res.status(400).json({ message: "Prestador invalido" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO servicos
       (id_prestador, titulo, descricao, categoria, preco, localizacao, imagem_url, ativo)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        idPrestador,
        payload.titulo,
        payload.descricao,
        payload.categoria,
        payload.preco,
        payload.localizacao,
        payload.imagem_url,
      ]
    );

    await connection.query(
      "INSERT INTO estatisticas (id_servico) VALUES (?)",
      [result.insertId]
    );

    await connection.commit();

    const [created] = await pool.query(
      `SELECT s.*, u.nome AS prestador
       FROM servicos s
       JOIN utilizadores u ON u.id_utilizador = s.id_prestador
       WHERE s.id_servico = ?`,
      [result.insertId]
    );

    res.status(201).json(created[0]);
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Erro ao criar servico", erro: err.message });
  } finally {
    connection.release();
  }
});

/**
 * Rota de prototipo antiga, mantida para testes manuais.
 */
router.post("/dev", async (req, res) => {
  const { id_prestador, titulo, descricao, categoria, preco, localizacao, imagem_url } = req.body;

  if (!id_prestador || !titulo || !descricao || !categoria || preco == null) {
    return res.status(400).json({ message: "Campos obrigatorios em falta" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO servicos
       (id_prestador, titulo, descricao, categoria, preco, localizacao, imagem_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_prestador, titulo, descricao, categoria, preco, localizacao, imagem_url || null]
    );

    await pool.query("INSERT INTO estatisticas (id_servico) VALUES (?)", [result.insertId]);

    res.status(201).json({ message: "Servico criado com sucesso (modo prototipo)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar servico", erro: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT
         s.*,
         u.nome AS prestador,
         COALESCE(AVG(a.nota), 0) AS rating,
         COUNT(a.id_avaliacao) AS total_avaliacoes
       FROM servicos s
       JOIN utilizadores u ON s.id_prestador = u.id_utilizador
       LEFT JOIN avaliacoes a ON a.id_servico = s.id_servico
       WHERE s.id_servico = ?
       GROUP BY s.id_servico`,
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: "Servico nao encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter servico" });
  }
});

/**
 * PUT /api/servicos/:id
 * Editar servico.
 */
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso apenas para prestadores" });
  }

  const serviceCheck = await findServiceForUser(req.params.id, req.user);
  if (serviceCheck.errorStatus) {
    return res.status(serviceCheck.errorStatus).json({ message: serviceCheck.message });
  }

  const { payload, error } = normalizeServicePayload(req.body);
  if (error) return res.status(400).json({ message: error });

  const ativo = req.body.ativo == null ? serviceCheck.service.ativo : req.body.ativo ? 1 : 0;
  const fields = { ...payload, ativo };

  try {
    await pool.query(
      `UPDATE servicos
       SET titulo = ?, descricao = ?, categoria = ?, preco = ?, localizacao = ?, imagem_url = ?, ativo = ?
       WHERE id_servico = ?`,
      [
        fields.titulo,
        fields.descricao,
        fields.categoria,
        fields.preco,
        fields.localizacao,
        fields.imagem_url,
        fields.ativo,
        req.params.id,
      ]
    );

    const [updated] = await pool.query(
      `SELECT s.*, u.nome AS prestador
       FROM servicos s
       JOIN utilizadores u ON u.id_utilizador = s.id_prestador
       WHERE s.id_servico = ?`,
      [req.params.id]
    );

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar servico", erro: err.message });
  }
});

/**
 * PATCH /api/servicos/:id
 * Atualizacao parcial, util para ativar/desativar.
 */
router.patch("/:id", verifyToken, async (req, res) => {
  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso apenas para prestadores" });
  }

  const serviceCheck = await findServiceForUser(req.params.id, req.user);
  if (serviceCheck.errorStatus) {
    return res.status(serviceCheck.errorStatus).json({ message: serviceCheck.message });
  }

  const entries = allowedUpdateFields
    .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
    .map((field) => {
      if (field === "ativo") return [field, req.body[field] ? 1 : 0];
      if (field === "preco") return [field, Number(req.body[field])];
      return [field, typeof req.body[field] === "string" ? req.body[field].trim() || null : req.body[field]];
    });

  if (!entries.length) {
    return res.status(400).json({ message: "Nenhum campo para atualizar" });
  }

  const precoEntry = entries.find(([field]) => field === "preco");
  if (precoEntry && (!Number.isFinite(precoEntry[1]) || precoEntry[1] < 0)) {
    return res.status(400).json({ message: "Preco invalido" });
  }

  try {
    await pool.query(
      `UPDATE servicos
       SET ${entries.map(([field]) => `${field} = ?`).join(", ")}
       WHERE id_servico = ?`,
      [...entries.map(([, value]) => value), req.params.id]
    );

    const [updated] = await pool.query("SELECT * FROM servicos WHERE id_servico = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar servico", erro: err.message });
  }
});

/**
 * DELETE /api/servicos/:id
 * Apagar servico e limpar tabelas dependentes.
 */
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso apenas para prestadores" });
  }

  const serviceCheck = await findServiceForUser(req.params.id, req.user);
  if (serviceCheck.errorStatus) {
    return res.status(serviceCheck.errorStatus).json({ message: serviceCheck.message });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM favoritos WHERE id_servico = ?", [req.params.id]);
    await connection.query("DELETE FROM estatisticas WHERE id_servico = ?", [req.params.id]);
    await connection.query("DELETE FROM avaliacoes WHERE id_servico = ?", [req.params.id]);
    await connection.query("DELETE FROM mensagens WHERE id_servico = ?", [req.params.id]);
    await connection.query("DELETE FROM servicos WHERE id_servico = ?", [req.params.id]);
    await connection.commit();

    res.json({ message: "Servico eliminado" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Erro ao eliminar servico", erro: err.message });
  } finally {
    connection.release();
  }
});

export default router;
