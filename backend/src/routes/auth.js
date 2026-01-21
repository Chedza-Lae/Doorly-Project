import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const router = express.Router();

// ------------------------
// REGISTO
// ------------------------
router.post("/register", async (req, res) => {
  const { nome, email, password, tipo } = req.body;

  try {
    // verificar se já existe utilizador com esse email
    const [exists] = await db.query(
      "SELECT * FROM utilizadores WHERE email = ?",
      [email]
    );
    if (exists.length > 0) {
      return res.status(400).json({ msg: "Email já registado" });
    }

    // força tipo cliente se não for fornecido ou se tentar criar admin
    let finalTipo = "cliente";
    if (tipo && tipo !== "admin") {
      finalTipo = tipo; // cliente ou prestador
    }

    // hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // inserir utilizador
    const [result] = await db.query(
      "INSERT INTO utilizadores (nome, email, password_hash, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, hashedPassword, finalTipo]
    );

    res.status(201).json({
      msg: "Registo feito com sucesso",
      user: {
        id: result.insertId,
        nome,
        email,
        tipo: finalTipo,
      },
    });
  } catch (err) {
    // se trigger do admin bloquear
    if (err.code === "45000") {
      return res.status(400).json({ msg: err.sqlMessage });
    }
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
// LOGIN
// ------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM utilizadores WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    const user = rows[0];

    // comparar password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    // gerar JWT
    const token = jwt.sign(
      { id: user.id_utilizador, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id_utilizador,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
