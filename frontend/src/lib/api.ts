const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

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
  imagem_url?: string | null;
};

function getToken() {
  return localStorage.getItem("doorly_token");
}

export function setToken(token: string) {
  localStorage.setItem("doorly_token", token);
}

export function clearToken() {
  localStorage.removeItem("doorly_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Erro ${res.status}`);
  }
  return data as T;
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

  // services
  listServices: (q?: string) => {
    const qs = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    return request<ApiService[]>(`/api/servicos${qs}`);
  },

  // se NÃO tiveres este endpoint no backend, eu já te digo como fazer já abaixo
  getService: (id: number) => request<ApiService>(`/api/servicos/${id}`),
};
