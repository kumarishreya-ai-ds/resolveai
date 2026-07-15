import { pickScenario } from "./IntentAgent.js";

class EscalationAgent {
  async run({ intent, sentiment, customer, knowledge, resolution, message = "" }) {
    const start = Date.now();
    const scenario = pickScenario(message);
    const confidence = Number(intent?.confidence || scenario.confidence || 0);
    const sentimentScore = Number(sentiment?.score || sentiment?.confidence * 100 || scenario.sentiment.score || 0);
    const shouldEscalate = Boolean(scenario.escalation || confidence < 0.85 || sentimentScore < 75 || /locked|refund|wrong|cancel/i.test(intent?.intent || ""));

    return {
      name: "EscalationAgent",
      durationMs: Date.now() - start,
      output: {
        escalate: shouldEscalate,
        status: shouldEscalate ? "Escalate" : "Resolved",
        priority: shouldEscalate ? "high" : "low",
        reason: shouldEscalate
          ? `The issue needs human review because the scenario is ${intent?.intent || scenario.intent}, sentiment is ${sentiment?.sentiment || scenario.sentiment.sentiment}, and the case may affect customer trust.`
          : `The case is within policy limits and the response is likely sufficient for ${customer?.tier || scenario.knowledgeKey} support.`,
      },
    };
  }
}

export default EscalationAgent;
