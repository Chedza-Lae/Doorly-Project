import { HttpError } from "../utils/httpError.js";

// CLEAN ARCHITECTURE: middleware global com formato de erro único em toda a API.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err instanceof HttpError ? err.status : 500;
  const payload = {
    success: false,
    message: err.message || "Erro interno do servidor"
  };

  if (process.env.NODE_ENV !== "production") {
    payload.error = err.details || err.stack || err.message;
  }

  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json(payload);
}
