import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react";
import { useMemo, /*useState*/ } from "react";

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  /* const [email, setEmail] = useState(""); */

  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      {/* Top strip (premium vibe) */}
      <div className="bg-linear-to-r from-[#0B1B46] via-[#1E3A8A] to-[#0B1B46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Encontra serviços confiáveis. Reserva em minutos.
              </h2>
              <p className="text-white/80 mt-2 max-w-2xl">
                Doorly liga clientes a prestadores verificados — com uma experiência simples, rápida e moderna.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/doorly.png" alt="Doorly" className="h-16 w-auto object-contain" />
            </div>

            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              Plataforma que aproxima clientes e prestadores de serviços com confiança, rapidez e uma experiência moderna.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="p-2 rounded-lg border border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
                  Serviços
                </Link>
              </li>
              {/* <li>
                <Link to="/favorites" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
                  Dashboard
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
                  Tornar-me prestador
                </Link>
              </li>
              <li>
                <Link to="/messages/inbox" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
                  Mensagens
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contacto</h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                support@doorly.com
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                +351 900 000 000
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                Portugal
              </li>
            </ul>

            {/* Mini badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border">
                Suporte rápido
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border">
                Prestadores verificados (protótipo)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {year} Doorly. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
              Termos
            </Link>
            <a href="#" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

