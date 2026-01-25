import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guarda info do utilizador
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

export function isAdmin(req, res, next) {
  if (req.user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso restrito a administradores" });
  }
  next();
}