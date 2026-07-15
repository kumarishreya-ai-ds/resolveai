import { callGemini } from "./geminiHelper.js";

const SCENARIOS = [
  {
    keywords: ["payment", "deducted", "charged", "failed", "billing"],
    intent: "payment_issue",
    confidence: 0.98,
    sentiment: { sentiment: "frustrated", emotion: "frustrated", confidence: 0.92, score: 92 },
    knowledgeKey: "billing",
    escalation: false,
  },
  {
    keywords: ["refund", "return", "money back"],
    intent: "refund_request",
    confidence: 0.96,
    sentiment: { sentiment: "frustrated", emotion: "impatient", confidence: 0.9, score: 90 },
    knowledgeKey: "billing",
    escalation: true,
  },
  {
    keywords: ["delayed", "late", "shipping", "stuck", "not arrived"],
    intent: "order_delay",
    confidence: 0.95,
    sentiment: { sentiment: "concerned", emotion: "concerned", confidence: 0.84, score: 84 },
    knowledgeKey: "shipping",
    escalation: false,
  },
  {
    keywords: ["locked", "cannot login", "login", "access"],
    intent: "account_locked",
    confidence: 0.97,
    sentiment: { sentiment: "anxious", emotion: "stressed", confidence: 0.87, score: 87 },
    knowledgeKey: "technical",
    escalation: false,
  },
  {
    keywords: ["subscription", "cancel", "renewal", "plan"],
    intent: "subscription_cancellation",
    confidence: 0.93,
    sentiment: { sentiment: "frustrated", emotion: "disappointed", confidence: 0.89, score: 89 },
    knowledgeKey: "retention",
    escalation: true,
  },
  {
    keywords: ["wrong product", "incorrect", "delivered", "item"],
    intent: "wrong_delivery",
    confidence: 0.96,
    sentiment: { sentiment: "frustrated", emotion: "annoyed", confidence: 0.91, score: 91 },
    knowledgeKey: "shipping",
    escalation: true,
  },
];

const normalize = (message = "") => message.toLowerCase();

const pickScenario = (message = "") => {
  const text = normalize(message);
  return SCENARIOS.find((scenario) => scenario.keywords.some((keyword) => text.includes(keyword))) || {
    intent: "support_request",
    confidence: 0.82,
    sentiment: { sentiment: "neutral", emotion: "calm", confidence: 0.7, score: 70 },
    knowledgeKey: "support",
    escalation: false,
  };
};

class IntentAgent {
  async run(message) {
    const start = Date.now();
    const scenario = pickScenario(message);
    const result = await callGemini(
      `Classify the customer's intent from this message. Return ONLY valid JSON with keys: intent, confidence. Example: {"intent":"billing","confidence":0.92}. Message: ${message}`,
      () => ({ intent: scenario.intent, confidence: scenario.confidence })
    );

    return { name: "IntentAgent", durationMs: Date.now() - start, output: result };
  }
}

export { pickScenario };
export default IntentAgent;
