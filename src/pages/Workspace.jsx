import { motion } from "framer-motion";
import {
  Activity,
  ArrowUp,
  Paperclip,
  Bell,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Mic,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "AI Workspace", icon: BrainCircuit, active: true },
  { label: "Customers", icon: Users },
  { label: "Tickets", icon: MessageSquareText },
  { label: "Analytics", icon: Activity },
  { label: "Settings", icon: Settings },
];

const pipelineSteps = [
  { title: "Customer Query", status: "Received", confidence: "98%", time: "0.2s" },
  { title: "Intent Agent", status: "Matched", confidence: "97%", time: "0.4s" },
  { title: "Sentiment Agent", status: "Calm", confidence: "96%", time: "0.3s" },
  { title: "Customer Profile Agent", status: "Linked", confidence: "95%", time: "0.5s" },
  { title: "Knowledge Agent", status: "Resolved", confidence: "99%", time: "0.6s" },
  { title: "Resolution Agent", status: "Drafted", confidence: "98%", time: "0.4s" },
  { title: "Escalation Agent", status: "Standby", confidence: "94%", time: "0.3s" },
  { title: "Final Response", status: "Ready", confidence: "97%", time: "0.2s" },
];

const chatMessages = [
  {
    role: "customer",
    text: "Hi, I was charged twice for my Pro plan this month and I need this resolved quickly.",
    time: "09:24",
    status: "Delivered",
  },
  {
    role: "ai",
    text: "I’m reviewing the billing event and the subscription history for your account now.",
    time: "09:25",
    status: "Seen",
  },
  {
    role: "customer",
    text: "Please make sure the extra charge is removed and confirm the next billing date.",
    time: "09:26",
    status: "Delivered",
  },
  {
    role: "ai",
    text: "I’ve identified the duplicate invoice and I’m preparing a resolution with the refund summary.",
    time: "09:27",
    status: "Responding",
  },
];

const reasoningItems = [
  { label: "Detected Intent", value: "Duplicate charge / refund request" },
  { label: "Detected Sentiment", value: "Concerned, urgent" },
  { label: "Customer History", value: "Pro plan since 2023 • 3 prior billing cases" },
  { label: "Knowledge Sources", value: "Billing policy • Refund SLA • Plan terms" },
  { label: "Confidence Score", value: "97.2%" },
  { label: "Suggested Resolution", value: "Issue refund for duplicate charge and extend license" },
  { label: "Escalation Decision", value: "No escalation needed; auto-resolution ready" },
];

const logs = [
  { title: "Intent Agent", detail: "Matched billing intent with 97% confidence", time: "Just now" },
  { title: "Knowledge Agent", detail: "Pulled refund policy and plan entitlement data", time: "1 min ago" },
  { title: "Resolution Agent", detail: "Drafted customer-friendly response and refund note", time: "2 min ago" },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
      <div className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.1 }}
            className="h-2 w-2 rounded-full bg-blue-400"
          />
        ))}
      </div>
      ResolveAI is typing...
    </div>
  );
}

export default function Workspace() {
  const [draft, setDraft] = useState("");
  const currentTime = useMemo(() => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), []);

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
                <p className="text-lg font-semibold text-white">Console</p>
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
                <p className="text-xs text-slate-400">Support Lead</p>
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
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" placeholder="Search workspace context" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-blue-300" />
                    {currentTime}
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
                    <p className="text-xs text-slate-400">Supervisor</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div className="space-y-6">
              <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Customer Resolution Console</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">Ticket #RT-1042 • Billing dispute</h1>
                    <p className="mt-2 text-sm text-slate-400">ResolveAI is orchestrating the billing recovery flow with proactive context and policy-aware suggestions.</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                      Live AI orchestration
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    { label: "Ticket ID", value: "RT-1042" },
                    { label: "Customer Name", value: "Mina Alvarez" },
                    { label: "Customer Tier", value: "Enterprise" },
                    { label: "Issue Category", value: "Billing / Refund" },
                    { label: "Priority", value: "High" },
                    { label: "Current Status", value: "Awaiting Approval" },
                    { label: "Assigned AI Agent", value: "Resolution Agent" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">Agent Pipeline</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Resolution flow</h2>
                  </div>
                  <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">Adaptive orchestration</div>
                </div>

                <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-stretch xl:justify-between">
                  {pipelineSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16 + index * 0.05, duration: 0.35 }}
                      className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-3 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
                        <span className="text-blue-300">{step.title}</span>
                        {index < pipelineSteps.length - 1 ? <ChevronRight className="h-4 w-4 text-slate-500" /> : null}
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{step.status}</p>
                      <p className="mt-1 text-xs text-cyan-300">{step.confidence}</p>
                      <p className="mt-1 text-xs text-violet-300">{step.time}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">AI Conversation</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Customer and ResolveAI</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">Secure session</div>
                </div>

                <div className="mt-5 space-y-3 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
                  {chatMessages.map((message, index) => (
                    <motion.div key={`${message.time}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }} className={`flex ${message.role === "customer" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-[1.25rem] border px-4 py-3 ${message.role === "customer" ? "border-white/10 bg-white/5" : "border-blue-400/20 bg-gradient-to-br from-blue-600/20 to-violet-600/20"}`}>
                        <p className="text-sm leading-6 text-slate-100">{message.text}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <span>{message.time}</span>
                          <span>•</span>
                          <span>{message.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <TypingIndicator />
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3">
                    <Paperclip className="h-4 w-4 text-slate-400" />
                    <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Send a reply to the customer" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                      <Mic className="h-4 w-4" />
                    </button>
                    <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.22)] transition hover:brightness-110">
                      Send
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.section>
            </div>

            <div className="space-y-6">
              <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">AI Reasoning Panel</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Decision context</h2>
                  </div>
                  <div className="rounded-full border border-violet-400/20 bg-violet-500/10 p-2 text-violet-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {reasoningItems.map((item) => (
                    <div key={item.label} className="rounded-[1.15rem] border border-white/10 bg-slate-950/70 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                      <p className="mt-2 text-sm text-slate-200">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.14, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Quick Actions</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Next steps</h2>
                  </div>
                  <Zap className="h-4 w-4 text-amber-300" />
                </div>
                <div className="mt-5 grid gap-2">
                  {['Escalate', 'Regenerate', 'Approve Response', 'Send to Customer', 'Close Ticket'].map((action) => (
                    <button key={action} className="flex items-center justify-between rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-slate-200 transition hover:border-blue-400/30 hover:bg-white/10">
                      {action}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.45 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Live AI Logs</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Agent activity</h2>
                  </div>
                  <Activity className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="mt-5 space-y-3">
                  {logs.map((log) => (
                    <div key={log.title} className="rounded-[1.1rem] border border-white/10 bg-slate-950/70 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{log.title}</p>
                        <span className="text-xs text-slate-400">{log.time}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{log.detail}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
