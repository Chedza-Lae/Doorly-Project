import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  ImageIcon,
  Loader2,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Power,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { api, getUser, type ApiService, type ServicePayload } from "../lib/api";
import { euro } from "../lib/money";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1200&q=80";

const categoryOptions = [
  "Limpeza",
  "Canalização",
  "Eletricidade",
  "Jardinagem",
  "Pintura",
  "Mudanças",
  "Reparações",
];

type FormState = {
  titulo: string;
  descricao: string;
  categoria: string;
  preco: string;
  localizacao: string;
  imagem_url: string;
  ativo: boolean;
};

const emptyForm: FormState = {
  titulo: "",
  descricao: "",
  categoria: "",
  preco: "",
  localizacao: "",
  imagem_url: "",
  ativo: true,
};

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]";

function toForm(service: ApiService): FormState {
  return {
    titulo: service.titulo || "",
    descricao: service.descricao || "",
    categoria: service.categoria || "",
    preco: String(service.preco ?? ""),
    localizacao: service.localizacao || "",
    imagem_url: service.imagem_url || "",
    ativo: service.ativo === true || service.ativo === 1,
  };
}

function toPayload(form: FormState): ServicePayload {
  return {
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    categoria: form.categoria.trim(),
    preco: form.preco,
    localizacao: form.localizacao.trim() || null,
    imagem_url: form.imagem_url.trim() || null,
    ativo: form.ativo,
  };
}

function isActive(service: ApiService) {
  return service.ativo === true || service.ativo === 1;
}

