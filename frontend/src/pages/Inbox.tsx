import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser } from "../lib/api";
import type { InboxItem } from "../lib/api";
import { formatDate } from "../lib/date";
import { MessageCircle, Clock3, Briefcase } from "lucide-react";

export default function Inbox() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    (async () => {
      try {
        const data = await api.inbox();
        setItems(data);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-3xl text-[#0B1B46] mb-8">
          As tuas mensagens
        </h1>

        {err && <p className="text-red-500">{err}</p>}

        <div className="space-y-4">
          {loading && (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-gray-600">
              A carregar conversas...
            </div>
          )}

          {!loading && items.length === 0 && !err && (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-gray-600">
              Ainda não tens conversas.
            </div>
          )}

          {items.map((m) => (
            <div
              key={m.id}
              onClick={() =>
                navigate(`/messages/thread?service_id=${m.id_servico}&other_id=${m.other_id}`)
              }
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#1E3A8A]" />
                    <h2 className="truncate font-semibold">{m.titulo_servico}</h2>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <MessageCircle className="w-4 h-4" />
                    {m.nome_interlocutor}
                    {m.id_remetente === user?.id && (
                      <span className="text-xs bg-blue-50 text-[#1E3A8A] px-2 py-0.5 rounded-full">
                        enviado por ti
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-sm text-gray-400">
                  <Clock3 className="w-4 h-4" />
                  {formatDate(m.data_envio, "Data por confirmar")}
                </div>
              </div>

              <p className="mt-4 text-gray-600">{m.conteudo}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
