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

export type Review = {
  id_avaliacao: number;
  id_servico: number;
  id_cliente: number;
  nota: number;
  comentario: string;
  data: string;
  cliente: string;
  titulo_servico?: string;
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
  other_id: number;
  conteudo: string;
  data_envio: string;
  titulo_servico: string;
  nome_remetente: string;
  nome_interlocutor: string;
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
  id_utilizador?: number;
  nome: string;
  email: string;
  tipo: "cliente" | "prestador" | "admin" | string;
};

type AdminUserApiRow = Omit<AdminUserRow, "id"> & {
  id?: number;
  id_utilizador?: number;
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

export type QuoteRequestPayload = {
  id_servico: number;
  detalhes: string;
  localizacao?: string;
  data_preferida?: string;
  periodo?: string;
  urgencia?: string;
  orcamento_estimado?: string | number | null;
  contacto?: string;
};

export type ProviderQuote = {
  id_orcamento: number;
  id_servico: number;
  id_cliente: number;
  id_prestador: number;
  detalhes: string;
  localizacao?: string | null;
  data_preferida?: string | null;
  periodo?: string | null;
  urgencia?: string | null;
  orcamento_estimado?: string | number | null;
  contacto?: string | null;
  estado: "novo" | "em_analise" | "respondido" | "fechado" | string;
  id_mensagem?: number | null;
  data_pedido: string;
  titulo_servico: string;
  nome_cliente: string;
  email_cliente: string;
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

  resetPassword: (token: string, password: string) =>
  request(`/api/auth/reset-password/${token}`, {
    method: "PUT",
    body: JSON.stringify({ password })
  }),

  me: () => request<StoredUser>("/api/users/me"),

  updateMe: (payload: { nome: string; email: string; currentPassword?: string; newPassword?: string }) =>
    request<StoredUser>("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(payload),
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

  serviceReviews: (id: number) => request<Review[]>(`/api/avaliacoes/service/${id}`),

  providerReviews: () => request<Review[]>("/api/avaliacoes/provider"),

  createReview: (payload: { id_servico: number; nota: number; comentario: string }) =>
    request<{ message: string; rating: number; total_avaliacoes: number }>("/api/avaliacoes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

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
    request<{ message: string; other_id: number }>("/api/messages", {
      method: "POST",
      body: JSON.stringify({ id_servico: service_id, conteudo: content }),
    }),

  inbox: () => request<InboxItem[]>("/api/messages/inbox"),

  thread: (service_id: number, other_id: number) =>
    request<ThreadMsg[]>(`/api/messages/thread?service_id=${service_id}&other_id=${other_id}`),

  reply: (service_id: number, other_id: number, content: string) =>
    request<{ message: string }>("/api/messages/reply", {
      method: "POST",
      body: JSON.stringify({ service_id, other_id, content }),
    }),

  createQuote: (payload: QuoteRequestPayload) =>
    request<{ message: string; id_orcamento: number; other_id: number }>("/api/orcamentos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  providerQuotes: () => request<ProviderQuote[]>("/api/orcamentos/provider"),

  updateQuoteStatus: (id: number, estado: ProviderQuote["estado"]) =>
    request<{ message: string }>(`/api/orcamentos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    }),

  // admin
  adminUsers: async () => {
    const rows = await request<AdminUserApiRow[]>("/api/admin/users");

    return rows.map((row) => {
      const id = row.id ?? row.id_utilizador;

      if (id == null) {
        throw new Error("Utilizador sem ID vindo do backend");
      }

      return { ...row, id };
    });
  },

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
