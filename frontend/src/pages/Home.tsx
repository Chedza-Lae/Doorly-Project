import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryCard from "../components/CategoryCard";
import ServiceCard from "../components/ServiceCard";
import { Search, Wrench, Home, Zap, Leaf, Paintbrush, Hammer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ApiService = {
  id_servico: number;
  id_prestador: number;
  titulo: string;
  descricao: string;
  categoria: string;
  preco: string | number;
  localizacao?: string | null;
  data_publicacao: string;
  ativo: 0 | 1;
  prestador?: string;        // vem do JOIN (u.nome AS prestador)
  imagem_url?: string | null; // se adicionares a coluna
};

const API_BASE = "http://localhost:3001";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1200&q=80";

function euro(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // busca serviços (home + pesquisa)
  async function fetchServices(q?: string) {
    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${API_BASE}/api/servicos`);
      if (q && q.trim()) url.searchParams.set("q", q.trim());

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`API erro: ${res.status}`);
      const data = (await res.json()) as ApiService[];
      setServices(data ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar serviços");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const categoryMeta = [
    { icon: Home, title: "Limpeza", key: "Limpeza" },
    { icon: Wrench, title: "Canalização", key: "Canalização" },
    { icon: Zap, title: "Eletricidade", key: "Eletricidade" },
    { icon: Leaf, title: "Jardinagem", key: "Jardinagem" },
    { icon: Paintbrush, title: "Pintura", key: "Pintura" },
    { icon: Hammer, title: "Reparações", key: "Reparações" },
  ];

  // contagens reais com base no que vem da BD
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    services.forEach((s) => {
      const k = (s.categoria || "").trim();
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return map;
  }, [services]);

  const categories = categoryMeta.map((c) => ({
    icon: c.icon,
    title: c.title,
    count: categoryCounts.get(c.key) ?? 0,
    link: `/services?category=${encodeURIComponent(c.key)}`,
  }));

  // “Destaque” do protótipo: pega nos primeiros 6
  const featured = services.slice(0, 6).map((s) => ({
    id: String(s.id_servico),
    image: s.imagem_url || FALLBACK_IMAGE,
    title: s.titulo,
    price: `${euro(s.preco)}`,
    rating: 4.8, // protótipo (depois ligas às avaliações)
    reviews: 0,  // protótipo
    location: s.localizacao || "Portugal",
    provider: s.prestador || "Prestador",
  }));

  const onSearch = async () => {
    await fetchServices(searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      {/* HERO — mais direto e com cara de produto */}
      <section className="bg-gradient-to-br from-[#0B1B46] via-[#1E3A8A] to-[#3B82F6] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-blue-100/90 bg-white/10 px-3 py-1 rounded-full text-sm">
                Prestadores verificados • Perto de ti • Contacto rápido
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-5xl max-w-xl leading-tight mt-5 font-semibold tracking-tight">
                Encontra serviços <span className="text-blue-200">sem dor de cabeça</span>.
              </h1>

              <p className="text-lg md:text-xl mt-4 text-blue-100/90">
                Pesquisa, compara e escolhe um prestador com confiança. Tudo num só sítio.
              </p>

              {/* Search Bar */}
              <div className="mt-7 bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ex: limpeza, canalização, eletricista…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    className="flex-1 py-2 outline-none text-gray-900"
                  />
                </div>
                <button
                  onClick={onSearch}
                  className="bg-[#0B1B46] text-white px-8 py-3 rounded-xl hover:bg-[#1E3A8A] transition-colors"
                >
                  Pesquisar
                </button>
              </div>

              {/* status bar */}
              <div className="mt-3 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-100/90">
                  {loading
                    ? "A carregar serviços…"
                    : error
                    ? "Servidor indisponível (backend offline ou CORS)."
                    : `${services.length} serviços disponíveis`}
                </div>
            </div>

            {/* bloco visual simples (com cara de marca) */}
            <div className="hidden md:block">
              <div className="relative bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-sm">
                <div className="text-blue-100/90 text-sm">Sugestões rápidas</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["Limpeza", "Canalização", "Eletricidade", "Pintura"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSearchQuery(t);
                        fetchServices(t);
                      }}
                      className="text-left bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 transition"
                    >
                      <div className="font-semibold">{t}</div>
                      <div className="text-xs text-blue-100/80 mt-1">
                        Ver serviços
                      </div>
                    </button>
                  ))}
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-300/30 blur-2xl rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl text-gray-900">Categorias</h2>
            <p className="text-gray-600 mt-1">Encontra rápido o que precisas.</p>
          </div>
          <a href="/services" className="text-[#1E3A8A] hover:underline font-medium">
            Ver tudo
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              count={category.count}
              link={category.link}
            />
          ))}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl text-gray-900">Serviços em destaque</h2>
            <p className="text-gray-600 mt-1">Escolhas populares (dados reais da tua BD).</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-gray-600">A carregar…</div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-red-600">
            Não foi possível carregar serviços. Confere se o backend está a correr em {API_BASE}.
          </div>
        ) : featured.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-gray-700">
            Ainda não há serviços na BD. Cria 2–3 serviços e volta aqui.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0B1B46] to-[#1E3A8A] rounded-3xl p-10 md:p-12 text-center text-white">
            <h2 className="text-3xl mb-3">És prestador de serviços?</h2>
            <p className="text-lg mb-7 text-blue-100/90">
              Publica os teus serviços e começa a receber pedidos.
            </p>
            <a
              href="/register"
              className="inline-block bg-white text-[#0B1B46] px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
            >
              Criar conta de prestador
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
