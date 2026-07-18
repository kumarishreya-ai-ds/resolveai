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
import { seedDatabase } from "./services/seedDatabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

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

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/auth", authRoutes);
  app.use("/api/customers", customerRoutes);
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/conversations", conversationRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/knowledge", knowledgeRoutes);

  app.get("/", (req, res) => res.json({ success: true, message: "ResolveAI Backend Running 🚀" }));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await seedDatabase();
        await seedKnowledgeBase();
      } else {
        console.warn("Skipping seed data because MongoDB is not connected.");
      }
      console.log(`Server running on port ${PORT}`);
    } catch (error) {
      console.error("Seed data error:", error.message);
      console.log(`Server running on port ${PORT}`);
    }
  });
};

startServer().catch((error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});
