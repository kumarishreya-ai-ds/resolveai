import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import Customer from "./models/Customer.js";
import Ticket from "./models/Ticket.js";
import Conversation from "./models/Conversation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);

const seedData = async () => {
  try {
    const customerCount = await Customer.countDocuments();
    if (customerCount === 0) {
      const customers = await Customer.insertMany([
        { name: "Aisha Patel", email: "aisha@northwind.io", phone: "+1-555-0101", company: "Northwind", plan: "pro", tier: "premium", status: "active" },
        { name: "Marcus Chen", email: "marcus@contoso.com", phone: "+1-555-0102", company: "Contoso", plan: "enterprise", tier: "vip", status: "active" },
        { name: "Elena Gomez", email: "elena@fabrikam.com", phone: "+1-555-0103", company: "Fabrikam", plan: "pro", tier: "standard", status: "active" },
      ]);

      const tickets = await Ticket.insertMany([
        { ticketId: "TK-1001", customer: customers[0]._id, title: "Billing discrepancy", description: "Invoice amount does not match the plan upgrade.", category: "billing", priority: "high", status: "open", assignedAgent: "Maya" },
        { ticketId: "TK-1002", customer: customers[1]._id, title: "Login issue", description: "Customer cannot access the dashboard after reset.", category: "technical", priority: "urgent", status: "pending", assignedAgent: "Jordan" },
        { ticketId: "TK-1003", customer: customers[2]._id, title: "Order delayed", description: "Shipment has not moved in 5 days.", category: "support", priority: "medium", status: "open", assignedAgent: "AI Agent" },
      ]);

      await Conversation.insertMany([
        { ticket: tickets[0]._id, sender: "customer", message: "I noticed the invoice total is higher than expected." },
        { ticket: tickets[0]._id, sender: "agent", message: "I’m reviewing the billing update and will confirm shortly." },
        { ticket: tickets[1]._id, sender: "customer", message: "The password reset email did not arrive." },
      ]);
    }
  } catch (error) {
    console.error("Seed data error:", error.message);
  }
};

app.get("/", (req, res) => res.json({ success: true, message: "ResolveAI Backend Running 🚀" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => { await seedData(); console.log(`Server running on http://localhost:${PORT}`); });
