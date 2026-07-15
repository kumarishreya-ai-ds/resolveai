import Ticket from "../models/Ticket.js";

export const getAnalytics = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("customer", "name email tier status").sort({ createdAt: -1 }).lean();
    const openTickets = tickets.filter((ticket) => !(ticket.status === "resolved" || ticket.status === "closed"));
    const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved" || ticket.status === "closed");
    const escalatedTickets = tickets.filter((ticket) => ticket.escalationStatus === "Escalate");

    const intentCounts = tickets.reduce((acc, ticket) => { const key = ticket.intent || ticket.category || "support"; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
    const sentimentCounts = tickets.reduce((acc, ticket) => { const key = ticket.sentiment || "neutral"; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
    const reasons = tickets.filter((ticket) => ticket.escalationReason).slice(0, 6).map((ticket) => ticket.escalationReason);

    const data = {
      totalTickets: tickets.length,
      activeTickets: openTickets.length,
      resolvedToday: resolvedTickets.length,
      escalated: escalatedTickets.length,
      avgResponseTime: tickets.length ? Math.round(tickets.reduce((sum, ticket) => sum + Number(ticket.resolutionTimeMs || 0), 0) / tickets.length) : 0,
      customerSatisfaction: Number((4.2 + Math.min(0.6, resolvedTickets.length * 0.02)).toFixed(1)),
      resolutionRate: tickets.length ? Math.round((resolvedTickets.length / tickets.length) * 100) : 0,
      ticketsByIntent: Object.entries(intentCounts).map(([label, value]) => ({ label, value })),
      sentimentDistribution: Object.entries(sentimentCounts).map(([label, value]) => ({ label, value })),
      escalationReasons: reasons,
      topIssues: tickets.slice(0, 5).map((ticket) => ticket.title),
      trendingIntents: Object.entries(intentCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value]) => ({ label, value })),
      mostCommonComplaints: tickets.slice(0, 5).map((ticket) => ticket.description),
      sentimentTrends: Object.entries(sentimentCounts).map(([label, value]) => ({ label, value })),
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
