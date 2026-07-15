import Customer from "../models/Customer.js";
import Ticket from "../models/Ticket.js";

const generateTicketId = () => `TK-${Date.now()}`;

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("customer", "name email company membership tier status").sort({ lastActivityAt: -1, createdAt: -1 });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { customer, title, description, category, priority, status, assignedAgent, intent, sentiment, aiResponse, escalationStatus, escalationReason, resolutionTimeMs, resolvedAt, conversation } = req.body;

    if (customer) {
      const existingCustomer = await Customer.findById(customer);
      if (!existingCustomer) return res.status(400).json({ success: false, message: "Customer not found" });
    }

    const ticket = await Ticket.create({
      ticketId: req.body.ticketId || generateTicketId(),
      customer,
      title,
      description,
      category,
      priority,
      status,
      assignedAgent,
      intent,
      sentiment,
      aiResponse,
      escalationStatus,
      escalationReason,
      resolutionTimeMs,
      resolvedAt,
      lastActivityAt: new Date(),
      conversation,
    });

    const populatedTicket = await Ticket.findById(ticket._id).populate("customer", "name email company membership tier status");
    res.status(201).json({ success: true, data: populatedTicket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("customer", "name email company membership tier status");
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    if (req.body.customer) {
      const existingCustomer = await Customer.findById(req.body.customer);
      if (!existingCustomer) return res.status(400).json({ success: false, message: "Customer not found" });
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { ...req.body, lastActivityAt: new Date() }, { new: true, runValidators: true }).populate("customer", "name email company membership tier status");
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
