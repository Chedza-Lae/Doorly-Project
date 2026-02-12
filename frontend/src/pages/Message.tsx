import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

export default function NewMessage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const serviceId = useMemo(() => Number(params.get("service_id")), [params]);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
      await api.sendMessage(serviceId, content);
      navigate("/messages/inbox");
    } catch (e: any) {
      setErr(e.message || "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Nova mensagem</h1>

      <div className="bg-white rounded-xl shadow p-4 border">
        <label className="block text-sm font-medium mb-2">Mensagem</label>
        <textarea
          className="w-full min-h-35 border rounded-lg p-3 outline-none focus:ring"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Olá! Tenho interesse no teu serviço..."
        />

        {err && <p className="text-red-600 mt-2">{err}</p>}

        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Voltar
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={send}
            disabled={loading}
          >
            {loading ? "A enviar..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
