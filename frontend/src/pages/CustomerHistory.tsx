import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api, getUser, type Booking, type BookingStatus } from "../lib/api";
import { AlertCircle, CalendarDays, Clock, FileText, Loader2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../lib/date";

const statusStyles: Record<BookingStatus, string> = {
  pendente: "bg-yellow-50 text-yellow-800 border-yellow-200",
  aceite: "bg-blue-50 text-[#1E3A8A] border-blue-200",
  rejeitado: "bg-red-50 text-red-700 border-red-200",
  concluido: "bg-green-50 text-green-700 border-green-200",
  cancelado: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function CustomerHistory() {
  const navigate = useNavigate();
  const user = useMemo(() => getUser(), []);
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.tipo !== "cliente") {
      setLoading(false);
      return;
    }

    void loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      setErr(null);
      setHistory(await api.getCustomerHistory());
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  }

  if (user && user.tipo !== "cliente") {
    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-700">
            O histórico está disponível apenas para contas de cliente.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#1E3A8A]">Histórico</p>
          <h1 className="text-3xl font-bold text-[#0B1B46] md:text-4xl">Histórico de serviços</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Consulta os teus pedidos, agendamentos e estados numa vista simples.
          </p>
        </div>

        {err && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600">
            <Loader2 className="mr-2 inline-block h-5 w-5 animate-spin" />
            A carregar histórico...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-600">
            Ainda não tens serviços no histórico. Quando fizeres pedidos ou agendamentos, vão aparecer aqui.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <HistoryRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function HistoryRow({ item }: { item: Booking }) {
  const serviceName = item.nome_servico || item.titulo_servico || "Serviço";
  const date = formatDate(item.data_agendada);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{serviceName}</h2>
            <Badge estado={item.estado} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-[#1E3A8A]" />
              {item.nome_prestador || "Prestador"}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#1E3A8A]" />
              {date}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#1E3A8A]" />
              {item.hora_inicio}
              {item.hora_fim ? ` - ${item.hora_fim}` : ""}
            </span>
          </div>

          <p className="mt-4 flex items-start gap-2 text-sm text-gray-700">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <span>{item.descricao || "Sem descrição adicional."}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

function Badge({ estado }: { estado: BookingStatus }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[estado]}`}>
      {estado}
    </span>
  );
}
