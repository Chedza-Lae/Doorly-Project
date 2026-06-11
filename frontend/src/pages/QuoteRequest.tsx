import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Euro, MapPin, MessageSquareText, Send } from "lucide-react";
import { api, getUser } from "../lib/api";
import type { ApiService } from "../lib/api";
import { euro } from "../lib/money";

const PERIODS = ["Manhã", "Tarde", "Noite", "Flexível"];
const URGENCY = ["Normal", "Esta semana", "Urgente"];

export default function QuoteRequest() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = useMemo(() => Number(params.get("service_id")), [params]);
  const user = useMemo(() => getUser(), []);

  const [service, setService] = useState<ApiService | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("Flexível");
  const [budget, setBudget] = useState("");
  const [contact, setContact] = useState("");
  const [urgency, setUrgency] = useState("Normal");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!serviceId || Number.isNaN(serviceId)) {
      setErr("Serviço inválido.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await api.getService(serviceId);
        setService(data);
        setLocation(data.localizacao || "");
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Erro ao carregar serviço");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, serviceId, user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!details.trim()) {
      setErr("Descreve o que precisas para o prestador conseguir responder.");
      return;
    }

    if (!service) {
      setErr("Serviço indisponível.");
      return;
    }

    try {
      setSending(true);
      const result = await api.createQuote({
        id_servico: service.id_servico,
        detalhes: details,
        localizacao: location,
        data_preferida: date,
        periodo: period,
        urgencia: urgency,
        orcamento_estimado: budget || null,
        contacto: contact,
      });
      navigate(`/messages/thread?service_id=${service.id_servico}&other_id=${result.other_id}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao enviar contraproposta");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1E3A8A] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contraproposta</p>
                <h1 className="text-3xl text-[#0B1B46]">
                  {loading ? "A carregar..." : service?.titulo || "Nova contraproposta"}
                </h1>
                {service && (
                  <p className="text-sm text-gray-600 mt-1">
                    {service.prestador || "Prestador"} · {service.categoria}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  O que precisas?
                </label>
                <textarea
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ex.: preciso de pintar uma sala de 20m2, com pequenas reparações na parede..."
                  className="w-full min-h-40 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm text-gray-700 mb-2">Localização</span>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      placeholder="Cidade ou zona"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="block text-sm text-gray-700 mb-2">Data preferida</span>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="block text-sm text-gray-700 mb-2">Período</span>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-white"
                  >
                    {PERIODS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block text-sm text-gray-700 mb-2">Contraproposta aproximada</span>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      placeholder="Opcional"
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm text-gray-700 mb-2">Contacto preferido</span>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    placeholder={user?.email || "Email ou telefone"}
                  />
                </label>

                <label className="block">
                  <span className="block text-sm text-gray-700 mb-2">Urgência</span>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-white"
                  >
                    {URGENCY.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {err && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={sending || loading}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#0B1B46] text-white rounded-xl hover:bg-[#1E3A8A] transition-colors disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {sending ? "A enviar..." : "Enviar contraproposta"}
              </button>
            </form>
          </section>

          <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
            <p className="text-sm text-gray-500 mb-1">Resumo</p>
            <h2 className="text-xl text-[#0B1B46] mb-4">
              {service?.titulo || "Serviço"}
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between gap-4">
                <span>Prestador</span>
                <span className="text-gray-900 text-right">{service?.prestador || "A carregar"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Categoria</span>
                <span className="text-gray-900 text-right">{service?.categoria || "-"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Preço base</span>
                <span className="text-gray-900 text-right">{service ? euro(service.preco) : "-"}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
              A contraproposta fica guardada no dashboard do prestador e também nas mensagens.
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
