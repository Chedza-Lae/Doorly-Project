import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { getFavorites, removeFavorite, getUser } from "../lib/api";

type Service = {
  id_servico: number;
  titulo: string;
  descricao: string;
  preco?: number;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  useEffect(() => {
    if (user) loadFavorites();
  }, []);

  async function loadFavorites() {
    if (!user || !user.id) return;

    try {
      setLoading(true);

      const data = await getFavorites(user.id);
      setFavorites(data);

    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id_servico: number) {
    if (!user || !user.id) return;

    try {
      await removeFavorite(user.id, id_servico);

      // remove direto da UI (mais rápido)
      setFavorites(prev => prev.filter(f => f.id_servico !== id_servico));

    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500 w-6 h-6" />
          <h1 className="text-2xl font-bold text-gray-800">
            Os teus favoritos
          </h1>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500">
            A carregar favoritos...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && favorites.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <Heart className="mx-auto mb-4 text-gray-300 w-12 h-12" />

            <h2 className="text-lg font-semibold text-gray-700">
              Ainda não tens favoritos
            </h2>

            <p className="text-gray-500 mt-2">
              Vai aos serviços e guarda os que gostares
            </p>
          </div>
        )}

        {/* LISTA */}
        {!loading && favorites.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {favorites.map((service) => (
              <div
                key={service.id_servico}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 p-5 flex flex-col justify-between"
              >

                {/* INFO */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {service.titulo}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                    {service.descricao}
                  </p>

                  {service.preco && (
                    <p className="mt-3 font-bold text-[#1E3A8A]">
                      €{service.preco}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center mt-6">

                  <button className="text-sm text-[#1E3A8A] hover:underline">
                    Ver serviço
                  </button>

                  <button
                    onClick={() => handleRemove(service.id_servico)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}