import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  ChevronRight,
  Clock3,
  Compass,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageSquareText,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar as BarChart, Doughnut as DoughnutChart, Line as LineChart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "AI Workspace", icon: BrainCircuit },
  { label: "Customers", icon: Users },
  { label: "Tickets", icon: MessageSquareText },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const stats = [
  { title: "Total Customers", value: "24.8K", delta: "+12.4%", icon: Users, trend: "up" },
  { title: "Open Tickets", value: "184", delta: "+8.2%", icon: MessageSquareText, trend: "up" },
  { title: "Resolved Today", value: "96", delta: "+15.1%", icon: ShieldCheck, trend: "up" },
  { title: "Pending Escalations", value: "17", delta: "-4.3%", icon: AlertTriangle, trend: "down" },
  { title: "Customer Satisfaction", value: "4.9/5", delta: "+0.6", icon: Sparkles, trend: "up" },
  { title: "AI Accuracy", value: "97.2%", delta: "+1.8%", icon: BrainCircuit, trend: "up" },
];

const agents = [
  { name: "Intent Agent", status: "Healthy", confidence: "98%", latency: "42ms", pulse: "bg-emerald-400" },
  { name: "Sentiment Agent", status: "Optimizing", confidence: "95%", latency: "58ms", pulse: "bg-cyan-400" },
  { name: "Customer Profile Agent", status: "Healthy", confidence: "97%", latency: "49ms", pulse: "bg-violet-400" },
  { name: "Knowledge Agent", status: "Syncing", confidence: "96%", latency: "64ms", pulse: "bg-amber-400" },
  { name: "Resolution Agent", status: "Healthy", confidence: "99%", latency: "39ms", pulse: "bg-emerald-400" },
  { name: "Escalation Agent", status: "Standby", confidence: "94%", latency: "71ms", pulse: "bg-slate-400" },
];

const tickets = [
  { id: "RT-1024", customer: "Lina Patel", intent: "Refund", priority: "High", status: "Escalating", agent: "Escalation Agent", action: "Review" },
  { id: "RT-1021", customer: "Marcus Cole", intent: "Billing", priority: "Medium", status: "In Progress", agent: "Resolution Agent", action: "Open" },
  { id: "RT-1018", customer: "Ava Brooks", intent: "Plan Upgrade", priority: "Low", status: "Resolved", agent: "Knowledge Agent", action: "View" },
  { id: "RT-1016", customer: "Noah Kim", intent: "Subscription", priority: "High", status: "Pending", agent: "Intent Agent", action: "Assign" },
];

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
    y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" } },
  },
};

const lineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [72, 78, 81, 86, 90, 94, 96],
      borderColor: "#60a5fa",
      backgroundColor: "rgba(96,165,250,0.15)",
      tension: 0.35,
      fill: true,
      pointRadius: 0,
    },
  ],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
    y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94a3b8" } },
  },
};

const barData = {
  labels: ["Billing", "Refund", "Upgrade", "Support", "Migration"],
  datasets: [
    {
      data: [42, 24, 18, 33, 17],
      backgroundColor: ["#2563eb", "#7c3aed", "#818cf8", "#38bdf8", "#34d399"],
      borderRadius: 10,
    },
  ],
};

const doughnutData = {
  labels: ["Resolved", "Pending", "Escalating"],
  datasets: [
    {
      data: [78, 14, 8],
      backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
      borderWidth: 0,
    },
  ],
};

const donutsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "72%",
  plugins: { legend: { display: false } },
};

function StatCard({ title, value, delta, icon: Icon, trend }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-2.5 text-blue-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-sm font-medium ${trend === "down" ? "text-rose-300" : "text-emerald-300"}`}>{delta}</span>
        <div className="flex h-8 w-16 items-end gap-1">
          {[4, 7, 5, 8, 6].map((height, index) => (
            <div key={index} className="flex-1 rounded-full bg-gradient-to-t from-blue-600 to-violet-600" style={{ height: `${height * 2}px` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const palette = {
    Resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    "In Progress": "bg-cyan-500/15 text-cyan-300 border-cyan-400/20",
    Escalating: "bg-rose-500/15 text-rose-300 border-rose-400/20",
    Pending: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  };

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${palette[status] || "bg-slate-500/15 text-slate-300 border-slate-400/20"}`}>{status}</span>;
}

