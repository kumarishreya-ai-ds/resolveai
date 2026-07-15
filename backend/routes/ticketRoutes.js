import express from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.get("/", getTickets);
router.post("/", createTicket);
router.get("/analytics", (req, res) => {
  res.json({
    success: true,
    data: {
      totalTickets: 18,
      activeTickets: 5,
      resolvedToday: 9,
      escalated: 2,
      avgResponseTime: 42,
      customerSatisfaction: 4.8,
      ticketsByIntent: [
        { label: "Payment Failed", value: 6 },
        { label: "Refund", value: 4 },
        { label: "Shipping", value: 5 },
        { label: "Account", value: 3 },
      ],
      sentimentDistribution: [
        { label: "Positive", value: 9 },
        { label: "Neutral", value: 5 },
        { label: "Negative", value: 4 },
      ],
      resolutionRate: [
        { label: "Resolved", value: 15 },
        { label: "Escalated", value: 3 },
      ],
      hourlyRequests: [
        { label: "09", value: 2 },
        { label: "10", value: 4 },
        { label: "11", value: 5 },
        { label: "12", value: 7 },
      ],
    },
  });
});
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
