import { useState } from "react";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await api.forgotPassword(email);

    alert("Se o email existir, enviámos instruções.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl mb-6">
          Recuperar password
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full mt-4 bg-[#0B1B46] text-white py-3 rounded-xl">
          Enviar
        </button>
      </form>
    </div>
  );
}