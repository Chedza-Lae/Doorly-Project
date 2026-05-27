import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export default function LegalLayout({
  title,
  subtitle,
  icon,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] relative overflow-hidden">
      <Navbar />

      {/* Background glow */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 blur-3xl rounded-full" />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-[#0B1B46] via-[#1E3A8A] to-[#3B82F6] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">

            <div className="bg-white/10 border border-white/20 p-4 rounded-3xl backdrop-blur-sm">
              {icon}
            </div>

            <div>
              <p className="text-blue-100 text-sm mb-1">
                Doorly • Informação
              </p>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                {title}
              </h1>

              <p className="text-blue-100 mt-3 max-w-2xl">
                {subtitle}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="bg-white/70 backdrop-blur-sm border border-white rounded-3xl p-4 shadow-sm">

              <p className="text-sm text-gray-500 mb-4">
                Navegação
              </p>

              <div className="space-y-2">

                <Link
                  to="/terms"
                  className="block px-4 py-3 rounded-2xl hover:bg-[#F3F4F6] transition text-gray-700"
                >
                  Termos e Condições
                </Link>

                <Link
                  to="/privacy"
                  className="block px-4 py-3 rounded-2xl hover:bg-[#F3F4F6] transition text-gray-700"
                >
                  Privacidade
                </Link>

                <Link
                  to="/cookies"
                  className="block px-4 py-3 rounded-2xl hover:bg-[#F3F4F6] transition text-gray-700"
                >
                  Cookies
                </Link>

              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="space-y-6">
            {children}
          </main>

        </div>
      </section>

      <Footer />
    </div>
  );
}