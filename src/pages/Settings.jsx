import { motion } from "framer-motion";
import { ArrowLeft, Bell, BrainCircuit, Database, ShieldCheck, Sparkles, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const storageKey = "resolveai_settings";

export default function Settings() {
  const [settings, setSettings] = useState({ apiUrl: import.meta.env.VITE_API_URL || "", model: "gpt-4.1-mini", temperature: 0.4, notifications: true, escalationAlerts: true, emailDigest: false });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setSettings((current) => ({ ...current, ...JSON.parse(saved) }));
    } catch {
      // Ignore malformed saved settings.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div><p className="text-sm uppercase tracking-[0.3em] text-blue-300">Settings</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Platform configuration</h1></div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
          </div>
        </div>

        <div className="grid min-w-0 gap-6 p-6 xl:grid-cols-2">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">API configuration</p><h2 className="mt-1 text-xl font-semibold text-white">Connection settings</h2></div><Database className="h-4 w-4 text-cyan-300" /></div>
            <div className="mt-4 space-y-4">
              <label className="block"><span className="text-sm text-slate-400">API base URL</span><input value={settings.apiUrl} onChange={(event) => setSettings((current) => ({ ...current, apiUrl: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" placeholder="https://resolveai-backend..." /></label>
              <label className="block"><span className="text-sm text-slate-400">Model</span><input value={settings.model} onChange={(event) => setSettings((current) => ({ ...current, model: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" /></label>
              <label className="block"><span className="text-sm text-slate-400">Temperature</span><input type="range" min="0" max="1" step="0.1" value={settings.temperature} onChange={(event) => setSettings((current) => ({ ...current, temperature: Number(event.target.value) }))} className="mt-2 w-full accent-blue-500" /><p className="mt-2 text-sm text-slate-300">{settings.temperature}</p></label>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Model settings</p><h2 className="mt-1 text-xl font-semibold text-white">Behavior tuning</h2></div><BrainCircuit className="h-4 w-4 text-violet-300" /></div>
            <div className="mt-4 space-y-3">
              <Toggle label="Automatic notifications" checked={settings.notifications} onChange={(checked) => setSettings((current) => ({ ...current, notifications: checked }))} icon={Bell} />
              <Toggle label="Escalation alerts" checked={settings.escalationAlerts} onChange={(checked) => setSettings((current) => ({ ...current, escalationAlerts: checked }))} icon={ShieldCheck} />
              <Toggle label="Email digest" checked={settings.emailDigest} onChange={(checked) => setSettings((current) => ({ ...current, emailDigest: checked }))} icon={Sparkles} />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">Settings are stored locally for this workspace.</div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl xl:col-span-2">
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Notification preferences</p><h2 className="mt-1 text-xl font-semibold text-white">Ops and support alerts</h2></div><SlidersHorizontal className="h-4 w-4 text-blue-300" /></div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">{[["Channel", settings.notifications ? "Enabled" : "Disabled"],["Escalations", settings.escalationAlerts ? "Enabled" : "Disabled"],["Summary", settings.emailDigest ? "Enabled" : "Disabled"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-lg font-semibold text-white">{value}</p></div>)}</div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange, icon: Icon }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left transition hover:bg-white/5">
      <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-cyan-300" /><span className="text-sm text-slate-200">{label}</span></div>
      <span className={`h-6 w-11 rounded-full border transition ${checked ? "border-blue-400/40 bg-blue-500/20" : "border-white/10 bg-white/5"}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} /></span>
    </button>
  );
}
