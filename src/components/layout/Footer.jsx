export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030712]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© 2026 ResolveAI. Autonomous customer resolution, designed for scale.</p>
        <div className="flex gap-6">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#workflow" className="transition hover:text-white">Workflow</a>
          <a href="#cta" className="transition hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
