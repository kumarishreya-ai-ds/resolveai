import { motion } from "framer-motion";

const stats = [
  { value: "42%", label: "support volume reduction" },
  { value: "3.8x", label: "faster first response" },
  { value: "91%", label: "customer issues resolved without escalation" },
];

export default function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }} className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-300">The problem</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Support teams are buried under repetitive questions, context switching, and inconsistent resolution quality.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Every ticket asks the same hidden questions: what does the customer need, how urgent is it, and what context should shape the answer? ResolveAI automates those decisions instantly.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_16px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            >
              <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
