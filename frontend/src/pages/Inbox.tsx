import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { InboxItem } from "../lib/api";
import { MessageCircle, Clock3, Briefcase } from "lucide-react";

export default function Inbox() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

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

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl text-[#0B1B46] mb-8">
          As tuas mensagens
        </h1>

        {err && <p className="text-red-500">{err}</p>}

        <div className="space-y-4">
          {items.map((m) => (
            <div
              key={m.id}
              onClick={() =>
                navigate(`/messages/thread?service_id=${m.id_servico}&other_id=${m.id_remetente}`)
              }
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition"
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#1E3A8A]" />
                    <h2 className="font-semibold">{m.titulo_servico}</h2>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <MessageCircle className="w-4 h-4" />
                    {m.nome_remetente}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock3 className="w-4 h-4" />
                  {new Date(m.data_envio).toLocaleDateString()}
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