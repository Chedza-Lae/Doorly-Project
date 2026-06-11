import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import { api, getUser } from "../lib/api";
import type { ApiService } from "../lib/api";

export default function NewMessage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const serviceId = useMemo(() => Number(params.get("service_id")), [params]);
  const user = useMemo(() => getUser(), []);

  const [service, setService] = useState<ApiService | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!serviceId || Number.isNaN(serviceId)) {
      setErr("Serviço inválido.");
      setPageLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await api.getService(serviceId);
        setService(data);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Erro ao carregar serviço");
      } finally {
        setPageLoading(false);
      }
    })();
  }, [navigate, serviceId, user]);

  async function send() {
    setErr(null);

    if (!serviceId || Number.isNaN(serviceId)) {
      setErr("Serviço inválido.");
      return;
    }

    if (!content.trim()) {
      setErr("Escreve uma mensagem.");
      return;
    }

    try {
      setLoading(true);
      const result = await api.sendMessage(serviceId, content);
      navigate(`/messages/thread?service_id=${serviceId}&other_id=${result.other_id}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1E3A8A] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mensagem para o prestador</p>
              <h1 className="text-2xl text-[#0B1B46]">
                {pageLoading ? "A carregar..." : service?.titulo || "Nova mensagem"}
              </h1>
              {service && (
                <p className="text-sm text-gray-600 mt-1">
                  {service.prestador || "Prestador"} · {service.categoria}
                </p>
              )}
            </div>
          </div>

          <label className="block text-sm text-gray-700 mb-2">Mensagem</label>
          <textarea
            className="w-full min-h-40 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ola! Tenho interesse no teu serviço..."
          />

          {err && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {err}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B1B46] text-white hover:bg-[#1E3A8A] transition-colors disabled:opacity-60"
              onClick={send}
              disabled={loading || pageLoading}
            >
              <Send className="w-4 h-4" />
              {loading ? "A enviar..." : "Enviar mensagem"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
