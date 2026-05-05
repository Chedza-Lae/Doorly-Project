import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  UserCircle2,
  BriefcaseBusiness,
  Trash2,
  ShieldCheck,
} from "lucide-react";

type AdminService = {
  id: number;
  titulo: string;
  nome_prestador: string;
};

export default function Admin() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setErr(null);

      const data = await api.adminServices();
      setServices(data);
    } catch (e: unknown) {
      setErr((e as Error)?.message || "Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

  async function deleteService(id: number) {
    const confirmDelete = confirm(
      "Tens a certeza que queres eliminar este serviço?"
    );

    if (!confirmDelete) return;

    try {
      await api.adminDeleteService(id);
      await loadServices();
    } catch (e: unknown) {
      setErr((e as Error)?.message || "Erro ao eliminar serviço");
    }
  }

  const grouped = services.reduce(
    (acc: Record<string, AdminService[]>, service) => {
      if (!acc[service.nome_prestador]) {
        acc[service.nome_prestador] = [];
      }

      acc[service.nome_prestador].push(service);

      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm text-[#1E3A8A] font-medium">
              Área Administrativa
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1B46]">
            Painel Administrativo
          </h1>

          <p className="text-gray-500 mt-3 text-lg max-w-2xl">
            Gestão organizada de prestadores e respetivos serviços publicados
            na plataforma.
          </p>
        </div>

        {/* Error */}
        {err && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
            {err}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-gray-500">
            A carregar serviços...
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-gray-500">
            Não existem serviços registados.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(
              ([provider, providerServices]) => (
                <div
                  key={provider}
                  className="bg-white rounded-3xl shadow-md border border-gray-100 p-8"
                >
                  {/* Prestador */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <UserCircle2 className="w-8 h-8 text-[#1E3A8A]" />
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-[#0B1B46]">
                          {provider}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {providerServices.length} serviço(s) associado(s)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Serviços */}
                  <div className="space-y-4">
                    {providerServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center bg-linear-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-100 hover:shadow-sm transition"
                      >
                        <div className="flex items-center gap-3">
                          <BriefcaseBusiness className="w-5 h-5 text-[#1E3A8A]" />

                          <div>
                            <p className="font-medium text-gray-900">
                              {service.titulo}
                            </p>

                            <p className="text-sm text-gray-500">
                              Serviço ativo na plataforma
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-3 rounded-xl border border-gray-200 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}