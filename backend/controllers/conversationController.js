import Conversation from "../models/Conversation.js";
import Ticket from "../models/Ticket.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().populate("ticket", "ticketId title status").sort({ timestamp: 1 });
    res.json({ success: true, count: conversations.length, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { ticket, sender, message, timestamp } = req.body;

    const existingTicket = await Ticket.findById(ticket);
    if (!existingTicket) {
      return res.status(400).json({ success: false, message: "Ticket not found" });
    }

    const conversation = await Conversation.create({ ticket, sender, message, timestamp });
    const populatedConversation = await Conversation.findById(conversation._id).populate("ticket", "ticketId title status");
    res.status(201).json({ success: true, data: populatedConversation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
