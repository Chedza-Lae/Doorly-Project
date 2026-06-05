import jwt from "jsonwebtoken";

// CLEAN ARCHITECTURE: middleware JWT com resposta de erro consistente.
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token nao fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      id_utilizador: decoded.id,
      tipo: decoded.tipo,
      email: decoded.email
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalido" });
  }
}

// CLEAN ARCHITECTURE: middleware admin partilhado por routes/controllers.
export function isAdmin(req, res, next) {
  if (!req.user || req.user.tipo !== "admin") {
    return res.status(403).json({ success: false, message: "Acesso restrito a administradores" });
  }
  next();
}
