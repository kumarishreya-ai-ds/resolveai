import Customer from "../models/Customer.js";
import Ticket from "../models/Ticket.js";
import Conversation from "../models/Conversation.js";

const demoCustomers = [
  { name: "Aisha Patel", email: "aisha@northwind.io", phone: "+1-555-0101", company: "Northwind", plan: "pro", tier: "premium", status: "active" },
  { name: "Marcus Chen", email: "marcus@contoso.com", phone: "+1-555-0102", company: "Contoso", plan: "enterprise", tier: "vip", status: "active" },
  { name: "Elena Gomez", email: "elena@fabrikam.com", phone: "+1-555-0103", company: "Fabrikam", plan: "pro", tier: "standard", status: "active" },
  { name: "Jordan Lee", email: "jordan@woodgrove.io", phone: "+1-555-0104", company: "Woodgrove", plan: "basic", tier: "standard", status: "pending" },
  { name: "Priya Shah", email: "priya@adatum.com", phone: "+1-555-0105", company: "Adatum", plan: "enterprise", tier: "vip", status: "active" },
];

const demoTickets = [
  { ticketId: "TK-1001", customerEmail: "aisha@northwind.io", title: "Billing discrepancy", description: "Invoice amount does not match the plan upgrade.", category: "billing", priority: "high", status: "open", assignedAgent: "Maya", conversation: [{ role: "customer", text: "I noticed the invoice total is higher than expected.", time: "09:10 AM" }, { role: "agent", text: "I’m reviewing the billing update and will confirm shortly.", time: "09:12 AM" }] },
  { ticketId: "TK-1002", customerEmail: "marcus@contoso.com", title: "Login issue", description: "Customer cannot access the dashboard after reset.", category: "technical", priority: "urgent", status: "pending", assignedAgent: "Jordan", conversation: [{ role: "customer", text: "The password reset email did not arrive.", time: "10:05 AM" }] },
  { ticketId: "TK-1003", customerEmail: "elena@fabrikam.com", title: "Order delayed", description: "Shipment has not moved in 5 days.", category: "support", priority: "medium", status: "open", assignedAgent: "AI Agent", conversation: [{ role: "customer", text: "My shipment has not moved in five days.", time: "11:20 AM" }] },
  { ticketId: "TK-1004", customerEmail: "jordan@woodgrove.io", title: "Subscription cancellation", description: "User wants to cancel immediately.", category: "retention", priority: "medium", status: "pending", assignedAgent: "Maya", conversation: [{ role: "customer", text: "I want to cancel my subscription immediately.", time: "01:40 PM" }] },
  { ticketId: "TK-1005", customerEmail: "priya@adatum.com", title: "Refund request", description: "Duplicate charge detected on monthly invoice.", category: "billing", priority: "high", status: "open", assignedAgent: "Jordan", conversation: [{ role: "customer", text: "I was charged twice for the same invoice.", time: "02:15 PM" }] },
];

export async function seedDatabase() {
  const existingCustomers = await Customer.countDocuments();
  const createdCustomers = [];

  if (existingCustomers === 0) {
    const insertedCustomers = await Customer.insertMany(demoCustomers, { ordered: true });
    createdCustomers.push(...insertedCustomers);
  }

  const customerMap = new Map();
  const customers = await Customer.find().sort({ createdAt: 1 }).lean();
  for (const customer of customers) customerMap.set(customer.email, customer);

  const existingTicketIds = new Set((await Ticket.find({}, { ticketId: 1 }).lean()).map((ticket) => ticket.ticketId));
  const insertedTicketIds = [];

  for (const ticket of demoTickets) {
    if (existingTicketIds.has(ticket.ticketId)) continue;
    const customer = customerMap.get(ticket.customerEmail);
    if (!customer) continue;
    const createdTicket = await Ticket.create({
      ticketId: ticket.ticketId,
      customer: customer._id,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      assignedAgent: ticket.assignedAgent,
      lastActivityAt: new Date(),
      conversation: ticket.conversation,
    });
    insertedTicketIds.push(createdTicket._id);
  }

  const tickets = await Ticket.find().sort({ createdAt: 1 }).lean();
  const ticketMap = new Map();
  for (const ticket of tickets) ticketMap.set(ticket.ticketId, ticket);

  const conversationSeeds = [
    { ticketId: "TK-1001", sender: "customer", message: "I noticed the invoice total is higher than expected." },
    { ticketId: "TK-1001", sender: "agent", message: "I’m reviewing the billing update and will confirm shortly." },
    { ticketId: "TK-1002", sender: "customer", message: "The password reset email did not arrive." },
    { ticketId: "TK-1003", sender: "customer", message: "My shipment has not moved in five days." },
    { ticketId: "TK-1004", sender: "customer", message: "I want to cancel my subscription immediately." },
    { ticketId: "TK-1005", sender: "customer", message: "I was charged twice for the same invoice." },
  ];

  const existingConversations = await Conversation.find().lean();
  const existingConversationKeys = new Set(existingConversations.map((entry) => `${entry.ticket?.toString() || entry.ticketId || ""}:${entry.sender}:${entry.message}`));

  const conversationDocs = [];
  for (const item of conversationSeeds) {
    const ticket = ticketMap.get(item.ticketId);
    if (!ticket) continue;
    const key = `${ticket._id.toString()}:${item.sender}:${item.message}`;
    if (existingConversationKeys.has(key)) continue;
    conversationDocs.push({ ticket: ticket._id, sender: item.sender, message: item.message });
  }

  if (conversationDocs.length > 0) {
    await Conversation.insertMany(conversationDocs, { ordered: true });
  }

  return {
    customersInserted: createdCustomers.length,
    ticketsInserted: insertedTicketIds.length,
    conversationsInserted: conversationDocs.length,
  };
}

export async function getFirstCustomerId() {
  const customer = await Customer.findOne().sort({ createdAt: 1 }).select("_id").lean();
  return customer?._id || null;
}
