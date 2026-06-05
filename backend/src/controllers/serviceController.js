import { parsePositiveId } from "../validators/commonValidators.js";
import {
  validatePartialServicePayload,
  validateServicePayload
} from "../validators/serviceValidator.js";
import {
  createDevService,
  createProviderService,
  deleteProviderService,
  getProviderServices,
  getPublicServices,
  getServiceDetails,
  patchProviderService,
  updateProviderService
} from "../services/serviceService.js";

// CLEAN ARCHITECTURE: lista publica.
export async function list(req, res) {
  return res.json(await getPublicServices({ q: req.query.q }));
}

// CLEAN ARCHITECTURE: servicos do prestador.
export async function listMine(req, res) {
  return res.json(await getProviderServices(req.user));
}

// CLEAN ARCHITECTURE: cria servico.
export async function create(req, res) {
  const payload = validateServicePayload(req.body);
  const explicitProviderId = req.body.id_prestador ? parsePositiveId(req.body.id_prestador, "id_prestador") : null;
  return res.status(201).json(await createProviderService(req.user, payload, explicitProviderId));
}

// CLEAN ARCHITECTURE: rota dev legada mantida.
export async function createDev(req, res) {
  const payload = validateServicePayload(req.body);
  const id_prestador = parsePositiveId(req.body.id_prestador, "id_prestador");
  const service = await createDevService({ ...payload, id_prestador });
  return res.status(201).json(service);
}

// SUPABASE MIGRATION: detalhe com estatisticas.
export async function details(req, res) {
  const id = parsePositiveId(req.params.id);
  return res.json(await getServiceDetails(id));
}

// CLEAN ARCHITECTURE: update completo.
export async function update(req, res) {
  const id = parsePositiveId(req.params.id);
  const payload = {
    ...validateServicePayload(req.body),
    ativo: req.body.ativo
  };
  return res.json(await updateProviderService(id, req.user, payload));
}

// CLEAN ARCHITECTURE: update parcial.
export async function patch(req, res) {
  const id = parsePositiveId(req.params.id);
  const payload = validatePartialServicePayload(req.body);
  return res.json(await patchProviderService(id, req.user, payload));
}

// CLEAN ARCHITECTURE: delete.
export async function remove(req, res) {
  const id = parsePositiveId(req.params.id);
  await deleteProviderService(id, req.user);
  return res.json({ message: "Servico eliminado" });
}
