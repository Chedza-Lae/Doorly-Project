import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import { SlidersHorizontal, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { ApiService } from "../lib/api";
import { euro } from "../lib/money";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1200&q=80";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await api.listServices();
        setServices(data);
      } catch (e: any) {
        setErr(e?.message || "Erro ao carregar serviços");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // categorias e localizações dinâmicas com base na BD (fica “vivo”)
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => s.categoria && set.add(s.categoria));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [services]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => s.localizacao && set.add(s.localizacao));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [services]);

  // filtros (protótipo: client-side)
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return services.filter((s) => {
      const matchesQ =
        !q ||
        s.titulo.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q) ||
        (s.localizacao || "").toLowerCase().includes(q) ||
        (s.prestador || "").toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" || s.categoria === selectedCategory;

      const matchesLocation =
        selectedLocation === "all" || (s.localizacao || "Portugal") === selectedLocation;

      const price = Number(s.preco);
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "0-25" && price <= 25) ||
        (priceRange === "25-50" && price > 25 && price <= 50) ||
        (priceRange === "50-100" && price > 50 && price <= 100) ||
        (priceRange === "100+" && price > 100);

      // rating é protótipo (fixo). mas o filtro funciona na UI (para “demo”)
      const rating = 4.8;
      const min = minRating === "all" ? 0 : Number(minRating);
      const matchesRating = rating >= min;

      return matchesQ && matchesCategory && matchesLocation && matchesPrice && matchesRating;
    });
  }, [services, searchQuery, selectedCategory, selectedLocation, priceRange, minRating]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setPriceRange("all");
    setMinRating("all");
  };

  const cards = filtered.map((s) => ({
    id: String(s.id_servico),
    image: s.imagem_url || FALLBACK_IMAGE,
    title: s.titulo,
    price: euro(s.preco),
    rating: 4.8,
    reviews: 0,
    location: s.localizacao || "Portugal",
    provider: s.prestador || "Prestador",
  }));

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Serviços</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-gray-900">Filtros</h2>
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Pesquisar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ex: limpeza, Lisboa…"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                  >
                    <option value="all">Todas</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Localização</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                  >
                    <option value="all">Todas</option>
                    {locations.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Preço (hora)</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="0-25">0€ – 25€</option>
                    <option value="25-50">25€ – 50€</option>
                    <option value="50-100">50€ – 100€</option>
                    <option value="100+">100€+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Rating mínimo</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.0">4.0+</option>
                    <option value="3.5">3.5+</option>
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-[#0B1B46] border border-[#0B1B46] rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {loading ? "A carregar…" : `${cards.length} serviços encontrados`}
              </p>
            </div>

            {err ? (
              <div className="bg-white rounded-2xl p-8 text-red-600">{err}</div>
            ) : loading ? (
              <div className="bg-white rounded-2xl p-8 text-gray-600">A carregar serviços…</div>
            ) : cards.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-gray-700">
                Nada encontrado. Tenta outro termo ou limpa os filtros.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
