import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";
import Customer from "./models/Customer.js";
import Ticket from "./models/Ticket.js";
import Conversation from "./models/Conversation.js";
import { ingestDocumentBuffer } from "./services/knowledgeRag.js";
import { getKnowledgeStore } from "./services/knowledgeStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
connectDB();

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean);
const corsOptions = { origin: (origin, callback) => { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error("Not allowed by CORS")); }, credentials: true };
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/knowledge", knowledgeRoutes);

const seedKnowledgeBase = async () => {
  const store = getKnowledgeStore();
  if (store.documents.length > 0) return;

  const seedFiles = [
    { name: "RefundPolicy.md", file: path.join(__dirname, "data", "refund-policy.md") },
    { name: "ShippingPolicy.md", file: path.join(__dirname, "data", "shipping-policy.md") },
    { name: "MembershipPolicy.md", file: path.join(__dirname, "data", "membership-policy.md") },
    { name: "CancellationPolicy.md", file: path.join(__dirname, "data", "cancellation-policy.md") },
  ];

  for (const item of seedFiles) {
    const buffer = fs.readFileSync(item.file);
    await ingestDocumentBuffer({ originalName: item.name, mimeType: "text/markdown", buffer, uploadedBy: "system" });
  }
};

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
    await seedKnowledgeBase();
  } catch (error) {
    console.error("Seed data error:", error.message);
  }
};

app.get("/", (req, res) => res.json({ success: true, message: "ResolveAI Backend Running 🚀" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => { if (mongoose.connection.readyState === 1) { await seedData(); } else { console.warn("Skipping seed data because MongoDB is not connected."); } console.log(`Server running on port ${PORT}`); });



