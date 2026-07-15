import { motion } from "framer-motion";
import { Activity, ArrowUp, Bell, Bot, BrainCircuit, CheckCircle2, ChevronRight, Clock3, LayoutDashboard, LogOut, MessageSquareText, Mic, Moon, Search, Settings, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthToken, createTicket, getCustomers, getLogs, getTickets, processAI, updateTicket } from "../services/api";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "AI Workspace", icon: BrainCircuit, active: true },
  { label: "Customers", icon: Users },
  { label: "Tickets", icon: MessageSquareText },
  { label: "Analytics", icon: Activity },
  { label: "Settings", icon: Settings },
];

const demoScenarios = [
  "My payment was deducted but order wasn't confirmed.",
  "I need a refund for the wrong amount charged.",
  "My order has been delayed for days.",
  "My account is locked and I cannot log in.",
  "I want to cancel my subscription immediately.",
  "I received the wrong product delivery.",
];

const pipelineTemplate = [
  { title: "Intent Agent", detail: "Detecting intent..." },
  { title: "Sentiment Agent", detail: "Analyzing emotion..." },
  { title: "Customer Profile Agent", detail: "Fetching customer..." },
  { title: "Knowledge Base Agent", detail: "Searching policies..." },
  { title: "Resolution Agent", detail: "Generating response..." },
  { title: "Escalation Agent", detail: "Decision completed..." },
];

