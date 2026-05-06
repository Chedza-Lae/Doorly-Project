import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.forgotPassword(email);
      setMessage("Se o email existir, enviámos instruções.");
      setErr("");
    } catch (error: unknown) {
      setErr(error instanceof Error ? error.message : "Ocorreu um erro ao processar o pedido.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <img
            src="/doorly.png"
            alt="Doorly"
            className="h-24 mx-auto mb-4"
          />

          <h1 className="text-3xl text-[#0B1B46]">
            Recuperar password
          </h1>

          <p className="text-gray-600 mt-2">
            Introduz o teu email para recuperar acesso.
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl">
            {message}
          </div>
        )}

        {err && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              placeholder="teuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B1B46] text-white py-3 rounded-xl"
          >
            Recuperar password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#1E3A8A] hover:underline"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}