import { motion } from "framer-motion";

const metrics = [
  { label: "Total Tickets", value: "12,480", delta: "+18.2%" },
  { label: "Resolved", value: "11,206", delta: "+14.9%" },
  { label: "Pending", value: "84", delta: "-27.6%" },
  { label: "AI Resolution Rate", value: "87.4%", delta: "+9.1%" },
  { label: "Customer Satisfaction", value: "98.2%", delta: "+2.4%" },
  { label: "Average Response Time", value: "41s", delta: "-36.8%" },
];

const activity = [
  { label: "Billing issue resolved", time: "2 min ago", tone: "bg-emerald-400/15 text-emerald-300" },
  { label: "VIP escalation prepared", time: "6 min ago", tone: "bg-cyan-400/15 text-cyan-200" },
  { label: "Plan upgrade recommended", time: "11 min ago", tone: "bg-violet-400/15 text-violet-200" },
];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-7 lg:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-purple-300">Dashboard preview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Analytics that make automation visible and measurable.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            A command center for support leaders who want a clear view of volume, customer health, automation efficiency, and escalation load.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Operations trend</p>
                <p className="mt-1 text-lg font-medium text-white">Resolution throughput</p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Live
              </div>
            </div>
            <div className="mt-6 grid grid-cols-12 items-end gap-3 rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-4">
              {[32, 48, 36, 56, 68, 60, 74, 82, 70, 88, 94, 90].map((height, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-full bg-gradient-to-t from-blue-500 via-violet-500 to-cyan-400 shadow-[0_10px_30px_rgba(37,99,235,0.22)]" style={{ height: `${height}px` }} />
                  <span className="text-[10px] text-slate-500">{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {activity.map((item) => (
                <div key={item.label} className={`rounded-2xl border border-white/10 px-4 py-3 ${item.tone}`}>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-300">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                animate={{ y: [0, index % 2 === 0 ? -6 : 6, 0] }}
                transition={{ duration: 5.5 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
                className={`rounded-[1.4rem] border border-white/10 p-5 shadow-[0_14px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl ${index === 0 ? "bg-gradient-to-br from-blue-500/15 to-cyan-400/10" : "bg-white/[0.04]"}`}
              >
                <p className="text-sm text-slate-400">{metric.label}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{metric.value}</p>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">{metric.delta}</span>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${68 + index * 4}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: index * 0.05 }}
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
