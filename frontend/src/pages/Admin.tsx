import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { AdminServiceRow, AdminUserRow } from "../lib/api";

export default function Admin() {
  const [tab, setTab] = useState<"users" | "services">("users");

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [services, setServices] = useState<AdminServiceRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    const data = await api.adminUsers();
    setUsers(data);
  }

  async function loadServices() {
    const data = await api.adminServices();
    setServices(data);
  }

  async function loadAll() {
    setErr(null);
    setLoading(true);
    try {
      await Promise.all([loadUsers(), loadServices()]);
    } catch (e: any) {
      setErr(e?.message || "Erro no admin");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function deleteUser(id: number) {
    if (!confirm("Eliminar este utilizador?")) return;
    try {
      await api.adminDeleteUser(id);
      await loadUsers();
    } catch (e: any) {
      setErr(e?.message || "Erro ao eliminar utilizador");
    }
  }

  async function deleteService(id: number) {
    if (!confirm("Eliminar este serviço?")) return;
    try {
      await api.adminDeleteService(id);
      await loadServices();
    } catch (e: any) {
      setErr(e?.message || "Erro ao eliminar serviço");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Admin</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg border ${
            tab === "users" ? "bg-black text-white" : "bg-white"
          }`}
          onClick={() => setTab("users")}
        >
          Utilizadores
        </button>

        <button
          className={`px-4 py-2 rounded-lg border ${
            tab === "services" ? "bg-black text-white" : "bg-white"
          }`}
          onClick={() => setTab("services")}
        >
          Serviços
        </button>

        <button
          className="ml-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          onClick={loadAll}
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow border p-4 text-gray-600">A carregar…</div>
      ) : tab === "users" ? (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">Email</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.nome}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.tipo}</td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      onClick={() => deleteUser(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-600" colSpan={4}>
                    Sem utilizadores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Título</th>
                <th className="p-3">Prestador</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.titulo}</td>
                  <td className="p-3">{s.nome_prestador}</td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      onClick={() => deleteService(s.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {services.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-600" colSpan={3}>
                    Sem serviços.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
