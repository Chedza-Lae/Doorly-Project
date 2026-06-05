import {
  validateForgotPasswordPayload,
  validateLoginPayload,
  validateRegisterPayload,
  validateResetPasswordPayload
} from "../validators/authValidator.js";
import {
  forgotPassword,
  loginUser,
  refreshAuthToken,
  registerUser,
  resetPassword
} from "../services/authService.js";

// CLEAN ARCHITECTURE: controller de registo.
export async function register(req, res) {
  const payload = validateRegisterPayload(req.body);
  const user = await registerUser(payload);
  return res.status(201).json({
    msg: "Registo feito com sucesso",
    user: {
      id: user.id_utilizador,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo
    }
  });
}

// CLEAN ARCHITECTURE: controller de login.
export async function login(req, res) {
  const payload = validateLoginPayload(req.body);
  return res.json(await loginUser(payload));
}

// CLEAN ARCHITECTURE: controller forgot password.
export async function forgot(req, res) {
  const payload = validateForgotPasswordPayload(req.body);
  await forgotPassword(payload);
  return res.json({ message: "Email enviado com sucesso" });
}

// CLEAN ARCHITECTURE: controller reset password.
export async function reset(req, res) {
  const payload = validateResetPasswordPayload(req.body);
  await resetPassword(req.params.token, payload);
  return res.json({ message: "Password alterada com sucesso" });
}

// NEW FEATURE: refresh token quando o cliente ja esta autenticado.
export async function refresh(req, res) {
  return res.json(refreshAuthToken(req.user));
}
