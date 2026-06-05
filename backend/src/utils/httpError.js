// CLEAN ARCHITECTURE: erro HTTP padronizado para services e controllers.
export class HttpError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

// CLEAN ARCHITECTURE: helper para lançar erros consistentes sem duplicar objetos.
export function createHttpError(status, message, details = null) {
  return new HttpError(status, message, details);
}
