import { motion } from "framer-motion";
import { ArrowLeft, MessageSquareText, Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../services/api";

const statusOptions = ["all", "open", "pending", "resolved", "closed"];

function badgeClass(priority) {
  if (priority === "urgent" || priority === "high") return "bg-rose-500/15 text-rose-300";
  if (priority === "medium") return "bg-amber-500/15 text-amber-300";
  return "bg-emerald-500/15 text-emerald-300";
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await getTickets();
        if (!active) return;
        const list = response?.data?.data || [];
        setTickets(list);
        setSelectedId((current) => current || list[0]?._id || "");
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Unable to load tickets.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = status === "all" || ticket.status === status;
      const haystack = [ticket.ticketId, ticket.title, ticket.description, ticket.intent, ticket.category, ticket.priority, ticket.assignedAgent, ticket.customer?.name, ticket.customer?.email].filter(Boolean).join(" ").toLowerCase();
      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [tickets, query, status]);

  const selected = filtered.find((ticket) => ticket._id === selectedId) || filtered[0] || null;

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Tickets</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Live ticket operations</h1>
            </div>
            <Link to="/workspace" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" />Workspace</Link>
          </div>
        </div>

        <div className="grid min-w-0 gap-6 p-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-400">Search and filter the queue</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Support pipeline</h2>
              </div>
              <div className="relative w-full min-w-0 max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" placeholder="Search ticket, customer, or agent" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">{statusOptions.map((item) => <button key={item} onClick={() => setStatus(item)} className={`rounded-full border px-3 py-1.5 text-sm transition ${status === item ? "border-blue-400/30 bg-blue-500/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>{item}</button>)}</div>

            {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}

            <div className="space-y-3">
              {loading ? <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">Loading tickets...</div> : null}
              {!loading && filtered.map((ticket) => (
                <button key={ticket._id} onClick={() => setSelectedId(ticket._id)} className={`w-full rounded-[1.3rem] border p-4 text-left transition ${selected?._id === ticket._id ? "border-blue-400/40 bg-blue-500/10" : "border-white/10 bg-slate-950/70 hover:bg-white/5"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{ticket.ticketId || "Ticket"}</p>
                      <p className="mt-1 text-sm text-slate-400">{ticket.title || ticket.description || "No title"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass(ticket.priority)}`}>{ticket.priority || "medium"}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400"><span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{ticket.status || "open"}</span><span>{ticket.customer?.name || "Unknown customer"}</span><span>{ticket.assignedAgent || "AI Agent"}</span></div>
                </button>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Selected record</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Ticket details</h2>
              </div>
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
            </div>

            {selected ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">{selected.ticketId}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{selected.title || "Untitled ticket"}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{selected.description || "No description available."}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"><span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Customer</span>{selected.customer?.name || "Unknown"}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"><span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Assigned</span>{selected.assignedAgent || "AI Agent"}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"><span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Intent</span>{selected.intent || selected.category || "Support"}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"><span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Status</span>{selected.status || "open"}</div>
                </div>
                <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Conversation</p>
                      <h3 className="mt-1 text-lg font-semibold text-white">Latest messages</h3>
                    </div>
                    <MessageSquareText className="h-4 w-4 text-blue-300" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {(selected.conversation || []).slice(0, 4).map((message, index) => <div key={`${message.time || index}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{message.role || message.sender || "customer"}</p><p className="mt-1 leading-6">{message.text || message.message}</p></div>)}
                    {!selected.conversation?.length ? <div className="text-sm text-slate-400">No conversation recorded.</div> : null}
                  </div>
                </div>
              </div>
            ) : <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">Select a ticket to inspect details.</div>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

