import { motion } from "framer-motion";
import { ArrowRight, Bot, ChevronDown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import TrustedBy from "./TrustedBy";
import Problem from "./Problem";
import Workflow from "./Workflow";
import Features from "./Features";
import DashboardPreview from "./DashboardPreview";
import CTA from "./CTA";

const floatingCards = [
  { label: "Customer Chat", value: "Billing issue from renewal charge", tone: "from-cyan-500/20 to-blue-500/20", delay: 0.18 },
  { label: "Intent Agent", value: "Cancellation risk detected", tone: "from-blue-500/20 to-violet-500/20", delay: 0.28 },
  { label: "Sentiment Agent", value: "Frustration score: high", tone: "from-violet-500/20 to-fuchsia-500/20", delay: 0.38 },
  { label: "Customer Profile", value: "Enterprise plan, VIP, 14 open seats", tone: "from-emerald-500/20 to-cyan-500/20", delay: 0.48 },
  { label: "Resolution Status", value: "Draft prepared, awaiting confirmation", tone: "from-white/10 to-white/5", delay: 0.58 },
  { label: "AI Confidence", value: "96.4% confidence score", tone: "from-blue-500/20 to-cyan-500/20", delay: 0.68 },
  { label: "Live Agent Activity", value: "Agent reviewing escalation path", tone: "from-purple-500/20 to-slate-500/20", delay: 0.78 },
];

export default function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 top-28 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"
      />
      <Navbar />

      <main className="relative">
        <section id="home" className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
              >
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Premium AI orchestration for customer operations
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }} className="space-y-6">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                  Autonomous AI Customer Resolution Platform
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  ResolveAI coordinates multiple AI agents to understand customer issues, detect sentiment, identify intent, retrieve customer data, and generate personalized resolutions before a human handoff is ever needed.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }} className="flex flex-col gap-4 sm:flex-row">
                <a href="#cta" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_60px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_70px_rgba(124,58,237,0.4)] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#030712]">
                  Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a href="#dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[#030712]">
                  Watch Demo <ChevronDown className="h-4 w-4" />
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28 }} className="grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> SOC2-ready flows
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <Zap className="h-4 w-4 text-cyan-300" /> Fast deployment
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <Bot className="h-4 w-4 text-violet-300" /> Multi-agent AI
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.12 }} className="relative">
              <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-tr from-blue-500/30 via-violet-500/20 to-cyan-400/20 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-5">
                <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/60 p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm text-slate-400">ResolveAI Command Center</p>
                      <p className="mt-1 text-xl font-semibold text-white">Live customer resolution workflow</p>
                    </div>
                    <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      Live
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Customer Chat</p>
                          <p className="mt-2 text-lg font-medium text-white">My renewal charge looks incorrect and I need this fixed today.</p>
                        </div>
                        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                          High urgency
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-white/5">
                          <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
                        </div>
                        <span className="text-xs text-slate-400">routing in 0.8s</span>
                      </div>
                    </div>

                    {floatingCards.map((card, index) => (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: [0, -8, 0] }}
                        transition={{ opacity: { duration: 0.5, delay: card.delay }, y: { duration: 5.5 + index * 0.2, repeat: Infinity, ease: "easeInOut", delay: card.delay } }}
                        className={`rounded-[1.4rem] border border-white/10 bg-gradient-to-br ${card.tone} p-4 shadow-[0_16px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl`}
                      >
                        <p className="text-[0.7rem] uppercase tracking-[0.26em] text-slate-400">{card.label}</p>
                        <p className="mt-3 text-sm font-medium leading-6 text-white">{card.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="border-t border-white/5 bg-white/[0.015] py-10">
          <TrustedBy />
        </div>
        <Problem />
        <section id="solution" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Solution</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">A premium AI operating layer for customer resolution.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                  ResolveAI unifies routing, context gathering, resolution drafting, and human oversight into a polished workflow that feels instant for customers and effortless for teams.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/60 p-5">
                  <p className="text-sm text-slate-400">Before</p>
                  <p className="mt-3 text-lg font-medium text-white">Manual triage, repetitive replies, slow handoffs.</p>
                </div>
                <div className="rounded-[1.4rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-blue-500/10 to-violet-500/10 p-5">
                  <p className="text-sm text-slate-400">After</p>
                  <p className="mt-3 text-lg font-medium text-white">Autonomous handling with precise escalation when needed.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        <Workflow />
        <Features />
        <DashboardPreview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
