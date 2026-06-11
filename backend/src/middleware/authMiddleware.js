import jwt from "jsonwebtoken";
import { findUserById } from "../repositories/userRepository.js";
import { getUserAccessError } from "../utils/userAccess.js";

// CLEAN ARCHITECTURE: valida JWT e bloqueia contas desativadas/banidas mesmo com tokens antigos.
export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ success: false, message: "JWT_SECRET não configurado" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }

  try {
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Utilizador não encontrado" });
    }

    const accessError = getUserAccessError(user);
    if (accessError) {
      return res.status(403).json({ success: false, message: accessError });
    }

    req.user = {
      id: user.id_utilizador,
      id_utilizador: user.id_utilizador,
      tipo: user.tipo,
      email: user.email
    };

    next();
  } catch (err) {
    next(err);
  }
}

// CLEAN ARCHITECTURE: middleware admin partilhado por routes/controllers.
export function isAdmin(req, res, next) {
  if (!req.user || req.user.tipo !== "admin") {
    return res.status(403).json({ success: false, message: "Acesso restrito a administradores" });
  }
  next();
}
