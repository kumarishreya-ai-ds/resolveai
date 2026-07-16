import { motion } from "framer-motion";
import { Activity, ArrowLeft, BarChart3, BrainCircuit, CheckCircle2, TrendingUp } from "lucide-react";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAIMetrics, getAnalytics } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [analyticsRes, metricsRes] = await Promise.all([getAnalytics().catch(() => ({ data: { data: null } })), getAIMetrics().catch(() => ({ data: { data: null } }))]);
      if (!active) return;
      setAnalytics(analyticsRes?.data?.data || null);
      setMetrics(metricsRes?.data?.data || null);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const kpis = [
    { label: "Total Tickets", value: analytics?.totalTickets || 0 },
    { label: "Active Tickets", value: analytics?.activeTickets || 0 },
    { label: "Resolved Today", value: analytics?.resolvedToday || 0 },
    { label: "Resolution Rate", value: `${analytics?.resolutionRate || 0}%` },
    { label: "Avg Response Time", value: `${analytics?.avgResponseTime || 0}ms` },
    { label: "Customer Satisfaction", value: analytics?.customerSatisfaction || 0 },
  ];

  const lineData = useMemo(() => ({ labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [{ label: "AI metrics", data: [12, 18, 14, 22, 28, 19, metrics?.requestsProcessed || 16], borderColor: "#60a5fa", backgroundColor: "rgba(96,165,250,0.15)", tension: 0.35, fill: true, pointRadius: 0 }] }), [metrics]);
  const barData = useMemo(() => ({ labels: (analytics?.ticketsByIntent || []).map((item) => item.label), datasets: [{ data: (analytics?.ticketsByIntent || []).map((item) => item.value), backgroundColor: ["#2563eb", "#7c3aed", "#38bdf8", "#818cf8", "#0ea5e9"], borderRadius: 10 }] }), [analytics]);
  const doughnutData = useMemo(() => ({ labels: (analytics?.sentimentDistribution || []).map((item) => item.label), datasets: [{ data: (analytics?.sentimentDistribution || []).map((item) => item.value), backgroundColor: ["#22c55e", "#f59e0b", "#ef4444", "#38bdf8"], borderWidth: 0 }] }), [analytics]);

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Analytics</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Operational analytics</h1>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
          </div>
        </div>

        <main className="space-y-6 p-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{kpis.map((kpi) => <motion.div key={kpi.label} whileHover={{ y: -3 }} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"><p className="text-sm text-slate-400">{kpi.label}</p><p className="mt-3 text-3xl font-semibold text-white">{kpi.value}</p></motion.div>)}</section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Trend line</p><h2 className="mt-1 text-xl font-semibold text-white">AI workload this week</h2></div><Activity className="h-4 w-4 text-cyan-300" /></div>
              <div className="mt-5 h-72"><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: "#94a3b8" } }, y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" } } } }} /></div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Intent mix</p><h2 className="mt-1 text-xl font-semibold text-white">Ticket categories</h2></div><BarChart3 className="h-4 w-4 text-blue-300" /></div>
                <div className="mt-5 h-56"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: "#94a3b8" } }, y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" } } } }} /></div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Sentiment health</p><h2 className="mt-1 text-xl font-semibold text-white">Customer mood</h2></div><CheckCircle2 className="h-4 w-4 text-emerald-300" /></div>
                <div className="mt-5 flex justify-center"><div className="h-44 w-44"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false } } }} /></div></div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">AI Metrics</p><h2 className="mt-1 text-xl font-semibold text-white">Live backend telemetry</h2></div><BrainCircuit className="h-4 w-4 text-violet-300" /></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Requests processed", metrics?.requestsProcessed || 0],["Successful resolutions", metrics?.successfulResolutions || 0],["Escalations", metrics?.escalations || 0],["Average processing", `${metrics?.averageProcessingTime || 0}ms`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-lg font-semibold text-white">{value}</p></div>)}</div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Insights</p><h2 className="mt-1 text-xl font-semibold text-white">Top issues</h2></div><TrendingUp className="h-4 w-4 text-cyan-300" /></div>
              <div className="mt-4 space-y-3">{(analytics?.topIssues || []).slice(0, 5).map((issue, index) => <div key={`${issue}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">{issue}</div>)}{!analytics?.topIssues?.length ? <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">No issue data available yet.</div> : null}</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
