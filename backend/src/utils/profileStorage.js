import { randomUUID } from "crypto";
import { createHttpError } from "./httpError.js";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

function getStorageConfig({ bucketEnv, defaultBucket }) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env[bucketEnv] || process.env.SUPABASE_STORAGE_BUCKET || defaultBucket;

  if (!supabaseUrl || !serviceRoleKey) {
    throw createHttpError(500, "Configuracao do Supabase Storage incompleta");
  }

  return { supabaseUrl, serviceRoleKey, bucket };
}

function validateImagePayload({ fileName, contentType, data }) {
  if (!fileName || typeof fileName !== "string") {
    throw createHttpError(400, "Nome do ficheiro invalido");
  }

  if (!allowedTypes.has(contentType)) {
    throw createHttpError(400, "Formato invalido. Usa JPG, PNG ou WEBP");
  }

  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!["jpg", "jpeg", "png", "webp"].includes(extension)) {
    throw createHttpError(400, "Extensao invalida. Usa jpg, jpeg, png ou webp");
  }

  if (!data || typeof data !== "string") {
    throw createHttpError(400, "Imagem em falta");
  }

  const buffer = Buffer.from(data, "base64");
  if (!buffer.length) {
    throw createHttpError(400, "Imagem invalida");
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    throw createHttpError(400, "A imagem deve ter no maximo 2MB");
  }

  return {
    buffer,
    contentType,
    extension: allowedTypes.get(contentType)
  };
}

async function uploadImage({ payload, folder, bucketEnv, defaultBucket }) {
  const { supabaseUrl, serviceRoleKey, bucket } = getStorageConfig({ bucketEnv, defaultBucket });
  const { buffer, contentType, extension } = validateImagePayload(payload);
  const objectPath = `${folder}/${randomUUID()}.${extension}`;

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": contentType,
      "Cache-Control": "3600",
      "x-upsert": "true"
    },
    body: buffer
  });

  if (!response.ok) {
    throw createHttpError(502, "Erro ao fazer upload da imagem para o Supabase");
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export function uploadProfileImage(userId, payload) {
  return uploadImage({
    payload,
    folder: `profiles/${userId}`,
    bucketEnv: "SUPABASE_PROFILE_IMAGES_BUCKET",
    defaultBucket: "profile-images"
  });
}

export function uploadServiceImage(userId, payload) {
  return uploadImage({
    payload,
    folder: `services/${userId}`,
    bucketEnv: "SUPABASE_SERVICE_IMAGES_BUCKET",
    defaultBucket: "service-images"
  });
}
