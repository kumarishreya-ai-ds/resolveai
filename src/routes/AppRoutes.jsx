import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Hero from "../components/landing/Hero";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Workspace from "../pages/Workspace";
import { getStoredToken } from "../services/api";

function Home() {
  return <Hero />;
}

function ProtectedRoute({ children }) {
  return getStoredToken() ? children : <Navigate to="/login" replace />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-center text-white">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Page not found</h1>
        <p className="mt-3 text-slate-300">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
