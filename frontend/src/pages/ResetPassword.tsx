import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { api } from "../lib/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("As passwords não coincidem.");
      return;
    }

    try {
      setLoading(true);

      await api.resetPassword(token!, password);

      setMessage("Password alterada com sucesso.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao alterar password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm w-full max-w-md">
        <h1 className="text-3xl mb-6 text-[#0B1B46]">
          Nova Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />

            <input
              type="password"
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
              placeholder="Confirmar password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1B46] text-white py-3 rounded-xl"
          >
            {loading ? "A guardar..." : "Guardar nova password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}