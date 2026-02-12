import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, LayoutDashboard, Mail, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { clearToken, getUser } from "../lib/api";

type StoredUser = {
  nome: string;
  email: string;
  tipo: "cliente" | "prestador" | "admin";
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUserState] = useState<StoredUser | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const u = getUser() as StoredUser | null;
    setUserState(u);
  }, [location.pathname]);

  const isLogged = !!user;
  const isAdmin = user?.tipo === "admin";

  function logout() {
  clearToken();
  setUserState(null);
  navigate("/");
  window.location.reload();
}

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <img src="/doorly.png" alt="Doorly" style={{ height: 80 }} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-gray-700 hover:text-[#1E3A8A] transition-colors">
              Services
            </Link>

            <Link to="/about" className="text-gray-700 hover:text-[#1E3A8A] transition-colors">
              About
            </Link>

            <Link to="/favorites" className="text-gray-700 hover:text-[#1E3A8A] transition-colors">
              <Heart className="w-5 h-5" />
            </Link>

            <Link to="/dashboard" className="text-gray-700 hover:text-[#1E3A8A] transition-colors">
              <LayoutDashboard className="w-5 h-5" />
            </Link>

            {/* ✅ Mensagens só se logado */}
            {isLogged && (
              <Link
                to="/messages/inbox"
                className="text-gray-700 hover:text-[#1E3A8A] transition-colors flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Mensagens
              </Link>
            )}

            {/* ✅ Admin só se admin */}
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-[#1E3A8A] transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {!isLogged ? (
              <>
                <Link to="/login" className="px-4 py-2 text-[#1E3A8A] hover:text-[#3B82F6] transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#3B82F6] transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-semibold">
                    {user.nome?.slice(0, 1)?.toUpperCase() || <User className="w-5 h-5" />}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-medium">{user.nome}</div>
                    <div className="text-xs text-gray-500">{user.tipo}</div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link
                to="/services"
                className="text-gray-700 hover:text-[#1E3A8A] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>

              {/* <Link
                to="/about"
                className="text-gray-700 hover:text-[#1E3A8A] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>

              <Link
                to="/favorites"
                className="text-gray-700 hover:text-[#1E3A8A] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Favorites
              </Link>

              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-[#1E3A8A] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link> */}

              {isLogged && (
                <Link
                  to="/messages/inbox"
                  className="text-gray-700 hover:text-[#1E3A8A] transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Mail className="w-5 h-5" />
                  Mensagens
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-[#1E3A8A] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}

              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                {!isLogged ? (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-center text-[#1E3A8A] hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="px-4 py-2 text-center bg-[#1E3A8A] text-white rounded-lg hover:bg-[#3B82F6] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 rounded-lg bg-gray-50 border text-gray-700">
                      <div className="text-sm font-medium">{user.nome}</div>
                      <div className="text-xs text-gray-500">{user.tipo}</div>
                    </div>

                    <button
                      onClick={logout}
                      className="px-4 py-2 text-center border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Sair
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
