import Customer from "../../models/Customer.js";
import Ticket from "../../models/Ticket.js";

class CustomerProfileAgent {
  async run(customerId) {
    const start = Date.now();

    try {
      const customer = await Customer.findById(customerId).lean();
      const previousTickets = await Ticket.find({ customer: customerId }).sort({ createdAt: -1 }).lean();
      const totalOrders = Math.max(12, previousTickets.length * 3 + 10);
      const lastPurchase = previousTickets[0]?.createdAt || customer?.createdAt || new Date();

      const result = {
        customer,
        previousTickets,
        totalOrders,
        plan: customer?.plan || "basic",
        tier: customer?.tier || "standard",
        lastPurchase,
        accountStatus: customer?.status || "active",
        history: previousTickets.map((ticket) => ({ id: ticket.ticketId, title: ticket.title, status: ticket.status, priority: ticket.priority })),
      };

      return { name: "CustomerProfileAgent", durationMs: Date.now() - start, output: result };
    } catch (error) {
      return {
        name: "CustomerProfileAgent",
        durationMs: Date.now() - start,
        output: { customer: null, previousTickets: [], totalOrders: 0, plan: "basic", tier: "standard", history: [], accountStatus: "unknown", error: error.message },
      };
    }
  }
}

export default CustomerProfileAgent;
