import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Shield,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { clearToken, getUser } from "../lib/api";

type StoredUser = {
  id?: number;
  nome: string;
  email: string;
  tipo: "cliente" | "prestador" | "admin";
  foto_perfil?: string | null;
};

type AccountLink = {
  to: string;
  label: string;
  show: boolean;
  icon: ReactNode;
};

const truncateStyle: CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const user = getUser() as StoredUser | null;

  const isLogged = !!user;
  const isAdmin = user?.tipo === "admin";
  const isCliente = user?.tipo === "cliente";
  const isPrestador = user?.tipo === "prestador";

  const accountLinks: AccountLink[] = [
    { to: "/perfil", label: "Meu Perfil", show: isLogged, icon: <User className="h-4 w-4" /> },
    { to: "/agendamentos", label: "Agendamentos", show: isLogged, icon: <CalendarDays className="h-4 w-4" /> },
    { to: "/historico", label: "Histórico", show: isCliente, icon: <History className="h-4 w-4" /> },
    { to: "/favorites", label: "Favoritos", show: isCliente, icon: <Heart className="h-4 w-4" /> },
    { to: "/messages/inbox", label: "Mensagens", show: isLogged, icon: <Mail className="h-4 w-4" /> },
    {
      to: "/prestador/dashboard",
      label: "Dashboard Prestador",
      show: isPrestador,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    { to: "/admin", label: "Administração", show: isAdmin, icon: <Shield className="h-4 w-4" /> },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function logout() {
    clearToken();
    setAccountOpen(false);
    setIsOpen(false);
    navigate("/");
    window.location.reload();
  }

  function closeMenus() {
    setAccountOpen(false);
    setIsOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-3 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenus}>
              <img src="/doorly.png" alt="Doorly" className="h-14 w-auto object-contain md:h-16" />
            </Link>
          </div>

          <div className="hidden items-center justify-center gap-10 md:flex">
            <Link to="/services" className="text-gray-700 transition-colors hover:text-[#1E3A8A]">
              Serviços
            </Link>

            <Link to="/about" className="text-gray-700 transition-colors hover:text-[#1E3A8A]">
              Sobre
            </Link>
          </div>

          <div className="hidden items-center justify-end gap-4 md:flex">
            {!isLogged ? (
              <>
                <Link to="/login" className="px-4 py-2 text-[#1E3A8A] transition-colors hover:text-[#3B82F6]">
                  Entrar
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-[#1E3A8A] px-6 py-2 text-white shadow-sm transition-colors hover:bg-[#3B82F6]"
                >
                  Criar conta
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <Avatar user={user} />

                  <ChevronDown
                    className="h-4 w-4 text-gray-500 transition-transform"
                    style={{ transform: accountOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {accountOpen && (
                  <div
                    className="absolute overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    role="menu"
                    style={{
                      right: 0,
                      top: "calc(100% + 0.75rem)",
                      width: "18rem",
                      zIndex: 60,
                      boxShadow:
                        "0 20px 25px -5px rgb(15 23 42 / 0.12), 0 8px 10px -6px rgb(15 23 42 / 0.12)",
                    }}
                  >
                    <div className="bg-[#F3F4F6] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} large />

                        <div style={{ minWidth: 0 }}>
                          <p className="font-semibold text-[#0B1B46]" style={truncateStyle}>
                            {user.nome}
                          </p>
                          <p className="text-sm text-gray-500" style={truncateStyle}>
                            {user.email}
                          </p>
                          <span className="mt-1 inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium capitalize text-[#1E3A8A]">
                            {user.tipo}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      {accountLinks
                        .filter((link) => link.show)
                        .map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={closeMenus}
                            role="menuitem"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#1E3A8A]"
                          >
                            {link.icon}
                            {link.label}
                          </Link>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 p-2">
                      <button
                        type="button"
                        onClick={logout}
                        role="menuitem"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end md:hidden">
            <button
              type="button"
              onClick={() => {
                setAccountOpen(false);
                setIsOpen((current) => !current);
              }}
              className="rounded-lg p-2 hover:bg-gray-100"
              aria-label="Abrir menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 py-6">
            <div className="flex flex-col gap-2">
              <Link
                to="/services"
                className="rounded-xl px-3 py-3 text-base text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#1E3A8A]"
                onClick={closeMenus}
              >
                Serviços
              </Link>

              <Link
                to="/about"
                className="rounded-xl px-3 py-3 text-base text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#1E3A8A]"
                onClick={closeMenus}
              >
                Sobre
              </Link>
            </div>

            {!isLogged ? (
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6">
                <Link
                  to="/login"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-[#1E3A8A] transition-colors hover:bg-gray-50"
                  onClick={closeMenus}
                >
                  Entrar
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-[#1E3A8A] px-4 py-3 text-center text-white shadow-sm transition-colors hover:bg-[#3B82F6]"
                  onClick={closeMenus}
                >
                  Criar conta
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} large />
                    <div style={{ minWidth: 0 }}>
                      <p className="font-semibold text-[#0B1B46]" style={truncateStyle}>
                        {user.nome}
                      </p>
                      <p className="text-sm text-gray-500" style={truncateStyle}>
                        {user.email}
                      </p>
                      <span className="mt-1 inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium capitalize text-[#1E3A8A]">
                        {user.tipo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  {accountLinks
                    .filter((link) => link.show)
                    .map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#1E3A8A]"
                        onClick={closeMenus}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-auto flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Avatar({ user, large = false }: { user: StoredUser; large?: boolean }) {
  const sizeClass = large ? "h-12 w-12" : "h-9 w-9";

  if (user.foto_perfil) {
    return (
      <img
        src={user.foto_perfil}
        alt={user.nome}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-blue-100`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full bg-blue-100 font-semibold text-[#1E3A8A]`}
    >
      {user.nome?.slice(0, 1)?.toUpperCase() || <User className="h-5 w-5" />}
    </div>
  );
}
