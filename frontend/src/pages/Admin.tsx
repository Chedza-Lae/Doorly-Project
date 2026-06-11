import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";
import { api, type AdminServiceRow, type AdminUserRow,} from "../lib/api";
import {
  UserCircle2,
  BriefcaseBusiness,
  Trash2,
  ShieldCheck,
  KeyRound,
  X,
  UsersRound,
} from "lucide-react";

type SelectedUser = {
  id: number;
  nome: string;
  tipo: string;
};

type ProviderGroup = {
  id: number;
  nome: string;
  email?: string;
  services: AdminServiceRow[];
};

export default function Admin() {
  const [services, setServices] = useState<AdminServiceRow[]>([]);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      setLoading(true);
      setErr(null);
      setNotice(null);

      const [usersData, servicesData] = await Promise.all([
        api.adminUsers(),
        api.adminServices(),
      ]);

      setUsers(usersData);
      setServices(servicesData);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar dados");
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
      await loadAdminData();
      setNotice("Serviço eliminado com sucesso.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao eliminar serviço");
    }
  }

  async function deleteUser(user: AdminUserRow) {
    const confirmDelete = confirm(
      `Tens a certeza que queres eliminar ${user.nome}?`
    );

    if (!confirmDelete) return;

    try {
      await api.adminDeleteUser(user.id);
      await loadAdminData();
      setNotice("Utilizador eliminado com sucesso.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao eliminar utilizador");
    }
  }

  async function resetPassword() {
    if (!selectedUser) return;

    if (newPassword.length < 8) {
      setErr("A password deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("As passwords não coincidem.");
      return;
    }

    try {
      await api.adminResetPassword(selectedUser.id, newPassword);

      setNotice("Password alterada com sucesso.");
      setErr(null);
      setIsResetOpen(false);
      setSelectedUser(null);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao alterar password");
    }
  }

  async function banUser(id: number) {
    const reason = prompt("Motivo do ban?");
    try {
      await api.adminBanUser(id, reason || "Violação dos termos");
      await loadAdminData();
      setNotice("Utilizador banido com sucesso.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao banir utilizador");
    }
  }

  async function unbanUser(id: number) {
    try {
      await api.adminUnbanUser(id);
      await loadAdminData();
      setNotice("Utilizador reativado com sucesso.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao reativar utilizador");
    }
  }

  function openResetModal(user: SelectedUser) {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setIsResetOpen(true);
  }

  const clients = useMemo(
    () => users.filter((user) => user.tipo === "cliente"),
    [users]
  );

  const providers = useMemo(
    () => users.filter((user) => user.tipo === "prestador"),
    [users]
  );

  const allUsers = useMemo(
    () =>
      [...users].sort((a, b) => {
        const typeOrder = { admin: 0, prestador: 1, cliente: 2 };
        const aOrder = typeOrder[a.tipo as keyof typeof typeOrder] ?? 3;
        const bOrder = typeOrder[b.tipo as keyof typeof typeOrder] ?? 3;

        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.nome.localeCompare(b.nome);
      }),
    [users]
  );

  const providerGroups = useMemo(() => {
    const grouped = new Map<number, ProviderGroup>();

    providers.forEach((provider) => {
      grouped.set(provider.id, {
        id: provider.id,
        nome: provider.nome,
        email: provider.email,
        services: [],
      });
    });

    services.forEach((service) => {
      const group = grouped.get(service.id_prestador) ?? {
        id: service.id_prestador,
        nome: service.nome_prestador,
        services: [],
      };

      group.services.push(service);
      grouped.set(service.id_prestador, group);
    });

    return Array.from(grouped.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }, [providers, services]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Gestão organizada de clientes, prestadores e serviços publicados na
            plataforma.
          </p>
        </div>

        {err && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
            {err}
          </div>
        )}

        {notice && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-gray-500">
            A carregar dados administrativos...
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard label="Utilizadores" value={users.length} />
              <SummaryCard label="Clientes" value={clients.length} />
              <SummaryCard label="Prestadores" value={providerGroups.length} />
              <SummaryCard label="Serviços" value={services.length} />
            </div>

            <section className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <UsersRound className="w-8 h-8 text-[#1E3A8A]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-[#0B1B46]">
                      Utilizadores registados
                    </h2>

                    <p className="text-sm text-gray-500">
                      Clientes, prestadores e administradores numa só lista
                    </p>
                  </div>
                </div>
              </div>

              {allUsers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-gray-500">
                  Não existem utilizadores registados.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {allUsers.map((client) => (
                    <UserRow
                      key={client.id}
                      user={client}
                      onReset={() =>
                        openResetModal({
                          id: client.id,
                          nome: client.nome,
                          tipo: client.tipo,
                        })
                      }
                      onDelete={() => deleteUser(client)}
                      onBan={() => banUser(client.id)}
                      onUnban={() => unbanUser(client.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-[#0B1B46]">
                  Prestadores e serviços
                </h2>
                <p className="text-gray-500 mt-1">
                  Consulta prestadores, altera passwords e gere os serviços
                  publicados.
                </p>
              </div>

              {providerGroups.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm p-8 text-gray-500">
                  Não existem prestadores registados.
                </div>
              ) : (
                providerGroups.map((provider) => (
                  <div
                    key={provider.id}
                    className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                          <UserCircle2 className="w-8 h-8 text-[#1E3A8A]" />
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#0B1B46]">
                            {provider.nome}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {provider.services.length} serviço(s) associado(s)
                          </p>

                          {provider.email && (
                            <p className="text-sm text-gray-500">
                              {provider.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openResetModal({
                            id: provider.id,
                            nome: provider.nome,
                            tipo: "prestador",
                          })
                        }
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-[#1E3A8A] hover:bg-blue-50 transition"
                      >
                        <KeyRound className="w-5 h-5" />
                        Reset password
                      </button>
                    </div>

                    {provider.services.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-gray-500">
                        Este prestador ainda não tem serviços publicados.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {provider.services.map((service) => (
                          <div
                            key={service.id}
                            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-linear-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-100 hover:shadow-sm transition"
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
                              type="button"
                              onClick={() => deleteService(service.id)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#0B1B46] transition"
                            >
                              <Trash2 className="w-5 h-5" />
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </section>
          </div>
        )}
      </main>

      {isResetOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-xl">
            <button
              type="button"
              onClick={() => setIsResetOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <KeyRound className="w-7 h-7 text-[#1E3A8A]" />
              </div>

              <h2 className="text-2xl font-semibold text-[#0B1B46]">
                Reset Password
              </h2>

              <p className="text-gray-500 mt-2">
                Define uma nova password para {selectedUser.nome}.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Nova password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Confirmar password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={resetPassword}
              className="w-full mt-6 bg-[#0B1B46] text-white py-3 rounded-xl hover:bg-[#1E3A8A] transition"
            >
              Guardar nova password
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold text-[#0B1B46] mt-2">{value}</p>
    </div>
  );
}

function UserRow({
  user,
  onReset,
  onDelete,
  onBan,
  onUnban,
}: {
  user: AdminUserRow;
  onReset: () => void;
  onDelete: () => void;
  onBan: () => void;
  onUnban: () => void;
}) {
  const isBanned = user.status === "banido";
  const typeLabel =
    user.tipo === "prestador" ? "Prestador" : user.tipo === "admin" ? "Admin" : "Cliente";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-[#0B1B46]">{user.nome}</p>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#1E3A8A]">
            {typeLabel}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              isBanned ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"
            }`}
          >
            {isBanned ? "Suspenso" : "Ativo"}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1E3A8A] transition hover:bg-blue-50"
        >
          Password
        </button>

        {!isBanned ? (
          <button
            type="button"
            onClick={onBan}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            Suspender
          </button>
        ) : (
          <button
            type="button"
            onClick={onUnban}
            className="rounded-xl bg-[#1E3A8A] px-3 py-2 text-sm text-white transition hover:bg-[#3B82F6]"
          >
            Reativar
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl bg-[#0B1B46] px-3 py-2 text-sm text-white transition hover:bg-[#1E3A8A]"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
