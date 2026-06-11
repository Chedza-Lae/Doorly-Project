import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck, CalendarDays, Clock, MapPin, Send } from "lucide-react";
import { api, getUser } from "../lib/api";
import type { ApiService } from "../lib/api";
import { euro } from "../lib/money";

function localToday() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export default function BookingRequest() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = useMemo(() => Number(params.get("service_id")), [params]);
  const user = useMemo(() => getUser(), []);
  const today = useMemo(() => localToday(), []);

  const [service, setService] = useState<ApiService | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [description, setDescription] = useState("");

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
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Erro ao carregar serviço");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, serviceId, user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErr(null);

    if (!service) {
      setErr("Serviço indisponível.");
      return;
    }

    if (!date) {
      setErr("Escolhe a data do agendamento.");
      return;
    }

    if (date < today) {
      setErr("Escolhe uma data de hoje em diante.");
      return;
    }

    if (startTime >= endTime) {
      setErr("A hora de fim deve ser posterior à hora de início.");
      return;
    }

    try {
      setSending(true);
      await api.createBooking({
        servico_id: service.id_servico,
        data_agendada: date,
        hora_inicio: startTime,
        hora_fim: endTime,
        descricao: description,
      });
      navigate("/agendamentos", {
        state: {
          notice: "Agendamento criado. O prestador pode agora aceitar ou rejeitar o pedido.",
        },
      });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao criar agendamento");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1E3A8A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Novo agendamento</p>
                <h1 className="text-3xl text-[#0B1B46]">
                  {loading ? "A carregar..." : service?.titulo || "Agendar serviço"}
                </h1>
                {service && (
                  <p className="mt-1 text-sm text-gray-600">
                    {service.prestador || "Prestador"} · {service.categoria}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm text-gray-700">Data</span>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      min={today}
                      required
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-gray-700">Início</span>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-gray-700">Fim</span>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Detalhes para o prestador</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-36 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]"
                  placeholder="Ex.: morada aproximada, tamanho do espaço, materiais necessários ou qualquer detalhe importante."
                />
              </label>

              {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}

              <button
                type="submit"
                disabled={sending || loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1B46] px-6 py-3 text-white transition-colors hover:bg-[#1E3A8A] disabled:opacity-60 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                {sending ? "A agendar..." : "Criar agendamento"}
              </button>
            </form>
          </section>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm text-gray-500">Resumo</p>
            <h2 className="mb-4 text-xl text-[#0B1B46]">{service?.titulo || "Serviço"}</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between gap-4">
                <span>Prestador</span>
                <span className="text-right text-gray-900">{service?.prestador || "A carregar"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Zona</span>
                <span className="text-right text-gray-900">{service?.localizacao || "A combinar"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Preço base</span>
                <span className="text-right text-gray-900">{service ? euro(service.preco) : "-"}</span>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6 text-sm text-gray-600">
              O pedido fica pendente até o prestador confirmar. Podes acompanhar o estado em Agendamentos.
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-sm text-[#1E3A8A]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              Confirma a morada exata com o prestador antes do serviço.
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
