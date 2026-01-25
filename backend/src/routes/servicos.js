import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/servicos
 * Home + Pesquisa
 */
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;

    let sql = `
      SELECT s.*, u.nome AS prestador
      FROM servicos s
      JOIN utilizadores u ON s.id_prestador = u.id_utilizador
      WHERE s.ativo = 1
    `;

    const params = [];

    if (q) {
      sql += " AND (s.titulo LIKE ? OR s.categoria LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar serviços" });
  }
});

/**
 * POST /api/servicos
 * Criar serviço (prestador)
 */
router.post("/", verifyToken, async (req, res) => {
  if (req.user.tipo !== "prestador" && req.user.tipo !== "admin") {
    return res.status(403).json({
      message: "Apenas prestadores podem criar serviços"
    });
  }

  const { titulo, descricao, categoria, preco, localizacao } = req.body;

  if (!titulo || !descricao || !categoria || !preco) {
    return res.status(400).json({
      message: "Campos obrigatórios em falta"
    });
  }

  try {
    await pool.query(
      `INSERT INTO servicos
       (id_prestador, titulo, descricao, categoria, preco, localizacao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id_utilizador, titulo, descricao, categoria, preco, localizacao]
    );

    res.status(201).json({ message: "Serviço criado com sucesso" });
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: "Erro ao criar serviço", erro: err.message });
}
});

/**
 * GET /api/servicos/me
 * Serviços do prestador (dashboard)
 */
router.get("/me", verifyToken, async (req, res) => {
  if (req.user.tipo !== "prestador") {
    return res.status(403).json({
      message: "Acesso apenas para prestadores"
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM servicos WHERE id_prestador = ?",
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao obter serviços do prestador"
    });
  }
});

export default router;


