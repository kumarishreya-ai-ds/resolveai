import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity, Gauge, Layers3, Clock3, Ticket, CheckCircle2, AlertTriangle } from "lucide-react";
import { getAIMonitor, getKnowledgeMonitor } from "../services/api";

export default function Monitor() {
  const [monitor, setMonitor] = useState(null);
  const [knowledge, setKnowledge] = useState(null);

  const load = async () => {
    const [monitorRes, knowledgeRes] = await Promise.all([getAIMonitor().catch(() => ({ data: { data: null } })), getKnowledgeMonitor().catch(() => ({ data: { data: null } }))]);
    setMonitor(monitorRes?.data?.data || null);
    setKnowledge(knowledgeRes?.data?.data || null);
  };

  useEffect(() => { load(); const interval = setInterval(load, 4000); return () => clearInterval(interval); }, []);

  const running = monitor?.running || 0;
  const completed = monitor?.completed || 0;
  const queueSize = monitor?.queueSize || 0;
  const ticketsToday = monitor?.requestsProcessed || 0;

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Admin Monitor</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Live AI operations</h1>
            </div>
            <Link to="/workspace" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" />Workspace</Link>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-4">
          {[
            { label: "Running agents", value: running, icon: Activity },
            { label: "Completed agents", value: completed, icon: CheckCircle2 },
            { label: "Queue size", value: queueSize, icon: Layers3 },
            { label: "Tickets today", value: ticketsToday, icon: Ticket },
          ].map((item) => {
            const Icon = item.icon;
            return <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">{item.label}</p><p className="mt-3 text-3xl font-semibold text-white">{item.value}</p></div><Icon className="h-5 w-5 text-blue-300" /></div></div>;
          })}
        </div>

        <div className="grid gap-6 px-6 pb-6 lg:grid-cols-[1fr_1fr]">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Performance</p><h2 className="mt-1 text-xl font-semibold text-white">System metrics</h2></div><Gauge className="h-4 w-4 text-cyan-300" /></div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Average latency</span><span className="text-cyan-300">{monitor?.averageProcessingTime || 0}ms</span></div>
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Average confidence</span><span className="text-blue-300">{monitor?.averageConfidence || monitor?.confidence || 0}</span></div>
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Escalated</span><span className="text-amber-300">{monitor?.escalations || 0}</span></div>
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Resolved</span><span className="text-emerald-300">{monitor?.successfulResolutions || 0}</span></div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Knowledge Store</p><h2 className="mt-1 text-xl font-semibold text-white">Embedding health</h2></div><Layers3 className="h-4 w-4 text-violet-300" /></div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Documents</span><span className="text-white">{knowledge?.documents || 0}</span></div>
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Chunks</span><span className="text-white">{knowledge?.chunkCount || 0}</span></div>
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Embeddings</span><span className="text-white">{knowledge?.embeddingCount || 0}</span></div>
              <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-slate-950/70 px-3 py-3"><span>Retrieval latency</span><span className="text-cyan-300">{knowledge?.retrievalLatencyMs || 0}ms</span></div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
