import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

let setupPromise;

function ensureQuoteTable() {
  if (!setupPromise) {
    setupPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos_orcamento (
        id_orcamento INT AUTO_INCREMENT PRIMARY KEY,
        id_servico INT NOT NULL,
        id_cliente INT NOT NULL,
        id_prestador INT NOT NULL,
        detalhes TEXT NOT NULL,
        localizacao VARCHAR(150) NULL,
        data_preferida DATE NULL,
        periodo VARCHAR(50) NULL,
        urgencia VARCHAR(50) NULL,
        orcamento_estimado DECIMAL(10,2) NULL,
        contacto VARCHAR(150) NULL,
        estado VARCHAR(30) NOT NULL DEFAULT 'novo',
        id_mensagem INT NULL,
        data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_orcamentos_prestador (id_prestador, data_pedido),
        INDEX idx_orcamentos_cliente (id_cliente, data_pedido),
        INDEX idx_orcamentos_servico (id_servico)
      )
    `);
  }

  return setupPromise;
}

function buildQuoteMessage({ service, user, body }) {
  return [
    "Pedido de orcamento",
    "",
    `Servico: ${service.titulo}`,
    `Cliente: ${user.email}`,
    `Detalhes: ${body.detalhes.trim()}`,
    `Localizacao: ${body.localizacao?.trim() || "A combinar"}`,
    `Data preferida: ${body.data_preferida || "A combinar"}`,
    `Periodo: ${body.periodo || "Flexivel"}`,
    `Urgencia: ${body.urgencia || "Normal"}`,
    `Orcamento aproximado: ${body.orcamento_estimado ? `${body.orcamento_estimado} EUR` : "A combinar"}`,
    `Contacto: ${body.contacto?.trim() || user.email || "A combinar"}`
  ].join("\n");
}

router.post("/", verifyToken, async (req, res) => {
  await ensureQuoteTable();

  const {
    id_servico,
    detalhes,
    localizacao,
    data_preferida,
    periodo,
    urgencia,
    orcamento_estimado,
    contacto
  } = req.body;

  if (!id_servico || !detalhes?.trim()) {
    return res.status(400).json({ message: "id_servico e detalhes sao obrigatorios" });
  }

  const budget = orcamento_estimado === "" || orcamento_estimado == null
    ? null
    : Number(orcamento_estimado);

  if (budget != null && (!Number.isFinite(budget) || budget < 0)) {
    return res.status(400).json({ message: "Orcamento invalido" });
  }

  const connection = await pool.getConnection();

  try {
    const [[service]] = await connection.query(
      `SELECT s.id_servico, s.id_prestador, s.titulo, u.email AS prestador_email
       FROM servicos s
       JOIN utilizadores u ON u.id_utilizador = s.id_prestador
       WHERE s.id_servico = ?`,
      [id_servico]
    );

    if (!service) {
      return res.status(404).json({ message: "Servico nao encontrado" });
    }

    if (Number(service.id_prestador) === Number(req.user.id)) {
      return res.status(400).json({ message: "Nao podes pedir orcamento ao teu proprio servico" });
    }

    await connection.beginTransaction();

    const [quoteResult] = await connection.query(
      `INSERT INTO pedidos_orcamento
       (id_servico, id_cliente, id_prestador, detalhes, localizacao, data_preferida, periodo, urgencia, orcamento_estimado, contacto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        service.id_servico,
        req.user.id,
        service.id_prestador,
        detalhes.trim(),
        localizacao?.trim() || null,
        data_preferida || null,
        periodo || "Flexivel",
        urgencia || "Normal",
        budget,
        contacto?.trim() || req.user.email || null
      ]
    );

    const message = buildQuoteMessage({
      service,
      user: req.user,
      body: {
        detalhes,
        localizacao,
        data_preferida,
        periodo,
        urgencia,
        orcamento_estimado: budget,
        contacto
      }
    });

    const [messageResult] = await connection.query(
      "INSERT INTO mensagens (id_servico, id_remetente, id_destinatario, conteudo) VALUES (?, ?, ?, ?)",
      [service.id_servico, req.user.id, service.id_prestador, message]
    );

    await connection.query(
      "UPDATE pedidos_orcamento SET id_mensagem = ? WHERE id_orcamento = ?",
      [messageResult.insertId, quoteResult.insertId]
    );

    const [statsUpdate] = await connection.query(
      "UPDATE estatisticas SET pedidos = COALESCE(pedidos, 0) + 1, ultima_atualizacao = NOW() WHERE id_servico = ?",
      [service.id_servico]
    );

    if (statsUpdate.affectedRows === 0) {
      await connection.query(
        "INSERT INTO estatisticas (id_servico, visualizacoes, pedidos, ultima_atualizacao) VALUES (?, 0, 1, NOW())",
        [service.id_servico]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: "Pedido de orcamento enviado",
      id_orcamento: quoteResult.insertId,
      other_id: service.id_prestador
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res.status(500).json({ message: "Erro ao enviar pedido de orcamento" });
  } finally {
    connection.release();
  }
});

router.get("/provider", verifyToken, async (req, res) => {
  await ensureQuoteTable();

  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso apenas para prestadores" });
  }

  try {
    const params = [];
    let ownerClause = "";

    if (req.user.tipo !== "admin") {
      ownerClause = "WHERE p.id_prestador = ?";
      params.push(req.user.id);
    }

    const [rows] = await pool.query(
      `SELECT
         p.*,
         s.titulo AS titulo_servico,
         c.nome AS nome_cliente,
         c.email AS email_cliente
       FROM pedidos_orcamento p
       JOIN servicos s ON s.id_servico = p.id_servico
       JOIN utilizadores c ON c.id_utilizador = p.id_cliente
       ${ownerClause}
       ORDER BY p.data_pedido DESC, p.id_orcamento DESC`,
      params
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao carregar pedidos de orcamento" });
  }
});

router.patch("/:id/status", verifyToken, async (req, res) => {
  await ensureQuoteTable();

  const allowed = new Set(["novo", "em_analise", "respondido", "fechado"]);
  const estado = String(req.body.estado || "");

  if (!allowed.has(estado)) {
    return res.status(400).json({ message: "Estado invalido" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE pedidos_orcamento
       SET estado = ?
       WHERE id_orcamento = ?
         AND (id_prestador = ? OR ? = 'admin')`,
      [estado, req.params.id, req.user.id, req.user.tipo]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }

    return res.json({ message: "Estado atualizado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao atualizar pedido" });
  }
});

export default router;
