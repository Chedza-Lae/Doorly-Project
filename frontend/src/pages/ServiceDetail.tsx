import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Star, MapPin, Heart, Phone, Mail, Clock, ShieldCheck, MessageSquare, CalendarCheck } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { ApiService, Review } from "../lib/api";
import { euro } from "../lib/money";
import { useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite, getFavorites, getUser } from "../lib/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1600&q=80";

export default function ServiceDetail() {
  const navigate = useNavigate();
  const user = getUser();
  const userId = user?.id;
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [service, setService] = useState<ApiService | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [data, reviewData] = await Promise.all([
          api.getService(Number(id)),
          api.serviceReviews(Number(id)),
        ]);
        setService(data);
        setReviews(reviewData);

        if (userId) {
          const favs = await getFavorites();

          // Compara com a lista real da BD para iniciar o coração no estado certo.
          const exists = favs.some((favorite) => favorite.id_servico === Number(id));

          setIsFavorite(exists);
        } else {
          setIsFavorite(false);
        }
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Erro ao carregar serviço");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, userId]);

    async function toggleFavorite() {
      if (!user) {
        navigate("/login");
        return;
      }

      if (!service || favoriteLoading) return;

      const serviceId = service.id_servico;

      if (!serviceId) return;

      const nextFavorite = !isFavorite;
      setIsFavorite(nextFavorite);
      setFavoriteLoading(true);

      try {
        // Grava a alteração na BD e reverte a UI se a API falhar.
        if (nextFavorite) {
          await addFavorite(serviceId);
        } else {
          await removeFavorite(serviceId);
        }
      } catch (e: unknown) {
        setIsFavorite(!nextFavorite);
        setErr(e instanceof Error ? e.message : "Erro ao atualizar favorito");
      } finally {
        setFavoriteLoading(false);
      }
    }

  // protótipo: avaliação/comentários “fixos” mas com aspeto real
  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!service) return;

    setReviewSaving(true);
    setErr(null);
    setReviewNotice(null);

    try {
      const summary = await api.createReview({
        id_servico: service.id_servico,
        nota: reviewScore,
        comentario: reviewComment,
      });

      const reviewData = await api.serviceReviews(service.id_servico);
      setReviews(reviewData);
      setService((current) =>
        current
          ? {
              ...current,
              rating: summary.rating,
              total_avaliacoes: summary.total_avaliacoes,
            }
          : current
      );
      setReviewComment("");
      setReviewScore(5);
      setReviewNotice("Avaliação guardada. Obrigado pelo feedback.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao guardar avaliação");
    } finally {
      setReviewSaving(false);
    }
  }

  const rating = Number(service?.rating || 0);
  const reviewsCount = Number(service?.total_avaliacoes || reviews.length || 0);

  // protótipo: “inclui” baseado na categoria (fica com cara de app real sem inventar texto gigante)
  const includes = useMemo(() => {
    const cat = (service?.categoria || "").toLowerCase();
    if (cat.includes("limp")) return ["Produtos incluídos", "Opções eco-friendly", "Agendamento flexível", "Limpeza completa"];
    if (cat.includes("canal")) return ["Diagnóstico rápido", "Reparação de fugas", "Substituição de peças", "Urgências"];
    if (cat.includes("eletric")) return ["Instalação e manutenção", "Quadros elétricos", "Segurança e testes", "Intervenção rápida"];
    if (cat.includes("jardin")) return ["Manutenção regular", "Corte e poda", "Limpeza de espaço", "Planeamento"];
    if (cat.includes("pint")) return ["Interior/Exterior", "Materiais recomendados", "Acabamentos", "Contraproposta rápida"];
    return ["Contraproposta rápida", "Atendimento profissional", "Agendamento flexível", "Serviço personalizado"];
  }, [service?.categoria]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl p-8 text-gray-600">A carregar serviço…</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl p-8 text-red-600">
            {err}
            <div className="mt-4">
              <Link to="/services" className="text-[#1E3A8A] hover:underline font-medium">
                Voltar à lista
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const image = service.imagem_url || FALLBACK_IMAGE;
  const location = service.localizacao || "Portugal";
  const providerName = service.prestador || "Prestador";
  const price = euro(service.preco);
  const contactHref = service.prestador_email
    ? `mailto:${service.prestador_email}?subject=${encodeURIComponent(`Contacto sobre ${service.titulo}`)}`
    : null;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Imagem principal */}
        <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-sm">
          <img
            src={image}
            alt={service.titulo}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />

          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-60"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }`}
            />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-sm text-[#0B1B46]">
              <ShieldCheck className="w-4 h-4" />
              Dados reais do serviço e avaliações de clientes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl text-gray-900 mb-3">{service.titulo}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{rating.toFixed(1)}</span>
                  <span>({reviewsCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{location}</span>
                </div>
                <div className="text-sm bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full">
                  {service.categoria}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl text-gray-900 mb-3">Descrição</h2>
              <p className="text-gray-700 leading-relaxed">
                {service.descricao}
              </p>
            </div>

            {/* Includes */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl text-gray-900 mb-4">O que está incluído</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {includes.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl text-gray-900">Avaliações</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Comentarios de clientes que usaram ou contactaram este serviço.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-sm text-gray-800">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {rating.toFixed(1)} média
                </div>
              </div>

              {reviewNotice && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {reviewNotice}
                </div>
              )}

              {user?.tipo === "cliente" ? (
                <form onSubmit={handleReviewSubmit} className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">A tua nota</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setReviewScore(score)}
                          className="rounded p-1 text-yellow-500 hover:bg-white"
                          aria-label={`${score} estrelas`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              score <= reviewScore ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    className="min-h-24 w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]"
                    placeholder="Conta como correu o serviço, o que correu bem e o que podia ser melhor."
                    required
                  />

                  <button
                    type="submit"
                    disabled={reviewSaving}
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1B46] px-4 py-2 text-sm text-white hover:bg-[#1E3A8A] disabled:opacity-60"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {reviewSaving ? "A guardar..." : "Publicar avaliação"}
                  </button>
                </form>
              ) : (
                <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  {user ? "Apenas clientes podem avaliar serviços." : "Entra como cliente para avaliar e comentar."}
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-5 text-gray-600">
                  Ainda não há avaliações para este serviço.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <article key={review.id_avaliacao} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{review.cliente}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.data).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {Number(review.nota).toFixed(1)}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-700">{review.comentario}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Prestador */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl text-gray-900 mb-4">Prestador</h2>

              {/* para protótipo, link opcional */}
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-[#1E3A8A]">
                  {providerName.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-gray-900">{providerName}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Categoria: {service.categoria} • Zona: {location}
                  </p>
                </div>

                <Link
                  to="/services"
                  className="inline-flex justify-center rounded-xl bg-[#0B1B46] px-4 py-2 text-sm text-white transition-colors hover:bg-[#1E3A8A] sm:shrink-0"
                >
                  Ver mais serviços
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Preço</p>
                <p className="text-3xl text-[#1E3A8A]">{price}</p>
                <p className="text-sm text-gray-500 mt-1">por hora</p>
              </div>

              <div className="space-y-3 py-6 border-y border-gray-200">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Disponibilidade</p>
                    <p className="text-sm text-gray-900">A combinar com o prestador</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {user?.tipo !== "prestador" && user?.tipo !== "admin" && (
                  <button
                    onClick={() => navigate(`/booking/new?service_id=${service.id_servico}`)}
                    className="w-full flex items-center justify-center gap-2 bg-[#0B1B46] text-white py-3 rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-sm"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    Agendar serviço
                  </button>
                )}

                <button
                  onClick={() => navigate(`/quote/new?service_id=${service.id_servico}`)}
                  className="w-full border border-[#0B1B46] text-[#0B1B46] py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Pedir contraproposta
                </button>
                
                <button
                  onClick={() => navigate(`/messages/new?service_id=${service.id_servico}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Enviar mensagem
                </button>

                <button
                  onClick={() => {
                    if (contactHref) {
                      window.location.href = contactHref;
                    } else {
                      navigate(`/messages/new?service_id=${service.id_servico}`);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Contactar
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Serviço publicado na plataforma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span>Avaliações guardadas na base de dados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
