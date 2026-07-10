import Customer from "../../models/Customer.js";
import Ticket from "../../models/Ticket.js";

class CustomerProfileAgent {
  async run(customerId) {
    const start = Date.now();

    try {
      const customer = await Customer.findById(customerId).lean();
      const previousTickets = await Ticket.find({ customer: customerId }).sort({ createdAt: -1 }).lean();

      const result = {
        customer,
        previousTickets,
        plan: customer?.plan || "basic",
        tier: customer?.tier || "standard",
        history: previousTickets.map((ticket) => ({
          id: ticket.ticketId,
          title: ticket.title,
          status: ticket.status,
          priority: ticket.priority,
        })),
      };

      return {
        name: "CustomerProfileAgent",
        durationMs: Date.now() - start,
        output: result,
      };
    } catch (error) {
      return {
        name: "CustomerProfileAgent",
        durationMs: Date.now() - start,
        output: {
          customer: null,
          previousTickets: [],
          plan: "basic",
          tier: "standard",
          history: [],
          error: error.message,
        },
      };
    }
  }
}

export default CustomerProfileAgent;
