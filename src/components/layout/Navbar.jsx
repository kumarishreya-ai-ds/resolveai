import { Menu, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", href: "#home" },
  { label: "Workflow", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Contact", href: "#cta" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="group flex items-center gap-3 rounded-2xl px-2 py-1 text-white transition hover:bg-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-400 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-slate-400">RESOLVEAI</p>
            <p className="text-sm text-slate-200">Autonomous Support OS</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="relative transition hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              {link.label}
            </a>
          ))}
        </nav>

        <Link to="/login" className="hidden items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_30px_rgba(37,99,235,0.15)] transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 md:inline-flex">
          Get Started
        </Link>

        <button aria-label="Open navigation" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
