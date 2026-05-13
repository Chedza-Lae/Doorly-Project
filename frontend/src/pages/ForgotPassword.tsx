import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.forgotPassword(email);

      setMessage(
        "Enviámos um link de recuperação para o teu email."
      );

      setEmail("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao enviar email de recuperação."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/doorly.png"
            alt="Doorly"
            className="h-12 mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold text-[#0B1B46]">
            Recuperar Password
          </h1>

          <p className="text-gray-500 mt-2">
            Introduz o teu email para receberes um link de recuperação.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">

          {/* Success */}
          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  required
                  placeholder="teuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    outline-none
                    focus:ring-2
                    focus:ring-[#3B82F6]
                    focus:border-transparent
                    transition
                  "
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[#0B1B46]
                text-white
                py-3
                rounded-xl
                hover:bg-[#1E3A8A]
                transition
                disabled:opacity-60
              "
            >
              {loading
                ? "A enviar..."
                : "Enviar link de recuperação"}
            </button>
          </form>

          {/* Back */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                text-[#1E3A8A]
                hover:underline
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}