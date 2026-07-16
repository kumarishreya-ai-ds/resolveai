import { motion } from "framer-motion";
import { ArrowLeft, Building2, Mail, Phone, Search, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomers } from "../services/api";

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-blue-300" />
      </div>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getCustomers();
        if (!active) return;
        setCustomers(response?.data?.data || []);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Unable to load customers.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter((customer) => [customer.name, customer.email, customer.company, customer.tier, customer.status, customer.phone].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle)));
  }, [customers, query]);

  const metrics = [
    { label: "Total Customers", value: String(customers.length), icon: Users },
    { label: "Active Profiles", value: String(customers.filter((c) => c.status === "active").length), icon: ShieldCheck },
    { label: "Companies", value: String(new Set(customers.map((c) => c.company).filter(Boolean)).size), icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Customers</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Customer directory</h1>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">{metrics.map((metric) => <StatCard key={metric.label} {...metric} />)}</div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-400">Search and review live customer records</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Profiles and account context</h2>
              </div>
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" placeholder="Search name, email, company, tier, or status" />
              </div>
            </div>

            {error ? <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {loading ? <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">Loading customers...</div> : null}
              {!loading && filtered.map((customer) => (
                <motion.div key={customer._id} whileHover={{ y: -3 }} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{customer.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{customer.company || "Independent"} · {customer.tier || "standard"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${customer.status === "active" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{customer.status || "unknown"}</span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><Mail className="h-4 w-4 text-cyan-300" />{customer.email || "No email"}</div>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><Phone className="h-4 w-4 text-cyan-300" />{customer.phone || "No phone"}</div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p><p className="mt-1">{customer.membership || customer.plan || "No additional membership data available."}</p></div>
                </motion.div>
              ))}
            </div>

            {!loading && !filtered.length ? <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">No customers matched your search.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
