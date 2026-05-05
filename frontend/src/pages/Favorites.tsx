import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getFavorites, getUser, removeFavorite } from "../lib/api";
import type { ApiService } from "../lib/api";
import { euro } from "../lib/money";

export default function Favorites() {
  const [favorites, setFavorites] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const user = getUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadFavorites();
  }, [userId]);

  async function loadFavorites() {
    try {
      setLoading(true);
      setErr(null);

      // O backend usa o token para devolver apenas favoritos deste utilizador.
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Erro ao carregar favoritos");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id_servico: number) {
    try {
      await removeFavorite(id_servico);

      // Atualiza a UI sem recarregar a lista inteira depois da remocao na BD.
      setFavorites((prev) => prev.filter((favorite) => favorite.id_servico !== id_servico));
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Erro ao remover favorito");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500 w-6 h-6" />
          <h1 className="text-2xl font-bold text-gray-800">Os teus favoritos</h1>
        </div>

        {!user && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <Heart className="mx-auto mb-4 text-gray-300 w-12 h-12" />
            <h2 className="text-lg font-semibold text-gray-700">Entra para ver favoritos</h2>
            <p className="text-gray-500 mt-2">A tua lista fica guardada na tua conta.</p>
            <Link
              to="/login"
              className="inline-block mt-5 px-5 py-2 rounded-xl bg-[#0B1B46] text-white hover:bg-[#1E3A8A] transition-colors"
            >
              Entrar
            </Link>
          </div>
        )}

        {user && err && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{err}</div>
        )}

        {user && loading && (
          <div className="text-center text-gray-500">A carregar favoritos...</div>
        )}

        {user && !loading && favorites.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <Heart className="mx-auto mb-4 text-gray-300 w-12 h-12" />

            <h2 className="text-lg font-semibold text-gray-700">Ainda não tens favoritos</h2>

            <p className="text-gray-500 mt-2">Vai aos serviços e guarda os que gostares</p>
          </div>
        )}

        {user && !loading && favorites.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((service) => (
              <div
                key={service.id_servico}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{service.titulo}</h3>

                  <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                    {service.descricao}
                  </p>

                  <p className="mt-3 font-bold text-[#1E3A8A]">{euro(service.preco)}</p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Link
                    to={`/service/${service.id_servico}`}
                    className="text-sm text-[#1E3A8A] hover:underline"
                  >
                    Ver serviço
                  </Link>

                  <button
                    onClick={() => handleRemove(service.id_servico)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition hover:scale-110"
                    aria-label="Remover favorito"
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
