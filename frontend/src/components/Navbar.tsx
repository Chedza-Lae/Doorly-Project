import { Link } from 'react-router-dom';
import { Menu, X, Heart, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/doorly.png" alt="Doorly" style={{ height: 48 }} />
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
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-[#1E3A8A] hover:text-[#3B82F6] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#3B82F6] transition-colors shadow-sm"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
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
              <Link
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
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
