import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  Sparkle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Live AI Agent Status", value: "Online", tone: "text-emerald-300" },
  { label: "Active Tickets", value: "184", tone: "text-cyan-300" },
  { label: "AI Resolution Rate", value: "94%", tone: "text-violet-300" },
  { label: "Customer Satisfaction", value: "4.9/5", tone: "text-amber-300" },
];

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
          className={`w-full rounded-2xl border bg-slate-950/70 py-3 pl-12 pr-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ${error ? "border-rose-500/70" : "border-white/10"}`}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
    </label>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    validate();
  }

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-[0_0_80px_rgba(37,99,235,0.18)] backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex w-full flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-[#071224] p-6 sm:p-8 lg:w-[52%] lg:p-10"
        >
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-sm font-medium text-slate-300 transition hover:text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-400 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="tracking-[0.24em] text-slate-400">RESOLVEAI</span>
            </Link>

            <div className="mt-10 max-w-md sm:mt-12 lg:mt-16">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
                  <ShieldCheck className="h-4 w-4" /> Secure workspace access
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Welcome Back</h1>
                <p className="mt-3 text-base leading-7 text-slate-400 sm:text-lg">
                  Sign in to access your AI Customer Resolution Workspace.
                </p>
              </motion.div>

              <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }} onSubmit={handleSubmit} className="mt-8 space-y-4">
                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                />

                <div className="relative">
                  <InputField
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                  <label className="flex items-center gap-2 text-slate-400">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={() => setRemember((value) => !value)}
                      className="h-4 w-4 rounded border-white/10 bg-slate-900 text-blue-500 focus:ring-blue-500/30"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-300 transition hover:text-blue-200">
                    Forgot Password?
                  </a>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(37,99,235,0.25)] transition hover:shadow-[0_20px_55px_rgba(124,58,237,0.24)]"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </motion.button>

                <div className="flex items-center gap-3 py-2 text-slate-500">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-xs uppercase tracking-[0.3em]">or</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/40 hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.53Z" />
                    <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.58A10 10 0 0 0 12 22Z" />
                    <path fill="#FBBC05" d="M6.41 13.9a6.02 6.02 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 12.76l3.35-2.38Z" />
                    <path fill="#EA4335" d="M12 6.04c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.94 5.52l3.35 2.58C7.2 7.8 9.4 6.04 12 6.04Z" />
                  </svg>
                  Continue with Google
                </button>
              </motion.form>
            </div>
          </div>

          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ChevronRight className="h-4 w-4 rotate-180" /> Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="relative hidden w-[48%] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.28),_transparent_35%),linear-gradient(145deg,_rgba(15,23,42,0.95),_rgba(2,6,23,0.98))] p-8 lg:flex"
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:36px_36px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">AI Workspace</p>
                <p className="text-2xl font-semibold text-white">Operational Control</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Live
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 + index * 0.06, duration: 0.4 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className={`mt-2 text-xl font-semibold ${stat.tone}`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">AI Workflow Animation</p>
                  <p className="mt-1 text-lg font-semibold text-white">Resolution pipeline</p>
                </div>
                <div className="rounded-full border border-violet-400/20 bg-violet-500/10 p-2 text-violet-300">
                  <Zap className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {["Intent Capture", "Context Recall", "Resolution Draft", "Customer Reply"].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{step}</p>
                      <p className="text-sm text-slate-400">Adaptive response routing</p>
                    </div>
                    <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2.2, delay: index * 0.2 }}>
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              <div className="flex items-center gap-2">
                <Sparkle className="h-4 w-4" />
                <span className="font-medium">Adaptive orchestration is actively resolving tickets.</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
