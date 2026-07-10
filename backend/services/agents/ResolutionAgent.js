import { callGemini } from "./geminiHelper.js";

class ResolutionAgent {
  async run({ intent, sentiment, customer, knowledge }) {
    const start = Date.now();
    const prompt = `You are a customer support assistant. Write a concise, professional response for a customer. Use the customer's plan and tier when helpful. Context: intent=${intent?.intent || "support"}, sentiment=${sentiment?.sentiment || "neutral"}, customer=${customer?.customer?.name || "customer"}, plan=${customer?.plan || "basic"}, tier=${customer?.tier || "standard"}, knowledge=${JSON.stringify(knowledge || {})}. Return ONLY valid JSON with key: response.`;

    const result = await callGemini(prompt, () => ({
      response: "Thanks for reaching out. We are reviewing your request and will help you as quickly as possible.",
    }));

    return {
      name: "ResolutionAgent",
      durationMs: Date.now() - start,
      output: result,
    };
  }
}

export default ResolutionAgent;
