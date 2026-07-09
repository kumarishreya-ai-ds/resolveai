import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }} className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-cyan-500/20 p-6 text-center shadow-[0_24px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 lg:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_30%)]" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Ready to launch</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Turn every support conversation into a premium customer experience.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200/90">
            Bring ResolveAI into your workflow and automate resolution while keeping the polish, control, and escalation paths your team expects.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#home" className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_14px_60px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#030712]">
              Get Started
            </a>
            <a href="#workflow" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#030712]">
              Explore Workflow
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
