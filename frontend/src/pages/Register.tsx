import { Link, useNavigate } from "react-router-dom";
import { User, Briefcase, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";

export default function Register() {
  const [userType, setUserType] = useState<"client" | "provider" | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const validations = {
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    length: password.length >= 8,
  };

  const isPasswordValid =
    validations.upper &&
    validations.lower &&
    validations.number &&
    validations.special &&
    validations.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!userType) return setErr("Escolhe o tipo de conta.");
    if (password !== confirmPassword) return setErr("As palavras-passe não coincidem.");
    if (!isPasswordValid) {
      return setErr("A palavra-passe não cumpre os requisitos.");
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return setErr("Tens de aceitar os termos e a política.");
    }

    const tipo = userType === "client" ? "cliente" : "prestador";

    setLoading(true);
    try {
      await api.register(nome, email, password, tipo);
      navigate("/login");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/doorly.png"
              alt="Doorly"
              className="h-28 w-auto mx-auto mb-6 object-contain"
            />
          </Link>
          <h1 className="text-3xl text-gray-900 mb-2">Criar conta</h1>
          <p className="text-gray-600">Entrar na Doorly em 1 minuto</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {err && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{err}</div>}

          {!userType ? (
            <div>
              <h2 className="text-xl text-gray-900 mb-6 text-center">Queres registar-te como…</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setUserType("client")}
                  className="p-8 border-2 border-gray-200 rounded-2xl hover:border-[#3B82F6] hover:bg-blue-50 transition-all group"
                >
                  <User className="w-12 h-12 mx-auto mb-4 text-[#0B1B46] group-hover:text-[#3B82F6]" />
                  <h3 className="text-gray-900 mb-2">Cliente</h3>
                  <p className="text-sm text-gray-600">Procurar serviços</p>
                </button>

                <button
                  onClick={() => setUserType("provider")}
                  className="p-8 border-2 border-gray-200 rounded-2xl hover:border-[#3B82F6] hover:bg-blue-50 transition-all group"
                >
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-[#0B1B46] group-hover:text-[#3B82F6]" />
                  <h3 className="text-gray-900 mb-2">Prestador</h3>
                  <p className="text-sm text-gray-600">Publicar serviços</p>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-gray-900">
                  {userType === "client" ? "Conta de cliente" : "Conta de prestador"}
                </h2>
                <button onClick={() => setUserType(null)} type="button" className="text-sm text-[#1E3A8A] hover:text-[#3B82F6]">
                  Mudar
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Palavra-passe
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <p className={validations.upper ? "text-green-600" : "text-gray-400"}>
                    • Uma letra maiúscula
                  </p>

                  <p className={validations.lower ? "text-green-600" : "text-gray-400"}>
                    • Uma letra minúscula
                  </p>

                  <p className={validations.number ? "text-green-600" : "text-gray-400"}>
                    • Um número
                  </p>

                  <p className={validations.special ? "text-green-600" : "text-gray-400"}>
                    • Um carácter especial
                  </p>

                  <p className={validations.length ? "text-green-600" : "text-gray-400"}>
                    • Mínimo 8 caracteres
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Confirmar palavra-passe
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none ${
                      confirmPassword.length > 0
                        ? password === confirmPassword
                          ? "border-green-500"
                          : "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>

                {confirmPassword.length > 0 && (
                  <p
                    className={`text-sm mt-2 ${
                      password === confirmPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {password === confirmPassword
                      ? "As palavras-passe coincidem"
                      : "As palavras-passe não coincidem"}
                  </p>
                )}
              </div>

              <div className="space-y-3">

                <label className="flex items-start gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1"
                  />

                  <span>
                    Aceitar os{" "}
                    <Link
                      to="/terms"
                      className="font-semibold text-[#1E3A8A] underline-offset-2 hover:text-[#3B82F6] hover:underline"
                    >
                      Termos e Condições
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-1"
                  />

                  <span>
                    Aceitar a{" "}
                    <Link
                      to="/privacy"
                      className="font-semibold text-[#1E3A8A] underline-offset-2 hover:text-[#3B82F6] hover:underline"
                    >
                      Política de Privacidade
                    </Link>
                  </span>
                </label>

              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !isPasswordValid ||
                  !acceptedTerms ||
                  !acceptedPrivacy
                }
                className="w-full bg-[#0B1B46] text-white py-3 rounded-xl hover:bg-[#1E3A8A] transition-colors shadow-sm disabled:opacity-60"
              >
                {loading ? "A criar…" : "Criar conta"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tens conta?{" "}
              <Link to="/login" className="text-[#1E3A8A] hover:text-[#3B82F6] font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
