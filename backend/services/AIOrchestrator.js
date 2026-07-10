import IntentAgent from "./agents/IntentAgent.js";
import SentimentAgent from "./agents/SentimentAgent.js";
import CustomerProfileAgent from "./agents/CustomerProfileAgent.js";
import KnowledgeAgent from "./agents/KnowledgeAgent.js";
import ResolutionAgent from "./agents/ResolutionAgent.js";
import EscalationAgent from "./agents/EscalationAgent.js";

class AIOrchestrator {
  constructor() {
    this.intentAgent = new IntentAgent();
    this.sentimentAgent = new SentimentAgent();
    this.customerProfileAgent = new CustomerProfileAgent();
    this.knowledgeAgent = new KnowledgeAgent();
    this.resolutionAgent = new ResolutionAgent();
    this.escalationAgent = new EscalationAgent();
  }

  async process({ customerId, message }) {
    const startedAt = Date.now();
    const executionLog = [];
    const results = {};

    const runStep = async (label, runner) => {
      try {
        const stepResult = await runner();
        executionLog.push({ name: stepResult.name, durationMs: stepResult.durationMs });
        return stepResult;
      } catch (error) {
        executionLog.push({ name: label, durationMs: 0, error: error.message });
        return null;
      }
    };

    const intentResult = await runStep("IntentAgent", () => this.intentAgent.run(message));
    if (intentResult) {
      results.intent = intentResult.output;
    }

    const sentimentResult = await runStep("SentimentAgent", () => this.sentimentAgent.run(message));
    if (sentimentResult) {
      results.sentiment = sentimentResult.output;
    }

    const profileResult = await runStep("CustomerProfileAgent", () => this.customerProfileAgent.run(customerId));
    if (profileResult) {
      results.customer = profileResult.output;
    }

    const knowledgeResult = await runStep("KnowledgeAgent", () => this.knowledgeAgent.run(results.intent?.intent));
    if (knowledgeResult) {
      results.knowledge = knowledgeResult.output;
    }

    const resolutionResult = await runStep("ResolutionAgent", () => this.resolutionAgent.run({
      intent: results.intent,
      sentiment: results.sentiment,
      customer: results.customer,
      knowledge: results.knowledge,
    }));
    if (resolutionResult) {
      results.resolution = resolutionResult.output;
    }

    const escalationResult = await runStep("EscalationAgent", () => this.escalationAgent.run({
      intent: results.intent,
      sentiment: results.sentiment,
      customer: results.customer,
      knowledge: results.knowledge,
      resolution: results.resolution,
    }));
    if (escalationResult) {
      results.escalation = escalationResult.output;
    }

    return {
      ...results,
      processingTime: Date.now() - startedAt,
      executionLog,
    };
  }
}

export default AIOrchestrator;
