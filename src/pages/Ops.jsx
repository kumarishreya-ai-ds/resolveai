import { motion } from "framer-motion";
import { ArrowLeft, Activity, CheckCircle2, Gauge, Layers3, ServerCog, ShieldCheck, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAIHealth, getAIMonitor, getKnowledgeMonitor } from "../services/api";

export default function Ops() {
  const [health, setHealth] = useState(null);
  const [monitor, setMonitor] = useState(null);
  const [knowledge, setKnowledge] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [healthRes, monitorRes, knowledgeRes] = await Promise.all([getAIHealth().catch(() => ({ data: { data: null } })), getAIMonitor().catch(() => ({ data: { data: null } })), getKnowledgeMonitor().catch(() => ({ data: { data: null } }))]);
      if (!active) return;
      setHealth(healthRes?.data?.data || null);
      setMonitor(monitorRes?.data?.data || null);
      setKnowledge(knowledgeRes?.data?.data || null);
    };
    load();
    const interval = setInterval(load, 4000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const cards = [
    { label: "Backend status", value: health?.status || "Healthy", icon: ServerCog },
    { label: "Requests processed", value: monitor?.requestsProcessed || 0, icon: Activity },
    { label: "Running jobs", value: monitor?.running || 0, icon: Gauge },
    { label: "Queue size", value: monitor?.queueSize || 0, icon: Layers3 },
    { label: "Knowledge documents", value: knowledge?.documents || 0, icon: ShieldCheck },
    { label: "Retrieval latency", value: `${knowledge?.retrievalLatencyMs || 0}ms`, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div><p className="text-sm uppercase tracking-[0.3em] text-blue-300">Ops</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">System operations</h1></div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
          </div>
        </div>

        <div className="min-w-0 space-y-6 p-6">
          <section className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => { const Icon = card.icon; return <motion.div key={card.label} whileHover={{ y: -3 }} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">{card.label}</p><p className="mt-3 text-2xl font-semibold text-white">{card.value}</p></div><Icon className="h-5 w-5 text-blue-300" /></div></motion.div>; })}</section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">System health</p><h2 className="mt-1 text-xl font-semibold text-white">Backend status</h2></div><TriangleAlert className="h-4 w-4 text-amber-300" /></div>
              <div className="mt-4 space-y-3 text-sm text-slate-300"><Row label="Status" value={health?.status || "healthy"} /><Row label="Message" value={health?.message || "Backend is responding"} /><Row label="Uptime" value={health?.uptime || "live"} /></div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">AI monitor</p><h2 className="mt-1 text-xl font-semibold text-white">Workflow telemetry</h2></div><Activity className="h-4 w-4 text-cyan-300" /></div>
              <div className="mt-4 space-y-3 text-sm text-slate-300"><Row label="Completed" value={monitor?.completed || 0} /><Row label="Average confidence" value={monitor?.averageConfidence || monitor?.confidence || 0} /><Row label="Escalations" value={monitor?.escalations || 0} /><Row label="Resolved" value={monitor?.successfulResolutions || 0} /></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><span>{label}</span><span className="text-white">{value}</span></div>;
}