export default function Dashboard() {
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <aside className="hidden w-72 flex-col justify-between border-r border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.23),_transparent_35%),linear-gradient(145deg,_rgba(6,10,24,0.98),_rgba(1,4,12,0.98))] p-6 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-400 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm tracking-[0.28em] text-slate-400">RESOLVEAI</p>
                <p className="text-lg font-semibold text-white">Command Center</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${item.active ? "border border-blue-400/25 bg-blue-500/15 text-white shadow-[0_0_40px_rgba(37,99,235,0.18)]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Laxmikanth</p>
                <p className="text-xs text-slate-400">Operations Lead</p>
              </div>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-white/10 bg-slate-950/70 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" placeholder="Search customers, tickets, or agents" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-blue-300" />
                    {formattedTime}
                  </div>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                  <Moon className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 font-semibold">L</div>
                  <div>
                    <p className="text-sm font-medium text-white">Laxmikanth</p>
                    <p className="text-xs text-slate-400">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="space-y-6 p-4 sm:p-6 lg:p-8">
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-[#0f172a] p-6 shadow-[0_26px_70px_rgba(2,6,23,0.45)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Operations Overview</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Welcome back, Laxmikanth</h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Your AI agents are actively resolving customer issues with unmatched speed and precision.</p>
                </div>
                <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                    24 AI missions in motion
                  </div>
                </div>
              </div>
            </motion.section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div key={stat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index, duration: 0.35 }} whileHover={{ y: -6, scale: 1.01 }}>
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">AI Agent Status</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Live agents</h2>
                  </div>
                  <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">6 online</div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {agents.map((agent) => (
                    <motion.div whileHover={{ y: -2 }} key={agent.name} className="rounded-[1.25rem] border border-white/10 bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{agent.name}</p>
                        <span className={`h-2.5 w-2.5 rounded-full ${agent.pulse} animate-pulse`} />
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <span className="text-white">{agent.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Confidence</span>
                          <span className="text-cyan-300">{agent.confidence}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Latency</span>
                          <span className="text-violet-300">{agent.latency}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Today’s Summary</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Performance pulse</h2>
                  </div>
                  <div className="rounded-full border border-violet-400/20 bg-violet-500/10 p-2 text-violet-300">
                    <Activity className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-6 h-52">
                  <LineChart data={lineData} options={lineOptions} />
                </div>
              </motion.div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Ticket Queue</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Live support pipeline</h2>
                  </div>
                  <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/10">View All</button>
                </div>
                <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-white/10">
                  <table className="min-w-full divide-y divide-white/10 text-sm">
                    <thead className="bg-slate-950/70 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Ticket ID</th>
                        <th className="px-4 py-3 text-left font-medium">Customer</th>
                        <th className="px-4 py-3 text-left font-medium">Intent</th>
                        <th className="px-4 py-3 text-left font-medium">Priority</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Assigned Agent</th>
                        <th className="px-4 py-3 text-left font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-slate-900/50 text-slate-200">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="transition hover:bg-white/5">
                          <td className="px-4 py-3 font-medium text-white">{ticket.id}</td>
                          <td className="px-4 py-3">{ticket.customer}</td>
                          <td className="px-4 py-3">{ticket.intent}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ticket.priority === "High" ? "bg-rose-500/15 text-rose-300" : ticket.priority === "Medium" ? "bg-amber-500/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"}`}>{ticket.priority}</span>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                          <td className="px-4 py-3">{ticket.agent}</td>
                          <td className="px-4 py-3">
                            <button className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white">
                              {ticket.action}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.45 }} className="space-y-6">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Resolution Rate</p>
                      <h2 className="mt-1 text-xl font-semibold text-white">Efficiency</h2>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-5 h-44">
                    <BarChart data={barData} options={barOptions} />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Escalation Rate</p>
                      <h2 className="mt-1 text-xl font-semibold text-white">Health</h2>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 p-2 text-cyan-300">
                      <Compass className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-center">
                    <div className="relative h-40 w-40">
                      <DoughnutChart data={doughnutData} options={donutsOptions} />
                      <div className="absolute inset-0 flex items-center justify-center text-center">
                        <div>
                          <p className="text-3xl font-semibold text-white">92%</p>
                          <p className="text-sm text-slate-400">Stable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
