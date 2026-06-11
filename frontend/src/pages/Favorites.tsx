import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Heart,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getFavorites, getUser, removeFavorite } from "../lib/api";
import type { ApiService } from "../lib/api";
import { euro } from "../lib/money";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1200&q=80";

export default function Favorites() {
  const [favorites, setFavorites] = useState<ApiService[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const user = getUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadFavorites();
  }, [userId]);

  async function loadFavorites() {
    try {
      setLoading(true);
      setErr(null);

      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Erro ao carregar favoritos");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id_servico: number) {
    try {
      setRemovingId(id_servico);
      setErr(null);
      await removeFavorite(id_servico);
      setFavorites((prev) => prev.filter((favorite) => favorite.id_servico !== id_servico));
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Erro ao remover favorito");
    } finally {
      setRemovingId(null);
    }
  }

  const filteredFavorites = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return favorites;

    return favorites.filter((service) => {
      return [
        service.titulo,
        service.descricao,
        service.categoria,
        service.localizacao,
        service.prestador,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [favorites, query]);

  const categories = useMemo(() => {
    return new Set(favorites.map((favorite) => favorite.categoria).filter(Boolean)).size;
  }, [favorites]);

  const averagePrice = useMemo(() => {
    if (favorites.length === 0) return null;

    const prices = favorites
      .map((favorite) => Number(favorite.preco))
      .filter((price) => Number.isFinite(price));

    if (prices.length === 0) return null;

    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }, [favorites]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main>
        <section className="bg-[#0B1B46] text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-blue-100">
                  <Sparkles className="h-4 w-4" />
                  A tua seleção pessoal na Doorly
                </div>

                <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                  Favoritos guardados para decidires com calma.
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                  Junta os serviços que fazem sentido para ti, compara prestadores e volta quando estiveres pronta para avançar.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Guardados" value={String(favorites.length)} />
                  <Stat label="Categorias" value={String(categories)} />
                  <Stat label="Média" value={averagePrice == null ? "—" : euro(averagePrice)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {!user ? (
            <EmptyState
              title="Entra para veres os teus favoritos"
              text="A tua lista fica guardada na conta e acompanha-te em qualquer dispositivo."
              actionLabel="Entrar"
              actionTo="/login"
            />
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#0B1B46]">A tua shortlist</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {loading
                      ? "A carregar serviços guardados..."
                      : `${filteredFavorites.length} de ${favorites.length} favorito(s) visíveis`}
                  </p>
                </div>

                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Pesquisar nos favoritos"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
              </div>

              {err && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              )}

              {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
                  <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-[#1E3A8A]" />
                  A carregar favoritos...
                </div>
              ) : favorites.length === 0 ? (
                <EmptyState
                  title="Ainda não guardaste nenhum serviço"
                  text="Explora serviços e toca no coração dos que queres comparar mais tarde."
                  actionLabel="Explorar serviços"
                  actionTo="/services"
                />
              ) : filteredFavorites.length === 0 ? (
                <EmptyState
                  title="Nada encontrado nesta seleção"
                  text="Tenta procurar por categoria, zona, nome do serviço ou prestador."
                  actionLabel="Limpar pesquisa"
                  onAction={() => setQuery("")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {filteredFavorites.map((service) => (
                    <FavoriteCard
                      key={service.id_servico}
                      service={service}
                      removing={removingId === service.id_servico}
                      onRemove={() => handleRemove(service.id_servico)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <p className="text-xs text-blue-100">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function FavoriteCard({
  service,
  removing,
  onRemove,
}: {
  service: ApiService;
  removing: boolean;
  onRemove: () => void;
}) {
  const image = service.imagem_url || FALLBACK_IMAGE;
  const location = service.localizacao || "Portugal";
  const provider = service.prestador || "Prestador";

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="grid min-h-full grid-cols-1 md:grid-cols-[220px_1fr]">
        <Link to={`/service/${service.id_servico}`} className="relative h-52 overflow-hidden md:h-full">
          <img
            src={image}
            alt={service.titulo}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#1E3A8A] shadow-sm">
            <Heart className="h-3.5 w-3.5 fill-[#1E3A8A]" />
            Guardado
          </span>
        </Link>

        <div className="flex min-w-0 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                {service.categoria || "Serviço"}
              </p>
              <Link to={`/service/${service.id_servico}`}>
                <h3 className="line-clamp-2 text-xl font-semibold text-[#0B1B46] hover:text-[#1E3A8A]">
                  {service.titulo}
                </h3>
              </Link>
            </div>

            <button
              type="button"
              onClick={onRemove}
              disabled={removing}
              className="shrink-0 rounded-xl border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0B1B46] disabled:opacity-50"
              aria-label="Remover favorito"
            >
              {removing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </button>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">{service.descricao}</p>

          <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
            <span className="flex min-w-0 items-center gap-2">
              <UserRound className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="truncate">{provider}</span>
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="truncate">{location}</span>
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-gray-500">Desde</p>
              <p className="text-2xl font-semibold text-[#1E3A8A]">{euro(service.preco)}</p>
            </div>

            <Link
              to={`/service/${service.id_servico}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1B46] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1E3A8A]"
            >
              Ver serviço
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({
  title,
  text,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string;
  text: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  const content = (
    <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1B46] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1E3A8A]">
      {actionLabel}
      <ArrowRight className="h-4 w-4" />
    </span>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1E3A8A]">
        <Heart className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-semibold text-[#0B1B46]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-gray-500">{text}</p>
      <div className="mt-6">
        {actionTo ? (
          <Link to={actionTo}>{content}</Link>
        ) : (
          <button type="button" onClick={onAction}>
            {content}
          </button>
        )}
      </div>
    </div>
  );
}
