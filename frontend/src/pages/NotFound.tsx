import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1E3A8A]">
          <SearchX className="h-8 w-8" />
        </div>
        <p className="mb-2 text-sm font-semibold text-[#1E3A8A]">Erro 404</p>
        <h1 className="text-3xl font-bold text-[#0B1B46] sm:text-4xl">Página não encontrada</h1>
        <p className="mt-4 max-w-xl text-gray-600">
          A rota que tentaste abrir não existe ou deixou de estar disponível.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-5 py-3 text-white transition-colors hover:bg-[#1E3A8A]"
        >
          <Home className="h-4 w-4" />
          Voltar à página inicial
        </Link>
      </main>
      <Footer />
    </div>
  );
}
