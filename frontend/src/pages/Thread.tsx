import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { api, getUser } from "../lib/api";
import type { ThreadMsg } from "../lib/api";

export default function Thread() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const serviceId = useMemo(() => Number(params.get("service_id")), [params]);
  const otherId = useMemo(() => Number(params.get("other_id")), [params]);
  const user = useMemo(() => getUser(), []);

  const [msgs, setMsgs] = useState<ThreadMsg[]>([]);
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function load() {
    setErr(null);
    try {
      setLoading(true);
      const data = await api.thread(serviceId, otherId);
      setMsgs(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar conversa");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!serviceId || Number.isNaN(serviceId) || !otherId || Number.isNaN(otherId)) {
      setErr("Conversa inválida.");
      setLoading(false);
      return;
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, otherId, user, navigate]);

  async function reply() {
    setErr(null);
    if (!content.trim()) return;

    try {
      setSending(true);
      await api.reply(serviceId, otherId, content);
      setContent("");
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao responder");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Mensagens</p>
            <h1 className="text-3xl text-[#0B1B46]">Conversa</h1>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/messages/inbox")}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {err && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {err}
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 min-h-96">
          {loading ? (
            <p className="text-gray-600">A carregar conversa...</p>
          ) : msgs.length === 0 ? (
            <p className="text-gray-600">Sem mensagens ainda.</p>
          ) : (
            <div className="space-y-4">
              {msgs.map((m) => {
                const mine = Number(m.id_remetente) === Number(user?.id);

                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        mine
                          ? "bg-[#0B1B46] text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className={`text-xs mb-1 ${mine ? "text-white/70" : "text-gray-500"}`}>
                        {mine ? "Tu" : m.nome_remetente} · {new Date(m.data_envio).toLocaleString()}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.conteudo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <textarea
            className="w-full min-h-28 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreve a tua resposta..."
          />

          <div className="flex justify-end mt-3">
            <button
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1B46] text-white hover:bg-[#1E3A8A] transition-colors disabled:opacity-60"
              onClick={reply}
              disabled={sending || !content.trim()}
            >
              <Send className="w-4 h-4" />
              {sending ? "A enviar..." : "Responder"}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
