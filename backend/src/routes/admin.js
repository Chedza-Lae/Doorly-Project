import express from "express";
import pool from "../config/db.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USERS
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_utilizador, nome, email, tipo FROM utilizadores ORDER BY id_utilizador DESC"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro ao listar utilizadores" });
  }
});

router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM utilizadores WHERE id_utilizador = ?", [id]);
    res.json({ message: "Utilizador eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro ao eliminar utilizador" });
  }
});

// SERVICES
router.get("/services", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id_servico, s.titulo, s.id_prestador, u.nome AS nome_prestador
       FROM servicos s
       JOIN utilizadores u ON u.id_utilizador = s.id_prestador
       ORDER BY s.id_servico DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro ao listar serviços" });
  }
});

router.delete("/services/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM servicos WHERE id_servico = ?", [id]);
    res.json({ message: "Serviço eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro ao eliminar serviço" });
  }
});

export default router;
