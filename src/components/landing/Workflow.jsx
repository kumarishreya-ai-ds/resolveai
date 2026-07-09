import { motion } from "framer-motion";

const steps = [
  "Customer",
  "Intent Agent",
  "Sentiment Agent",
  "Customer Profile Agent",
  "Resolution Agent",
  "Escalation Agent",
  "Ticket Resolved",
];

export default function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }} className="text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-blue-300">How ResolveAI works</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          An animated workflow that turns every conversation into a controlled resolution path.
        </h2>
      </motion.div>

      <div className="mt-12 grid gap-4 lg:grid-cols-7 lg:gap-3">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex min-h-28 w-full items-center justify-center rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-4 py-6 text-center text-sm font-medium text-white shadow-[0_16px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]">
              {step}
            </div>
            {index < steps.length - 1 ? <div className="h-8 w-px bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500 lg:h-px lg:w-full" /> : null}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
