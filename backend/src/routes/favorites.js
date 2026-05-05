import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

function parsePositiveId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.get("/", async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `
        SELECT s.*, u.nome AS prestador, f.data_adicionado
        FROM favoritos f
        JOIN servicos s ON f.id_servico = s.id_servico
        JOIN utilizadores u ON s.id_prestador = u.id_utilizador
        WHERE f.id_cliente = ? AND s.ativo = 1
        ORDER BY f.data_adicionado DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erro ao carregar favoritos:", err);
    res.status(500).json({ message: "Erro ao carregar favoritos" });
  }
});

router.post("/", async (req, res) => {
  // O cliente envia so o servico; o utilizador vem do token para gravar o id_cliente correto.
  const userId = req.user.id;
  const serviceId = parsePositiveId(req.body.id_servico);

  if (!serviceId) {
    return res.status(400).json({ message: "Servico invalido" });
  }

  try {
    const [services] = await pool.query(
      "SELECT id_servico FROM servicos WHERE id_servico = ? AND ativo = 1",
      [serviceId]
    );

    if (services.length === 0) {
      return res.status(404).json({ message: "Servico nao encontrado" });
    }

    const [existing] = await pool.query(
      "SELECT id_favorito FROM favoritos WHERE id_cliente = ? AND id_servico = ?",
      [userId, serviceId]
    );

    if (existing.length === 0) {
      await pool.query(
        "INSERT INTO favoritos (id_cliente, id_servico) VALUES (?, ?)",
        [userId, serviceId]
      );
    }

    res.status(existing.length === 0 ? 201 : 200).json({ success: true });
  } catch (err) {
    console.error("Erro ao adicionar favorito:", err);
    res.status(500).json({ message: "Erro ao adicionar favorito" });
  }
});

router.delete("/", async (req, res) => {
  // Remove sempre usando o utilizador autenticado para nao apagar favoritos de outra conta.
  const userId = req.user.id;
  const serviceId = parsePositiveId(req.body.id_servico);

  if (!serviceId) {
    return res.status(400).json({ message: "Servico invalido" });
  }

  try {
    await pool.query(
      "DELETE FROM favoritos WHERE id_cliente = ? AND id_servico = ?",
      [userId, serviceId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao remover favorito:", err);
    res.status(500).json({ message: "Erro ao remover favorito" });
  }
});

export default router;
