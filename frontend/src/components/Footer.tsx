import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <img src="/doorly.png" alt="Doorly" className="h-8 mb-4" />
            <p className="text-gray-600 text-sm">
              Connecting clients with trusted service providers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-[#1E3A8A] text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#1E3A8A] text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-[#1E3A8A] text-sm">
                  Become a Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-[#1E3A8A] text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#1E3A8A] text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">support@doorly.com</li>
              <li className="text-gray-600 text-sm">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Doorly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
