import { callGemini } from "./geminiHelper.js";

class EscalationAgent {
  async run({ intent, sentiment, customer, knowledge, resolution }) {
    const start = Date.now();
    const prompt = `Determine whether this request should be escalated. Return ONLY valid JSON with keys: escalate, reason, priority. Use the context: intent=${intent?.intent || "support"}, sentiment=${sentiment?.sentiment || "neutral"}, customerPlan=${customer?.plan || "basic"}, customerTier=${customer?.tier || "standard"}, knowledge=${JSON.stringify(knowledge || {})}, resolution=${resolution?.response || ""}.`;

    const result = await callGemini(prompt, () => ({
      escalate: false,
      reason: "No immediate escalation needed.",
      priority: "medium",
    }));

    return {
      name: "EscalationAgent",
      durationMs: Date.now() - start,
      output: result,
    };
  }
}

export default EscalationAgent;
