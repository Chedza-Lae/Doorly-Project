const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export type LoginResponse = {
  token: string;
  user: { id?: number; id_utilizador?: number; nome: string; email: string; tipo: "cliente" | "prestador" | "admin" };
};

export type ApiService = {
  id_servico: number;
  id_prestador: number;
  titulo: string;
  descricao: string;
  categoria: string;
  preco: string | number;
  localizacao?: string | null;
  prestador?: string;
  prestador_email?: string;
  imagem_url?: string | null;
  data_publicacao?: string;
  data_adicionado?: string;
  ativo?: number | boolean;
  visualizacoes?: number;
  pedidos?: number;
  rating?: string | number;
  total_avaliacoes?: number;
};

type ServicesResponse = ApiService[] | { data?: ApiService[]; services?: ApiService[] };

export type ServicePayload = {
  titulo: string;
  descricao: string;
  categoria: string;
  preco: string | number;
  localizacao?: string | null;
  imagem_url?: string | null;
  ativo?: boolean | number;
};

export type InboxItem = {
  id: number;
  id_servico: number;
  id_remetente: number;
  id_destinatario: number;
  conteudo: string;
  data_envio: string;
  titulo_servico: string;
  nome_remetente: string;
};

export type ThreadMsg = {
  id: number;
  id_servico: number;
  id_remetente: number;
  id_destinatario: number;
  conteudo: string;
  data_envio: string;
  nome_remetente: string;
};

export type AdminUserRow = {
  id: number;
  nome: string;
  email: string;
  tipo: "cliente" | "prestador" | "admin" | string;
};

export type AdminServiceRow = {
  id: number;
  titulo: string;
  id_prestador: number;
  nome_prestador: string;
};

function getToken() {
  return localStorage.getItem("doorly_token");
}

export function setToken(token: string) {
  localStorage.setItem("doorly_token", token);
}

export function clearToken() {
  localStorage.removeItem("doorly_token");
  localStorage.removeItem("doorly_user");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.msg || data?.error || `Erro ${res.status}`);
  }
  return data as T;
}

export type StoredUser = {
  id: number; nome: string; email: string; tipo: "cliente" | "prestador" | "admin" 
};

export function setUser(user: StoredUser) {
  localStorage.setItem("doorly_user", JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  const raw = localStorage.getItem("doorly_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem("doorly_user");
}

export const api = {
  // auth
  login: (email: string, password: string) =>
    request<LoginResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (nome: string, email: string, password: string, tipo: "cliente" | "prestador") =>
    request<{ message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ nome, email, password, tipo }),
    }),

  forgotPassword: (email: string) =>
  request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  }),
  
  // services
  listServices: async (q?: string): Promise<ApiService[]> => {
    const qs = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    const res = await request<ServicesResponse>(`/api/servicos${qs}`);

    // adapta automaticamente
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.services)) return res.services;

    return [];
  },

  getService: (id: number) => request<ApiService>(`/api/servicos/${id}`),

  providerServices: () => request<ApiService[]>("/api/servicos/me"),

  createService: (payload: ServicePayload) =>
    request<ApiService>("/api/servicos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateService: (id: number, payload: ServicePayload) =>
    request<ApiService>(`/api/servicos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  patchService: (id: number, payload: Partial<ServicePayload>) =>
    request<ApiService>(`/api/servicos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteService: (id: number) =>
    request<{ message: string }>(`/api/servicos/${id}`, { method: "DELETE" }),

  // messages
  sendMessage: (service_id: number, content: string) =>
    request<{ message: string }>("/api/messages", {
      method: "POST",
      body: JSON.stringify({ service_id, content }),
    }),

  inbox: () => request<InboxItem[]>("/api/messages/inbox"),

  thread: (service_id: number, other_id: number) =>
    request<ThreadMsg[]>(`/api/messages/thread?service_id=${service_id}&other_id=${other_id}`),

  reply: (service_id: number, other_id: number, content: string) =>
    request<{ message: string }>("/api/messages/reply", {
      method: "POST",
      body: JSON.stringify({ service_id, other_id, content }),
    }),

  // admin
  adminUsers: () => request<AdminUserRow[]>("/api/admin/users"),

  adminDeleteUser: (id: number) =>
    request<{ message: string }>(`/api/admin/users/${id}`, { method: "DELETE" }),

  adminServices: () => request<AdminServiceRow[]>("/api/admin/services"),

  adminDeleteService: (id: number) =>
    request<{ message: string }>(`/api/admin/services/${id}`, { method: "DELETE" }),

  adminResetPassword: (id: number, password: string) =>
  request(`/api/admin/users/${id}/reset-password`, {
    method: "PUT",
    body: JSON.stringify({ password })
  }),
};

export async function getFavorites(): Promise<ApiService[]> {
  // Favoritos usam o token guardado para o backend descobrir o id_cliente correto.
  return request<ApiService[]>("/api/favorites");
}

export async function addFavorite(serviceId: number) {
  // Enviamos so o id_servico; o id_cliente nunca deve vir do localStorage/body.
  return request<{ success: boolean }>("/api/favorites", {
    method: "POST",
    body: JSON.stringify({
      id_servico: serviceId,
    }),
  });
}

export async function removeFavorite(serviceId: number) {
  // Mantem o payload pequeno e deixa o backend proteger a remocao pelo token.
  return request<{ success: boolean }>("/api/favorites", {
    method: "DELETE",
    body: JSON.stringify({
      id_servico: serviceId,
    }),
  });
}
