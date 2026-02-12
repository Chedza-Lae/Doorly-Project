import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Message from "./pages/message";
import Inbox from "./pages/inbox";
import Thread from "./pages/Thread";
import Admin from "./pages/Admin";

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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
