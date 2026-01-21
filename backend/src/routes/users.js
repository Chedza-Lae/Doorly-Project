import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const router = express.Router();

// middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Acesso negado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // id_utilizador do JWT
    next();
  } catch {
    res.status(401).json({ msg: "Token inválido" });
  }
};

// rota protegida: perfil do utilizador
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id_utilizador, nome, email, tipo, ativo, data_registo FROM utilizadores WHERE id_utilizador = ?",
      [req.userId]
    );

    if (rows.length === 0) return res.status(404).json({ msg: "Utilizador não encontrado" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
