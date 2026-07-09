import { motion } from "framer-motion";
import { BrainCircuit, ChartNoAxesCombined, Headphones, ShieldCheck, Sparkles, UserRoundSearch } from "lucide-react";

const features = [
  { icon: BrainCircuit, title: "Intent Detection", description: "Recognize what the customer wants and route it instantly with precision." },
  { icon: Sparkles, title: "Sentiment Analysis", description: "Read frustration, urgency, and confidence to tailor the response strategy." },
  { icon: UserRoundSearch, title: "Customer Profile Retrieval", description: "Pull plan, history, tier, and risk signals before the first reply is drafted." },
  { icon: ShieldCheck, title: "Personalized Resolution", description: "Generate policy-aware answers that feel specific to the account and issue." },
  { icon: Headphones, title: "Human Escalation", description: "Escalate cleanly with context, summary, and recommended next actions." },
  { icon: ChartNoAxesCombined, title: "Analytics Dashboard", description: "Track automation performance, satisfaction, response time, and backlog health." },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }} className="text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Features</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Premium capabilities designed to feel fast, clear, and trustworthy.
        </h2>
      </motion.div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-colors hover:bg-white/[0.08]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-cyan-400/20 text-cyan-200 shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition group-hover:scale-105 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
