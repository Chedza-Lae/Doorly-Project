// routes/messages.js
import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const id_servico = req.body.id_servico ?? req.body.service_id;
    const conteudo = req.body.conteudo ?? req.body.content;
    const id_remetente = req.user.id;

    if (!id_servico || !conteudo?.trim()) {
      return res.status(400).json({ message: "id_servico e conteudo sao obrigatorios" });
    }

    const [servicos] = await pool.query(
      "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = ?",
      [id_servico]
    );

    if (servicos.length === 0) {
      return res.status(404).json({ message: "Servico nao encontrado" });
    }

    const id_destinatario = servicos[0].id_prestador;

    if (Number(id_destinatario) === Number(id_remetente)) {
      return res.status(400).json({ message: "Nao podes enviar mensagem para ti mesmo" });
    }

    await pool.query(
      "INSERT INTO mensagens (id_servico, id_remetente, id_destinatario, conteudo) VALUES (?,?,?,?)",
      [id_servico, id_remetente, id_destinatario, conteudo.trim()]
    );

    return res.json({
      message: "Mensagem enviada com sucesso",
      other_id: id_destinatario
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
});

/**
 * Inbox: conversas do utilizador logado, incluindo mensagens enviadas e recebidas.
 */
router.get("/inbox", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
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
             WHEN id_remetente = ? THEN id_destinatario
             ELSE id_remetente
           END AS other_id,
           MAX(idmensagens) AS last_message_id
         FROM mensagens
         WHERE id_remetente = ? OR id_destinatario = ?
         GROUP BY
           id_servico,
           CASE
             WHEN id_remetente = ? THEN id_destinatario
             ELSE id_remetente
           END
       ) latest ON latest.last_message_id = m.idmensagens
       JOIN servicos s ON s.id_servico = m.id_servico
       JOIN utilizadores remetente ON remetente.id_utilizador = m.id_remetente
       JOIN utilizadores interlocutor ON interlocutor.id_utilizador = latest.other_id
       ORDER BY m.data_envio DESC, m.idmensagens DESC`,
      [userId, userId, userId, userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao carregar inbox" });
  }
});

router.get("/thread", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const id_servico = req.query.id_servico ?? req.query.service_id;
    const { other_id } = req.query;

    if (!id_servico || !other_id) {
      return res.status(400).json({ message: "id_servico e other_id sao obrigatorios" });
    }

    const [rows] = await pool.query(
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
       WHERE m.id_servico = ?
         AND (
           (m.id_remetente = ? AND m.id_destinatario = ?)
           OR
           (m.id_remetente = ? AND m.id_destinatario = ?)
         )
       ORDER BY m.data_envio ASC, m.idmensagens ASC`,
      [id_servico, userId, other_id, other_id, userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao carregar conversa" });
  }
});

router.post("/reply", verifyToken, async (req, res) => {
  try {
    const sender_id = req.user.id;
    const service_id = req.body.service_id ?? req.body.id_servico;
    const other_id = req.body.other_id;
    const content = req.body.content ?? req.body.conteudo;

    if (!service_id || !other_id || !content?.trim()) {
      return res.status(400).json({ message: "service_id, other_id e content sao obrigatorios" });
    }

    if (Number(other_id) === Number(sender_id)) {
      return res.status(400).json({ message: "Nao podes responder para ti mesmo" });
    }

    const [servicos] = await pool.query(
      "SELECT id_servico FROM servicos WHERE id_servico = ?",
      [service_id]
    );

    if (servicos.length === 0) {
      return res.status(404).json({ message: "Servico nao encontrado" });
    }

    await pool.query(
      "INSERT INTO mensagens (id_servico, id_remetente, id_destinatario, conteudo) VALUES (?,?,?,?)",
      [service_id, sender_id, other_id, content.trim()]
    );

    return res.json({ message: "Resposta enviada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao responder" });
  }
});

export default router;
