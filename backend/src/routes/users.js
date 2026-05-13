import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

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
    const [rows] = await pool.query(
      "SELECT id_utilizador, nome, email, tipo, ativo, data_registo FROM utilizadores WHERE id_utilizador = ?",
      [req.userId]
    );

    if (rows.length === 0) return res.status(404).json({ msg: "Utilizador não encontrado" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_utilizador AS id, nome, email, tipo, ativo, data_registo FROM utilizadores WHERE id_utilizador = ?",
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Utilizador nao encontrado" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erro ao carregar perfil", error: err.message });
  }
});

router.put("/me", verifyToken, async (req, res) => {
  const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const currentPassword = req.body.currentPassword || "";
  const newPassword = req.body.newPassword || "";

  if (!nome || !email) {
    return res.status(400).json({ message: "Nome e email sao obrigatorios" });
  }

  if (newPassword && newPassword.length < 6) {
    return res.status(400).json({ message: "A nova password deve ter pelo menos 6 caracteres" });
  }

  try {
    const [existingEmail] = await pool.query(
      "SELECT id_utilizador FROM utilizadores WHERE email = ? AND id_utilizador <> ?",
      [email, req.user.id]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email ja esta em uso" });
    }

    if (newPassword) {
      const [users] = await pool.query(
        "SELECT password_hash FROM utilizadores WHERE id_utilizador = ?",
        [req.user.id]
      );

      if (users.length === 0) return res.status(404).json({ message: "Utilizador nao encontrado" });

      const matches = await bcrypt.compare(currentPassword, users[0].password_hash);
      if (!matches) {
        return res.status(400).json({ message: "Password atual incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query(
        "UPDATE utilizadores SET nome = ?, email = ?, password_hash = ? WHERE id_utilizador = ?",
        [nome, email, hashedPassword, req.user.id]
      );
    } else {
      await pool.query(
        "UPDATE utilizadores SET nome = ?, email = ? WHERE id_utilizador = ?",
        [nome, email, req.user.id]
      );
    }

    const [updated] = await pool.query(
      "SELECT id_utilizador AS id, nome, email, tipo FROM utilizadores WHERE id_utilizador = ?",
      [req.user.id]
    );

    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar perfil", error: err.message });
  }
});

export default router;
