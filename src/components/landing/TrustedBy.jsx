import { motion } from "framer-motion";

const logos = ["Arcforge", "Northstar", "Luma", "Orbit", "Sentry", "Vertex"];

export default function TrustedBy() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-white/10 bg-white/[0.045] px-5 py-8 shadow-[0_16px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:px-6">
        <p className="text-center text-xs uppercase tracking-[0.32em] text-slate-400">Trusted by forward-thinking teams</p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <div key={logo} className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/[0.06]">
              {logo}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
