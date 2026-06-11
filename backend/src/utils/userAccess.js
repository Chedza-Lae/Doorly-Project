// CLEAN ARCHITECTURE: centraliza bloqueios para login e tokens já emitidos.
export function getUserAccessError(user) {
  if (user.ativo === false || user.ativo === 0) {
    return "A tua conta está desativada";
  }

  if (user.status === "banido") {
    const banUntil = user.ban_until ? new Date(user.ban_until) : null;
    const isTemporaryBanExpired = banUntil && banUntil <= new Date();

    if (!isTemporaryBanExpired) {
      return user.ban_reason
        ? `A tua conta foi banida: ${user.ban_reason}`
        : "A tua conta foi banida";
    }
  }

  return null;
}
