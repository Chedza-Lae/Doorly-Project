import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/sendEmail.js";

const router = express.Router();

// ------------------------
// REGISTO
// ------------------------
router.post("/register", async (req, res) => {
  const { nome, email, password, tipo } = req.body;

  try {
    // verificar se já existe utilizador com esse email
    const [exists] = await pool.query(
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
    const [result] = await pool.query(
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
    const [rows] = await pool.query(
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
      { id: user.id_utilizador, 
        tipo: user.tipo,
        email: user.email
      },
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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.query(
      "SELECT * FROM utilizadores WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Utilizador não encontrado"
      });
    }

    const user = users[0];

    // gerar token
    const token = crypto.randomBytes(32).toString("hex");

    // expira em 1 hora
    const expires = new Date(Date.now() + 3600000);

    // guardar token
    await pool.query(
      `
      UPDATE utilizadores
      SET reset_token = ?, reset_expires = ?
      WHERE id_utilizador = ?
      `,
      [token, expires, user.id_utilizador]
    );

    // link frontend
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl.replace(/\/$/, "")}/reset-password/${token}`;

    // enviar email
    await sendResetEmail(user.email, resetLink);

    res.json({
      message: "Email enviado com sucesso"
    });

  } catch (error) {
    console.error(error);

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "Base de dados indisponível. Verifica se o MySQL/XAMPP está ligado."
      });
    }

    res.status(500).json({
      message: "Erro ao enviar email"
    });
  }
});

router.put("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {

    const [users] = await pool.query(
      `
      SELECT *
      FROM utilizadores
      WHERE reset_token = ?
      AND reset_expires > NOW()
      `,
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Token inválido ou expirado"
      });
    }

    const user = users[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE utilizadores
      SET
        password_hash = ?,
        reset_token = NULL,
        reset_expires = NULL
      WHERE id_utilizador = ?
      `,
      [hashedPassword, user.id_utilizador]
    );

    res.json({
      message: "Password alterada com sucesso"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao redefinir password"
    });
  }
});

export default router;
