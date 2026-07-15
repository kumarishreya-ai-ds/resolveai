import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredToken, registerUser, setAuthToken } from "../services/api";

function InputField({ icon: Icon, type, placeholder, value, onChange, error, autoComplete, name }) {
  return (
    <label className="block">
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-2xl border bg-slate-950/70 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ${error ? "border-rose-500/70" : "border-white/10"}`}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
    </label>
  );
}

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (getStoredToken()) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (!form.password.trim()) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await registerUser(form);
      const token = response?.data?.token;
      if (token) {
        setAuthToken(token);
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || "Unable to register right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-[0_0_80px_rgba(37,99,235,0.18)] backdrop-blur-2xl">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="flex w-full flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-[#071224] p-6 sm:p-8 lg:w-[52%] lg:p-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-sm font-medium text-slate-300 transition hover:text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-400 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="tracking-[0.24em] text-slate-400">RESOLVEAI</span>
            </Link>

            <div className="mt-10 max-w-md sm:mt-12 lg:mt-16">
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-300"><ShieldCheck className="h-4 w-4" /> Create secure access</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Create Account</h1>
              <p className="mt-3 text-base leading-7 text-slate-400 sm:text-lg">Join the AI Customer Resolution Workspace and start routing tickets instantly.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <InputField icon={User} type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
                <InputField icon={Mail} type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
                <div className="relative">
                  <InputField icon={Lock} type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
                {apiError ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{apiError}</p> : null}
                <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(37,99,235,0.25)] transition disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? "Creating account..." : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </div>

          <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><ChevronRight className="h-4 w-4 rotate-180" /> Back to Login</Link>
        </motion.div>
        <div className="hidden lg:flex lg:w-[48%] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.28),_transparent_35%),linear-gradient(145deg,_rgba(15,23,42,0.95),_rgba(2,6,23,0.98))] p-8" />
      </div>
    </div>
  );
}