export default function ProviderProfile() {
  const navigate = useNavigate();
  const user = getUser();

  const [services, setServices] = useState<ApiService[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.tipo !== "prestador" && user.tipo !== "admin") {
      setLoading(false);
      return;
    }

    void loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setErr(null);
      const data = await api.providerServices();
      setServices(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return services;

    return services.filter((service) => {
      return (
        service.titulo.toLowerCase().includes(term) ||
        service.categoria.toLowerCase().includes(term) ||
        (service.localizacao || "").toLowerCase().includes(term)
      );
    });
  }, [query, services]);

  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter(isActive).length;
    const views = services.reduce((sum, service) => sum + Number(service.visualizacoes || 0), 0);
    const requests = services.reduce((sum, service) => sum + Number(service.pedidos || 0), 0);
    const average =
      total === 0
        ? 0
        : services.reduce((sum, service) => sum + Number(service.preco || 0), 0) / total;

    return { total, active, inactive: total - active, views, requests, average };
  }, [services]);

  function startCreate(clearFeedback = true) {
    setEditingId(null);
    setForm(emptyForm);
    if (clearFeedback) {
      setErr(null);
      setNotice(null);
    }
  }

  function startEdit(service: ApiService) {
    setEditingId(service.id_servico);
    setForm(toForm(service));
    setErr(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErr(null);
    setNotice(null);

    try {
      const payload = toPayload(form);

      if (editingId) {
        const updated = await api.updateService(editingId, payload);
        setServices((current) =>
          current.map((service) => (service.id_servico === editingId ? { ...service, ...updated } : service))
        );
        setNotice("Serviço atualizado com sucesso.");
      } else {
        const created = await api.createService(payload);
        setServices((current) => [created, ...current]);
        setNotice("Serviço criado com sucesso.");
      }

      startCreate(false);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao guardar serviço");
    } finally {
      setSaving(false);
    }
  }

  async function toggleService(service: ApiService) {
    const nextActive = !isActive(service);
    setErr(null);
    setNotice(null);

    try {
      const updated = await api.patchService(service.id_servico, { ativo: nextActive });
      setServices((current) =>
        current.map((item) =>
          item.id_servico === service.id_servico ? { ...item, ...updated, ativo: nextActive } : item
        )
      );
      setNotice(nextActive ? "Serviço ativado." : "Serviço desativado.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao alterar estado do serviço");
    }
  }

  async function deleteService(service: ApiService) {
    const confirmed = confirm(`Eliminar "${service.titulo}" da base de dados?`);
    if (!confirmed) return;

    setErr(null);
    setNotice(null);

    try {
      await api.deleteService(service.id_servico);
      setServices((current) => current.filter((item) => item.id_servico !== service.id_servico));
      if (editingId === service.id_servico) startCreate();
      setNotice("Serviço eliminado.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao eliminar serviço");
    }
  }

  if (user && user.tipo !== "prestador" && user.tipo !== "admin") {
    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-gray-700">
            Esta área está disponível apenas para prestadores.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-[#1E3A8A] mb-2">Perfil do prestador</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0B1B46]">Dashboard</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#1E3A8A] font-semibold">
                {user?.nome?.slice(0, 1).toUpperCase() || "P"}
              </span>
              <span>{user?.nome}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span>{user?.email}</span>
            </div>
          </div>

          <button
            onClick={() => startCreate()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-5 py-3 text-white hover:bg-[#1E3A8A] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo serviço
          </button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          <Stat label="Serviços" value={stats.total} icon={<BriefcaseBusiness className="w-5 h-5" />} />
          <Stat label="Ativos" value={stats.active} icon={<CheckCircle2 className="w-5 h-5" />} />
          <Stat label="Inativos" value={stats.inactive} icon={<Power className="w-5 h-5" />} />
          <Stat label="Visualizações" value={stats.views} icon={<Eye className="w-5 h-5" />} />
          <Stat label="Preço médio" value={euro(stats.average)} icon={<Star className="w-5 h-5" />} />
        </section>

        {err && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{err}</span>
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <section className="xl:col-span-7">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Serviços publicados</h2>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Pesquisar"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                A carregar serviços...
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600">
                Sem serviços para mostrar.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredServices.map((service) => (
                  <ServiceRow
                    key={service.id_servico}
                    service={service}
                    onEdit={startEdit}
                    onToggle={toggleService}
                    onDelete={deleteService}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="xl:col-span-5 xl:sticky xl:top-24">
            <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingId ? "Editar serviço" : "Adicionar serviço"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingId ? `ID ${editingId}` : "Novo registo"}
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => startCreate()}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                    title="Cancelar edição"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <Field label="Título">
                  <input
                    value={form.titulo}
                    onChange={(event) => setForm((current) => ({ ...current, titulo: event.target.value }))}
                    className={fieldClass}
                    required
                  />
                </Field>

                <Field label="Descrição">
                  <textarea
                    value={form.descricao}
                    onChange={(event) => setForm((current) => ({ ...current, descricao: event.target.value }))}
                    className={`${fieldClass} min-h-28 resize-y`}
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Categoria">
                    <input
                      value={form.categoria}
                      onChange={(event) => setForm((current) => ({ ...current, categoria: event.target.value }))}
                      list="provider-categories"
                      className={fieldClass}
                      required
                    />
                    <datalist id="provider-categories">
                      {categoryOptions.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </Field>

                  <Field label="Preço">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.preco}
                      onChange={(event) => setForm((current) => ({ ...current, preco: event.target.value }))}
                      className={fieldClass}
                      required
                    />
                  </Field>
                </div>

                <Field label="Localização">
                  <input
                    value={form.localizacao}
                    onChange={(event) => setForm((current) => ({ ...current, localizacao: event.target.value }))}
                    className={fieldClass}
                  />
                </Field>

                <Field label="Imagem URL">
                  <input
                    type="url"
                    value={form.imagem_url}
                    onChange={(event) => setForm((current) => ({ ...current, imagem_url: event.target.value }))}
                    className={fieldClass}
                  />
                </Field>

                <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.ativo}
                    onChange={(event) => setForm((current) => ({ ...current, ativo: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-[#1E3A8A]"
                  />
                  Serviço ativo
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-5 py-3 text-white hover:bg-[#1E3A8A] transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingId ? "Guardar alterações" : "Criar serviço"}
              </button>
            </form>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-[#0B1B46]">{value}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-[#1E3A8A]">{icon}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function ServiceRow({
  service,
  onEdit,
  onToggle,
  onDelete,
}: {
  service: ApiService;
  onEdit: (service: ApiService) => void;
  onToggle: (service: ApiService) => void;
  onDelete: (service: ApiService) => void;
}) {
  const active = isActive(service);
  const rating = Number(service.rating || 0);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative h-36 md:h-28 md:w-40 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {service.imagem_url ? (
            <img src={service.imagem_url} alt={service.titulo} className="h-full w-full object-cover" />
          ) : (
            <>
              <img src={FALLBACK_IMAGE} alt="" className="h-full w-full object-cover opacity-30" />
              <ImageIcon className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
            </>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{service.titulo}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {active ? "Ativo" : "Inativo"}
                </span>
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{service.descricao}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                <span className="font-medium text-[#1E3A8A]">{euro(service.preco)}</span>
                <span>{service.categoria}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {service.localizacao || "Portugal"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {rating.toFixed(1)} ({service.total_avaliacoes || 0})
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {service.visualizacoes || 0}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {service.pedidos || 0}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onToggle(service)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                title={active ? "Desativar serviço" : "Ativar serviço"}
              >
                <Power className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onEdit(service)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                title="Editar serviço"
              >
                <Pencil className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(service)}
                className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                title="Eliminar serviço"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
