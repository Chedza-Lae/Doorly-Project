import { validateProfilePayload } from "../validators/authValidator.js";
import { getProfile, updateMyProfile } from "../services/userService.js";

// CLEAN ARCHITECTURE: perfil autenticado.
export async function profile(req, res) {
  return res.json(await getProfile(req.user.id));
}

// CLEAN ARCHITECTURE: alias legado /profile.
export async function legacyProfile(req, res) {
  return res.json(await getProfile(req.user.id));
}

// CLEAN ARCHITECTURE: atualizacao do proprio perfil.
export async function updateMe(req, res) {
  const payload = validateProfilePayload(req.body);
  return res.json(await updateMyProfile(req.user.id, payload));
}
