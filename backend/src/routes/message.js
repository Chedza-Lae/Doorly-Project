// routes/messages.js
import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { id_servico, conteudo } = req.body;
    const id_rementente = req.user.id;

    if (!id_servico || !conteudo?.trim()) {
      return res.status(400).json({ message: "id_servico e conteudo são obrigatórios" });
    }

    // Buscar o prestador do serviço
    const [servicos] = await db.query(
      "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = ?",
      [id_servico]
    );

    if (servicos.length === 0) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    const id_destinatario = servicos[0].id_prestador;

    // Evitar enviar mensagem para si mesmo (opcional, mas bom)
    if (id_destinatario === id_rementente) {
      return res.status(400).json({ message: "Não podes enviar mensagem para ti mesmo" });
    }

    await pool.query(
      "INSERT INTO mensagens (id_servico, id_remetente, id_destinatario, conteudo) VALUES (?,?,?,?)",
      [id_servico, id_rementente, id_destinatario, conteudo.trim()]
    );

    return res.json({ message: "Mensagem enviada com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
});

/**
 * Inbox: mensagens recebidas pelo utilizador logado
 */
router.get("/inbox", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT m.idmensagens, m.id_servico, m.id_remetente, m.id_destinatario, m.conteudo, m.data_envio,
              s.titulo AS titulo_servico,
              u.nome AS nome_remetente
       FROM mensagens m
       JOIN servicos s ON s.id_servico = m.id_servico
       JOIN utilizadores u ON u.id_utilizador = m.id_remetente
       WHERE m.id_destinatario = ?
       ORDER BY m.data_envio DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao carregar inbox" });
  }
});

// Responder
router.get("/thread", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id_servico, other_id } = req.query;

    if (!id_servico || !other_id) {
      return res.status(400).json({ message: "id_servico e other_id são obrigatórios" });
    }

    const [rows] = await pool.query(
      `SELECT m.idmensagens, m.id_servico, m.id_remetente, m.id_destinatario, m.conteudo, m.data_envio,
              u.nome AS nome_remetente
       FROM mensagens m
       JOIN utilizadores u ON u.id_utilizador = m.id_remetente
       WHERE m.id_servico = ?
         AND (
           (m.id_remetente = ? AND m.id_destinatario = ?)
           OR
           (m.id_remetente = ? AND m.id_destinatario = ?)
         )
       ORDER BY m.data_envio ASC`,
      [id_servico, userId, other_id, other_id, userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao carregar conversa" });
  }
});

// Responder
router.post("/reply", verifyToken, async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { service_id, other_id, content } = req.body;

    if (!service_id || !other_id || !content?.trim()) {
      return res.status(400).json({ message: "service_id, other_id e content são obrigatórios" });
    }

    if (Number(other_id) === Number(sender_id)) {
      return res.status(400).json({ message: "Não podes responder para ti mesmo" });
    }

    const [servicos] = await pool.query("SELECT id FROM servicos WHERE id = ?", [service_id]);
    if (servicos.length === 0) return res.status(404).json({ message: "Serviço não encontrado" });

    await db.query(
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

