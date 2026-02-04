import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Star, MapPin, Heart, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { ApiService } from "../lib/api";
import { euro } from "../lib/money";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1600&q=80";

export default function ServiceDetail() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const [service, setService] = useState<ApiService | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await api.getService(Number(id));
        setService(data);
      } catch (e: any) {
        setErr(e?.message || "Erro ao carregar serviço");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // protótipo: rating/reviews “fixos” mas com aspeto real
  const rating = useMemo(() => 4.8, []);
  const reviewsCount = useMemo(() => 0, []);

  // protótipo: “inclui” baseado na categoria (fica com cara de app real sem inventar texto gigante)
  const includes = useMemo(() => {
    const cat = (service?.categoria || "").toLowerCase();
    if (cat.includes("limp")) return ["Produtos incluídos", "Opções eco-friendly", "Agendamento flexível", "Limpeza completa"];
    if (cat.includes("canal")) return ["Diagnóstico rápido", "Reparação de fugas", "Substituição de peças", "Urgências"];
    if (cat.includes("eletric")) return ["Instalação e manutenção", "Quadros elétricos", "Segurança e testes", "Intervenção rápida"];
    if (cat.includes("jardin")) return ["Manutenção regular", "Corte e poda", "Limpeza de espaço", "Planeamento"];
    if (cat.includes("pint")) return ["Interior/Exterior", "Materiais recomendados", "Acabamentos", "Orçamento rápido"];
    return ["Orçamento rápido", "Atendimento profissional", "Agendamento flexível", "Serviço personalizado"];
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

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top image */}
        <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-sm">
          <img src={image} alt={service.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Favorito"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-sm text-[#0B1B46]">
              <ShieldCheck className="w-4 h-4" />
              Protótipo: dados reais do serviço • avaliações em fase seguinte
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl text-gray-900 mb-3">{service.titulo}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{rating}</span>
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
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl text-gray-900 mb-4">Prestador</h2>

              {/* para protótipo, link opcional */}
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-semibold">
                  {providerName.slice(0, 1).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900">{providerName}</h3>
                    <span className="text-xs bg-blue-50 text-[#1E3A8A] px-2 py-0.5 rounded-full">
                      Verificado (protótipo)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Categoria: {service.categoria} • Zona: {location}
                  </p>
                </div>

                <Link
                  to="/services"
                  className="px-4 py-2 bg-[#0B1B46] text-white rounded-xl hover:bg-[#1E3A8A] transition-colors text-sm"
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
                <p className="text-sm text-gray-500 mt-1">por hora (protótipo)</p>
              </div>

              <div className="space-y-3 py-6 border-y border-gray-200">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Disponibilidade</p>
                    <p className="text-sm text-gray-900">A combinar com o prestador</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#0B1B46] text-white py-3 rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-sm">
                  Pedir orçamento
                </button>

                {/* ações “reais” sem inventar */}
                <button
                  onClick={() => alert("Protótipo: aqui vai abrir chat/mensagens.")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Enviar mensagem
                </button>

                <button
                  onClick={() => alert("Protótipo: aqui vai mostrar contacto/telefone do prestador.")}
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
                    <span>Pagamentos/avaliações na próxima fase</span>
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
