import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { InboxItem } from "../lib/api";

export default function Inbox() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const data = await api.inbox();
        setItems(data);
      } catch (e: any) {
        setErr(e?.message || "Erro ao carregar inbox");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">Inbox</h1>

        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate("/services")}
        >
          Ver serviços
        </button>
      </div>

      {err && <p className="text-red-600 mb-3">{err}</p>}

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        {loading ? (
          <div className="p-4 text-gray-600">A carregar mensagens…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-gray-600">Ainda não recebeste mensagens.</div>
        ) : (
          <ul>
            {items.map((m) => (
              <li
                key={m.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  navigate(`/messages/thread?service_id=${m.id_servico}&other_id=${m.id_remetente}`)
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{m.titulo_servico}</p>
                    <p className="text-sm text-gray-600">De: {m.nome_remetente}</p>
                  </div>

                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(m.data_envio).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 mt-2 line-clamp-2">{m.conteudo}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
