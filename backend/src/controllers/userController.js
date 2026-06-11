import { validatePasswordPayload, validateProfilePayload } from "../validators/authValidator.js";
import { getProfile, updateMyPassword, updateMyProfile } from "../services/userService.js";

// CLEAN ARCHITECTURE: perfil autenticado.
export async function profile(req, res) {
  return res.json(await getProfile(req.user.id));
}

// CLEAN ARCHITECTURE: alias legado /profile.
export async function legacyProfile(req, res) {
  return res.json(await getProfile(req.user.id));
}

// CLEAN ARCHITECTURE: atualização do próprio perfil.
export async function updateMe(req, res) {
  const payload = validateProfilePayload(req.body);
  return res.json(await updateMyProfile(req.user.id, payload));
}

// CLEAN ARCHITECTURE: alteração de password separada do perfil.
export async function updatePassword(req, res) {
  const payload = validatePasswordPayload(req.body);
  await updateMyPassword(req.user.id, payload);
  return res.json({ message: "Password alterada com sucesso" });
}