function TypingIndicator() {
  return <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-400"><div className="flex gap-1">{[0,1,2].map((dot)=><motion.span key={dot} animate={{ y: [0,-3,0] }} transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.1 }} className="h-2 w-2 rounded-full bg-blue-400" />)}</div>ResolveAI is typing...</div>;
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Workspace() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [pipeline, setPipeline] = useState(pipelineTemplate.map((step) => ({ ...step, status: "Waiting", output: "" })));
  const [liveLogs, setLiveLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const logTimerRef = useRef(null);
  const logPollRef = useRef(null);
  const currentTime = useMemo(() => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), []);

  const selectedTicket = tickets.find((ticket) => ticket._id === selectedTicketId) || tickets[0];
  const selectedCustomerId = selectedTicket?.customer?._id || selectedTicket?.customer || customers[0]?._id;

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const [ticketRes, customerRes, logRes] = await Promise.all([getTickets().catch(() => ({ data: { data: [] } })), getCustomers().catch(() => ({ data: { data: [] } })), getLogs().catch(() => ({ data: { data: [] } }))]);
      const ticketList = ticketRes?.data?.data || [];
      const customerList = customerRes?.data?.data || [];
      setTickets(ticketList);
      setCustomers(customerList);
      setLiveLogs(logRes?.data?.data || []);
      setSelectedTicketId((current) => current || ticketList[0]?._id || "");
      if (ticketList[0]) {
        setChatMessages(ticketList[0].conversation?.length ? ticketList[0].conversation.map((message) => ({ role: message.role || message.sender || "customer", text: message.text || message.message, time: message.time || "Now", status: message.role === "agent" ? "Responded" : "Sent" })) : [{ role: "customer", text: ticketList[0].description, time: formatTime(), status: "Received" }]);
      }
    } catch {
      setError("Unable to load workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWorkspace(); }, []);

  useEffect(() => {
    if (!isProcessing) return undefined;
    logPollRef.current = setInterval(async () => {
      const response = await getLogs().catch(() => null);
      const logs = response?.data?.data || [];
      setLiveLogs(logs);
    }, 600);
    return () => clearInterval(logPollRef.current);
  }, [isProcessing]);

  useEffect(() => {
    return () => {
      if (logTimerRef.current) clearTimeout(logTimerRef.current);
      if (logPollRef.current) clearInterval(logPollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedTicket) return;
    setChatMessages(selectedTicket.conversation?.length ? selectedTicket.conversation.map((message) => ({ role: message.role || message.sender || "customer", text: message.text || message.message, time: message.time || "Now", status: message.role === "agent" ? "Responded" : "Sent" })) : [{ role: "customer", text: selectedTicket.description, time: formatTime(), status: "Received" }]);
  }, [selectedTicketId]);

  const updatePipelineStep = (index, patch) => {
    setPipeline((current) => current.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  };

  const appendActivity = (text) => setLiveLogs((current) => [{ timestamp: new Date().toISOString(), message: text }, ...current].slice(0, 20));

  const handleDemo = (message) => setDraft(message);

  const handleTicketSelect = (ticketId) => setSelectedTicketId(ticketId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;

    setError("");
    setIsProcessing(true);
    setAiResult(null);
    setPipeline(pipelineTemplate.map((step) => ({ ...step, status: "Waiting", output: "" })));
    appendActivity(`${formatTime()} Ticket Received`);

    const customerId = selectedCustomerId;
    let ticketRecord = null;

    try {
      const scenarioLabel = draft.toLowerCase().includes("refund") ? "Refund Request" : draft.toLowerCase().includes("delay") ? "Order Delayed" : draft.toLowerCase().includes("locked") ? "Account Locked" : draft.toLowerCase().includes("cancel") ? "Subscription Cancellation" : draft.toLowerCase().includes("wrong") ? "Wrong Product Delivered" : "Payment Failed";
      const baseCustomer = customers.find((customer) => customer._id === customerId) || customers[0];
      ticketRecord = await createTicket({
        customer: customerId,
        title: scenarioLabel,
        description: draft,
        category: scenarioLabel === "Account Locked" ? "technical" : scenarioLabel === "Subscription Cancellation" ? "retention" : "billing",
        priority: scenarioLabel === "Payment Failed" || scenarioLabel === "Refund Request" ? "high" : "medium",
        status: "open",
        assignedAgent: "AI Agent",
        conversation: [{ role: "customer", text: draft, time: formatTime() }],
      }).then((response) => response.data.data);
      setTickets((current) => [ticketRecord, ...current.filter((ticket) => ticket._id !== ticketRecord._id)]);
      setSelectedTicketId(ticketRecord._id);
      setChatMessages([{ role: "customer", text: draft, time: formatTime(), status: "Sent" }]);
      setDraft("");
      setPipeline((current) => current.map((step, index) => ({ ...step, status: index === 0 ? "Running" : "Waiting" })));

      const response = await processAI({ customerId, message: draft });
      const data = response?.data?.data || {};
      setAiResult(data);

      updatePipelineStep(0, { status: "Done", output: `${data.intent?.intent || "payment_issue"} • ${Math.round((Number(data.intent?.confidence || data.confidence || 0) * 100)) || 98}%` });
      appendActivity(`${formatTime()} Intent detected`);
      await new Promise((resolve) => setTimeout(resolve, 350));
      updatePipelineStep(1, { status: "Done", output: `${data.sentiment?.sentiment || "frustrated"} • ${Math.round((Number(data.sentiment?.score || data.sentiment?.confidence * 100 || 92))) || 92}%` });
      appendActivity(`${formatTime()} Sentiment analyzed`);
      await new Promise((resolve) => setTimeout(resolve, 350));
      updatePipelineStep(2, { status: "Done", output: `${data.customer?.customer?.name || baseCustomer?.name || "Customer"} • ${data.customer?.tier || baseCustomer?.tier || "Premium"}` });
      appendActivity(`${formatTime()} Customer profile fetched`);
      await new Promise((resolve) => setTimeout(resolve, 350));
      updatePipelineStep(3, { status: "Done", output: `${data.knowledge?.relevantPolicies?.length || 0} articles matched` });
      appendActivity(`${formatTime()} Knowledge retrieved`);
      await new Promise((resolve) => setTimeout(resolve, 450));
      updatePipelineStep(4, { status: "Done", output: data.resolution?.source === "openai" ? "OpenAI response generated" : "Fallback response generated" });
      appendActivity(`${formatTime()} AI response generated`);
      await new Promise((resolve) => setTimeout(resolve, 300));
      updatePipelineStep(5, { status: "Done", output: data.escalation?.status || (data.escalation?.escalate ? "Escalate" : "Resolved") });
      appendActivity(`${formatTime()} Ticket ${data.escalation?.escalate ? "escalated" : "resolved"}`);

      const updatedTicket = await updateTicket(ticketRecord._id, {
        intent: data.intent?.intent,
        sentiment: data.sentiment?.sentiment,
        aiResponse: data.resolution?.response,
        escalationStatus: data.escalation?.status || (data.escalation?.escalate ? "Escalate" : "Resolved"),
        escalationReason: data.escalation?.reason,
        resolutionTimeMs: data.processingTime,
        resolvedAt: new Date().toISOString(),
        status: data.escalation?.escalate ? "pending" : "resolved",
        conversation: [
          { role: "customer", text: draft, time: formatTime() },
          { role: "agent", text: data.resolution?.response, time: formatTime() },
        ],
      }).then((response) => response.data.data);

      setTickets((current) => [updatedTicket, ...current.filter((ticket) => ticket._id !== updatedTicket._id)]);
      setChatMessages([
        { role: "customer", text: draft, time: formatTime(), status: "Sent" },
        { role: "ai", text: data.resolution?.response || "We’re reviewing your request.", time: formatTime(), status: data.escalation?.escalate ? "Escalated" : "Resolved" },
      ]);
      const refreshedLogs = await getLogs().catch(() => null);
      setLiveLogs(refreshedLogs?.data?.data || []);
      setTimeout(() => loadWorkspace(), 400);
    } catch (err) {
      const message = err?.response?.data?.message || "The AI workflow could not be completed.";
      setError(message);
      setChatMessages((current) => [...current, { role: "ai", text: message, time: formatTime(), status: "Error" }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => { clearAuthToken(); navigate("/login", { replace: true }); };

  return (
    <div className="min-h-screen bg-[#030712] px-3 py-3 text-white sm:px-4 lg:px-5 lg:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <aside className="hidden w-72 flex-col justify-between border-r border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.23),_transparent_35%),linear-gradient(145deg,_rgba(6,10,24,0.98),_rgba(1,4,12,0.98))] p-6 lg:flex">
          <div>
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-400 shadow-lg shadow-blue-500/20"><Sparkles className="h-5 w-5 text-white" /></div><div><p className="text-sm tracking-[0.28em] text-slate-400">RESOLVEAI</p><p className="text-lg font-semibold text-white">Console</p></div></div>
            <nav className="mt-8 space-y-2">{sidebarItems.map((item) => { const Icon = item.icon; return <button key={item.label} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${item.active ? "border border-blue-400/25 bg-blue-500/15 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</nav>
          </div>
          <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600"><Bot className="h-5 w-5 text-white" /></div><div><p className="text-sm font-semibold text-white">Ops</p><p className="text-xs text-slate-400">Support Lead</p></div></div><button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"><LogOut className="h-4 w-4" />Logout</button></div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-white/10 bg-slate-950/70 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-xl"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" placeholder="Search workspace context" /></div>
              <div className="flex flex-wrap items-center gap-3"><div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300"><div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-300" />{currentTime}</div></div><button className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white"><Bell className="h-4 w-4" /></button><button className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white"><Moon className="h-4 w-4" /></button><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 font-semibold">O</div><div><p className="text-sm font-medium text-white">Operations</p><p className="text-xs text-slate-400">Supervisor</p></div></div></div>
            </div>
          </header>

          <main className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.05fr_1.15fr_0.9fr] lg:p-8">
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Customer Tickets</p><h2 className="mt-1 text-xl font-semibold text-white">Live queue</h2></div><div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300"><Users className="h-4 w-4" /></div></div>
              <div className="mt-5 space-y-3">
                {tickets.map((ticket) => <button key={ticket._id} onClick={() => handleTicketSelect(ticket._id)} className={`w-full rounded-[1.2rem] border p-3 text-left transition ${selectedTicket?._id === ticket._id ? "border-blue-400/40 bg-blue-500/10" : "border-white/10 bg-slate-950/70 hover:bg-white/5"}`}><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">{ticket.customer?.name || "Customer"}</p><p className="text-xs text-slate-400">{ticket.intent || ticket.category || "support"}</p></div><span className={`rounded-full px-2 py-1 text-[11px] font-medium ${ticket.priority === "urgent" || ticket.priority === "high" ? "bg-rose-500/15 text-rose-300" : "bg-amber-500/15 text-amber-300"}`}>{ticket.priority || "medium"}</span></div><div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>{ticket.status}</span><span>{new Date(ticket.updatedAt || ticket.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></div></button>)}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-slate-400">AI Conversation</p><h2 className="mt-1 text-xl font-semibold text-white">Customer and ResolveAI</h2><p className="mt-2 text-sm text-slate-400">{selectedTicket?.description || "Type a customer issue to start the workflow."}</p></div><div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">Secure session</div></div>
              <div className="mt-5 space-y-3 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">{chatMessages.map((message, index) => <motion.div key={`${message.time}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.04 }} className={`flex ${message.role === "customer" ? "justify-start" : "justify-end"}`}><div className={`max-w-[85%] rounded-[1.25rem] border px-4 py-3 ${message.role === "customer" ? "border-white/10 bg-white/5" : "border-blue-400/20 bg-gradient-to-br from-blue-600/20 to-violet-600/20"}`}><p className="text-sm leading-6 text-slate-100">{message.text}</p><div className="mt-2 flex items-center gap-2 text-xs text-slate-400"><span>{message.time}</span><span>•</span><span>{message.status}</span></div></div></motion.div>)}{isProcessing ? <TypingIndicator /> : null}</div>
              {error ? <div className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div> : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{demoScenarios.map((scenario) => <button key={scenario} type="button" onClick={() => handleDemo(scenario)} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/10">{scenario}</button>)}</div>
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row"><div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3"><Paperclip className="h-4 w-4 text-slate-400" /><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Send a message to the multi-agent workflow" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" /></div><div className="flex gap-2"><button type="button" className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"><Mic className="h-4 w-4" /></button><button type="submit" disabled={isProcessing || !draft.trim()} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">{isProcessing ? "Processing" : "Send"}<ArrowUp className="h-4 w-4" /></button></div></form>
            </motion.section>

            <div className="space-y-6">
              <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">AI Workflow</p><h2 className="mt-1 text-xl font-semibold text-white">Live execution</h2></div><div className="rounded-full border border-violet-400/20 bg-violet-500/10 p-2 text-violet-300"><ShieldCheck className="h-4 w-4" /></div></div><div className="mt-5 space-y-3">{pipeline.map((step, index) => <div key={step.title} className={`rounded-[1.15rem] border p-3 ${step.status === "Done" ? "border-emerald-400/20 bg-emerald-500/10" : index === 0 && isProcessing ? "border-blue-400/40 bg-blue-500/10" : "border-white/10 bg-slate-950/70"}`}><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">{step.title}</p>{step.status === "Done" ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : isProcessing && index === pipeline.findIndex((item) => item.status === "Running") ? <div className="h-3 w-3 animate-pulse rounded-full bg-blue-400" /> : <div className="h-3 w-3 rounded-full bg-slate-600" />}</div><p className="mt-2 text-xs text-slate-400">{step.status}</p><p className="mt-1 text-xs text-cyan-300">{step.output || step.detail}</p></div>)}</div></motion.section>

              <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.14 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Activity Log</p><h2 className="mt-1 text-xl font-semibold text-white">Live console</h2></div><Activity className="h-4 w-4 text-cyan-300" /></div><div className="mt-5 max-h-96 space-y-3 overflow-auto pr-1">{liveLogs.slice(0, 10).map((log, index) => <div key={`${log.timestamp || index}-${index}`} className="rounded-[1.1rem] border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300"><div className="flex items-center justify-between"><span className="font-medium text-white">{log.message || log.step || log.workflowId || "Event"}</span><span className="text-xs text-slate-400">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "Live"}</span></div><p className="mt-1 text-xs text-slate-400">{log.detail || log.status || "Workflow update"}</p></div>)}</div></motion.section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
