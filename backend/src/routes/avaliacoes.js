import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

async function ensureReviewsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
      id_servico INT NOT NULL,
      id_cliente INT NOT NULL,
      nota TINYINT NOT NULL,
      comentario TEXT NULL,
      data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_avaliacoes_servico (id_servico, data),
      INDEX idx_avaliacoes_cliente (id_cliente)
    )
  `);
}

router.get("/service/:id", async (req, res) => {
  await ensureReviewsTable();

  try {
    const [rows] = await pool.query(
      `SELECT
         a.id_avaliacao,
         a.id_servico,
         a.id_cliente,
         a.nota,
         a.comentario,
         a.data,
         u.nome AS cliente
       FROM avaliacoes a
       JOIN utilizadores u ON u.id_utilizador = a.id_cliente
       WHERE a.id_servico = ?
       ORDER BY a.data DESC, a.id_avaliacao DESC`,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao carregar avaliacoes" });
  }
});

router.get("/provider", verifyToken, async (req, res) => {
  await ensureReviewsTable();

  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso apenas para prestadores" });
  }

  const params = [];
  let ownerClause = "";

  if (req.user.tipo !== "admin") {
    ownerClause = "WHERE s.id_prestador = ?";
    params.push(req.user.id);
  }

  try {
    const [rows] = await pool.query(
      `SELECT
         a.id_avaliacao,
         a.id_servico,
         a.id_cliente,
         a.nota,
         a.comentario,
         a.data,
         s.titulo AS titulo_servico,
         c.nome AS cliente
       FROM avaliacoes a
       JOIN servicos s ON s.id_servico = a.id_servico
       JOIN utilizadores c ON c.id_utilizador = a.id_cliente
       ${ownerClause}
       ORDER BY a.data DESC, a.id_avaliacao DESC`,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao carregar avaliacoes do prestador" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  await ensureReviewsTable();

  if (req.user.tipo !== "cliente") {
    return res.status(403).json({ message: "Apenas clientes podem avaliar servicos" });
  }

  const idServico = Number(req.body.id_servico);
  const nota = Number(req.body.nota);
  const comentario = typeof req.body.comentario === "string" ? req.body.comentario.trim() : "";

  if (!Number.isInteger(idServico)) {
    return res.status(400).json({ message: "Servico invalido" });
  }

  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return res.status(400).json({ message: "A nota deve ser entre 1 e 5" });
  }

  if (!comentario) {
    return res.status(400).json({ message: "Escreve um comentario para ajudar outros clientes" });
  }

  try {
    const [[service]] = await pool.query(
      "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = ?",
      [idServico]
    );

    if (!service) {
      return res.status(404).json({ message: "Servico nao encontrado" });
    }

    if (Number(service.id_prestador) === Number(req.user.id)) {
      return res.status(400).json({ message: "Nao podes avaliar o teu proprio servico" });
    }

    const [existing] = await pool.query(
      "SELECT id_avaliacao FROM avaliacoes WHERE id_servico = ? AND id_cliente = ?",
      [idServico, req.user.id]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE avaliacoes SET nota = ?, comentario = ?, data = NOW() WHERE id_avaliacao = ?",
        [nota, comentario, existing[0].id_avaliacao]
      );
    } else {
      await pool.query(
        "INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario) VALUES (?, ?, ?, ?)",
        [idServico, req.user.id, nota, comentario]
      );
    }

    const [[summary]] = await pool.query(
      "SELECT COALESCE(AVG(nota), 0) AS rating, COUNT(*) AS total_avaliacoes FROM avaliacoes WHERE id_servico = ?",
      [idServico]
    );

    res.status(existing.length > 0 ? 200 : 201).json({
      message: existing.length > 0 ? "Avaliacao atualizada" : "Avaliacao criada",
      rating: summary.rating,
      total_avaliacoes: summary.total_avaliacoes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao guardar avaliacao" });
  }
});

export default router;
