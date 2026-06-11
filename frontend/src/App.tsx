import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Message from "./pages/Message";
import Inbox from "./pages/Inbox";
import Thread from "./pages/Thread";
import Admin from "./pages/Admin";
import Favorites from './pages/Favorites';
import About from './pages/About';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';
import CustomerHistory from './pages/CustomerHistory';
import MyBookings from './pages/MyBookings';
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import QuoteRequest from "./pages/QuoteRequest";
import BookingRequest from "./pages/BookingRequest";
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/messages/new" element={<ProtectedRoute><Message /></ProtectedRoute>} />
        <Route path="/messages/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/messages/thread" element={<ProtectedRoute><Thread /></ProtectedRoute>} />
        <Route path="/quote/new" element={<ProtectedRoute roles={["cliente"]}><QuoteRequest /></ProtectedRoute>} />
        <Route path="/booking/new" element={<ProtectedRoute roles={["cliente"]}><BookingRequest /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute roles={["cliente"]}><Favorites /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/historico" element={<ProtectedRoute roles={["cliente"]}><CustomerHistory /></ProtectedRoute>} />
        <Route path="/agendamentos" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/prestador/dashboard" element={<ProtectedRoute roles={["prestador"]}><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Navigate to="/prestador/dashboard" replace />} />
        <Route path="/provider/profile" element={<Navigate to="/prestador/dashboard" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
