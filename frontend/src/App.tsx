import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProviderProfile from './pages/ProviderDashboard';
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import QuoteRequest from "./pages/QuoteRequest";
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/messages/new" element={<Message />} />
        <Route path="/messages/inbox" element={<Inbox />} />
        <Route path="/messages/thread" element={<Thread />} />
        <Route path="/quote/new" element={<QuoteRequest />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<ProviderProfile />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
      </Routes>
    </Router>
  );
}
