// CLEAN ARCHITECTURE: encaminha erros async para o middleware global do Express.
export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
