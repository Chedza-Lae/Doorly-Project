import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import type { ThreadMsg } from "../lib/api";

export default function Thread() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const serviceId = useMemo(() => Number(params.get("service_id")), [params]);
  const otherId = useMemo(() => Number(params.get("other_id")), [params]);

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
    } catch (e: any) {
      setErr(e?.message || "Erro ao carregar conversa");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!serviceId || Number.isNaN(serviceId) || !otherId || Number.isNaN(otherId)) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, otherId]);

  async function reply() {
    setErr(null);
    if (!content.trim()) return;

    try {
      setSending(true);
      await api.reply(serviceId, otherId, content);
      setContent("");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Erro ao responder");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">Conversa</h1>
        <button
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          onClick={() => navigate("/messages/inbox")}
        >
          Voltar
        </button>
      </div>

      {err && <p className="text-red-600 mb-3">{err}</p>}

      <div className="bg-white rounded-xl shadow border p-4 min-h-80">
        {loading ? (
          <p className="text-gray-600">A carregar conversa…</p>
        ) : msgs.length === 0 ? (
          <p className="text-gray-600">Sem mensagens ainda.</p>
        ) : (
          <div className="space-y-3">
            {msgs.map((m) => (
              <div key={m.id} className="border rounded-lg p-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{m.nome_remetente}</span>
                  <span>{new Date(m.data_envio).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">{m.conteudo}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 bg-white rounded-xl shadow border p-3">
        <textarea
          className="w-full min-h-22.5 border rounded-lg p-3 outline-none focus:ring"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreve a tua resposta..."
        />

        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={reply}
            disabled={sending}
          >
            {sending ? "A enviar..." : "Responder"}
          </button>
        </div>
      </div>
    </div>
  );
}
