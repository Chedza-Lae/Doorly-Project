import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { api } from "../lib/api";

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Token de recuperação inválido.");
      return;
    }

    if (!strongPassword.test(password)) {
      setError("A password deve ter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um símbolo.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await api.resetPassword(token, password);
      setMessage("Password alterada com sucesso.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao alterar password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm w-full max-w-md">
        <h1 className="text-3xl mb-6 text-[#0B1B46]">Nova Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Nova password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Confirmar password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1B46] text-white py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "A guardar..." : "Guardar nova password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
