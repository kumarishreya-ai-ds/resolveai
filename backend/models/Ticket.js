import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    title: { type: String, required: [true, "Ticket title is required"], trim: true },
    description: { type: String, required: [true, "Ticket description is required"], trim: true },
    category: { type: String, enum: ["billing", "technical", "support", "retention"], default: "support" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    status: { type: String, enum: ["open", "pending", "resolved", "closed"], default: "open" },
    assignedAgent: { type: String, trim: true, default: "Unassigned" },
    intent: { type: String, trim: true },
    sentiment: { type: String, trim: true },
    aiResponse: { type: String, trim: true },
    escalationStatus: { type: String, enum: ["Resolved", "Escalate"], default: "Resolved" },
    escalationReason: { type: String, trim: true },
    resolutionTimeMs: { type: Number, default: 0 },
    resolvedAt: { type: Date },
    lastActivityAt: { type: Date, default: Date.now },
    conversation: [{ role: { type: String, enum: ["customer", "agent", "system"], default: "customer" }, text: { type: String, trim: true }, time: { type: String, trim: true } }],
    explanation: {
      intent: { type: String, trim: true },
      sentiment: { type: String, trim: true },
      knowledge: { type: String, trim: true },
      resolution: { type: String, trim: true },
      escalation: { type: String, trim: true },
    },
    humanReview: {
      required: { type: Boolean, default: false },
      status: { type: String, enum: ["Pending", "Approved", "Edited", "Rejected"], default: "Pending" },
      finalAction: { type: String, enum: ["Approve AI response", "Edit AI response", "Reject AI response", "None"], default: "None" },
      reason: { type: String, trim: true },
      originalResponse: { type: String, trim: true },
      editedResponse: { type: String, trim: true },
      difference: { type: String, trim: true },
      reviewedAt: { type: Date },
      reviewedBy: { type: String, trim: true },
    },
    satisfactionPrediction: {
      label: { type: String, enum: ["Very Happy", "Satisfied", "Neutral", "Unsatisfied", "Very Angry"], default: "Neutral" },
      confidence: { type: Number, default: 0 },
    },
    rootCause: {
      primaryCause: { type: String, trim: true },
      secondaryCause: { type: String, trim: true },
      businessCategory: { type: String, trim: true },
      resolutionCategory: { type: String, trim: true },
    },
    executiveSummary: { type: Object, default: null },
    smartRecommendations: [{ type: String }],
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
