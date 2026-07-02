import { LogIn, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { clearToken, clearUser } from "../lib/api";

export default function SessionExpired() {
  useEffect(() => {
    clearToken();
    clearUser();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-[#1E3A8A]">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <p className="mb-2 text-sm font-semibold text-[#1E3A8A]">419</p>
        <h1 className="text-3xl font-bold text-[#0B1B46]">Sessão expirada</h1>
        <p className="mt-3 text-gray-600">Por segurança, inicia sessão novamente.</p>

        <Link
          to="/login"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E3A8A]"
        >
          <LogIn className="h-4 w-4" />
          Iniciar sessão
        </Link>
      </section>
    </main>
  );
}
