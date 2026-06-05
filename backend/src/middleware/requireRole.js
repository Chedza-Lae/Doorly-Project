// CLEAN ARCHITECTURE: verifica req.user.tipo em vez de req.user.role.
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.tipo)) {
    return res.status(403).json({ success: false, message: "Sem permissoes" });
  }
  next();
};
