import { pickScenario } from "./IntentAgent.js";

const knowledgeMap = {
  billing: {
    policies: ["Payments are captured after order confirmation.", "Refunds for failed payments are auto-reversed within 3-5 business days."],
    actions: ["Check gateway status", "Verify captured order ID", "Offer refund timeline"],
  },
  shipping: {
    policies: ["Delivery updates refresh every 24 hours.", "Wrong item claims require photo verification."],
    actions: ["Check courier scan", "Confirm fulfillment record", "Offer replacement workflow"],
  },
  technical: {
    policies: ["Locked accounts can be restored after identity verification.", "Password resets expire after 15 minutes."],
    actions: ["Trigger reset link", "Validate login activity", "Escalate if suspicious"],
  },
  retention: {
    policies: ["Cancellation requests should confirm billing cycle impact.", "Retention offers may be applied before closure."],
    actions: ["Review plan usage", "Offer downgrade options", "Queue retention specialist"],
  },
  support: {
    policies: ["General support requests should receive an acknowledgment within one response.", "Case notes must be summarized before closing."],
    actions: ["Acknowledge issue", "Summarize next steps", "Close loop after confirmation"],
  },
};

class KnowledgeAgent {
  async run(intent, message = "") {
    const start = Date.now();
    const scenario = pickScenario(message);
    const match = knowledgeMap[scenario.knowledgeKey] || knowledgeMap.support;

    return {
      name: "KnowledgeAgent",
      durationMs: Date.now() - start,
      output: {
        relevantPolicies: match.policies,
        suggestedActions: match.actions,
        matchedArticles: match.policies.map((article, index) => ({ id: `KB-${index + 1}`, title: article })),
      },
    };
  }
}

export default KnowledgeAgent;
