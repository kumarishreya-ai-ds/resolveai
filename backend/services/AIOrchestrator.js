import IntentAgent from "./agents/IntentAgent.js";
import SentimentAgent from "./agents/SentimentAgent.js";
import CustomerProfileAgent from "./agents/CustomerProfileAgent.js";
import KnowledgeAgent from "./agents/KnowledgeAgent.js";
import ResolutionAgent from "./agents/ResolutionAgent.js";
import EscalationAgent from "./agents/EscalationAgent.js";
import AgentStateManager from "./AgentStateManager.js";
import { logWorkflow } from "./workflowLogger.js";
import metricsStore from "./metricsStore.js";

class AIOrchestrator {
  constructor() {
    this.intentAgent = new IntentAgent();
    this.sentimentAgent = new SentimentAgent();
    this.customerProfileAgent = new CustomerProfileAgent();
    this.knowledgeAgent = new KnowledgeAgent();
    this.resolutionAgent = new ResolutionAgent();
    this.escalationAgent = new EscalationAgent();
    this.stateManager = new AgentStateManager();
  }

  async runWithRetry(agentName, runner, workflowId, explanationPrefix) {
    const state = {
      startedAt: Date.now(),
      attempts: 0,
    };
    this.stateManager.setAgentState(workflowId, agentName, "running", state);

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const result = await runner();
        const duration = result?.durationMs ?? 0;
        this.stateManager.setAgentState(workflowId, agentName, "completed", {
          startedAt: state.startedAt,
          endedAt: Date.now(),
          attempts: attempt,
          durationMs: duration,
          explanation: `${explanationPrefix} ${result?.output ? "Completed successfully." : "Completed with partial data."}`,
        });
        return result;
      } catch (error) {
        if (attempt === 2) {
          this.stateManager.setAgentState(workflowId, agentName, "failed", {
            startedAt: state.startedAt,
            endedAt: Date.now(),
            attempts: attempt,
            durationMs: 0,
            error: error.message,
            explanation: `${explanationPrefix} Failed after retry. Continuing with partial results.`,
          });
          return null;
        }
      }
    }

    return null;
  }

  async process({ customerId, message }) {
    const workflowId = `wf-${Date.now()}`;
    const startedAt = Date.now();
    const results = {};
    const executionOrder = [];
    const executionLog = [];
    const workflow = this.stateManager.startWorkflow(workflowId);

    const addResult = (agentName, agentResult, explanation) => {
      if (agentResult) {
        executionOrder.push(agentName);
        executionLog.push({ name: agentName, durationMs: agentResult.durationMs });
        if (agentName === "IntentAgent") {
          results.intent = {
            ...agentResult.output,
            explanation: explanation || 'The message was classified based on the customer request content.',
          };
        } else if (agentName === "SentimentAgent") {
          results.sentiment = {
            ...agentResult.output,
            explanation: explanation || 'The sentiment and emotion were inferred from the tone of the message.',
          };
        } else if (agentName === "CustomerProfileAgent") {
          results.customer = {
            ...agentResult.output,
            explanation: explanation || 'Customer profile and prior ticket history were loaded from the database.',
          };
        } else if (agentName === "KnowledgeAgent") {
          results.knowledge = {
            ...agentResult.output,
            explanation: explanation || 'Relevant policy guidance was pulled from the local knowledge base.',
          };
        } else if (agentName === "ResolutionAgent") {
          results.resolution = {
            ...agentResult.output,
            explanation: explanation || 'A professional customer response was generated from the collected context.',
          };
        } else if (agentName === "EscalationAgent") {
          results.escalation = {
            ...agentResult.output,
            explanation: explanation || 'The escalation decision was based on intent, sentiment, and policy context.',
          };
        }
      }
    };

    const [intentResult, sentimentResult, profileResult] = await Promise.all([
      this.runWithRetry("IntentAgent", () => this.intentAgent.run(message), workflowId, "Intent identified from customer language."),
      this.runWithRetry("SentimentAgent", () => this.sentimentAgent.run(message), workflowId, "Sentiment and emotion were analyzed from the message tone."),
      this.runWithRetry("CustomerProfileAgent", () => this.customerProfileAgent.run(customerId), workflowId, "Customer profile and ticket history were loaded from MongoDB."),
    ]);

    addResult("IntentAgent", intentResult, "Intent identified from customer language.");
    addResult("SentimentAgent", sentimentResult, "Sentiment and emotion were analyzed from the message tone.");
    addResult("CustomerProfileAgent", profileResult, "Customer profile and ticket history were loaded from MongoDB.");

    const knowledgeResult = await this.runWithRetry("KnowledgeAgent", () => this.knowledgeAgent.run(results.intent?.intent), workflowId, "Relevant policy guidance was selected from the knowledge base.");
    addResult("KnowledgeAgent", knowledgeResult, "Relevant policy guidance was selected from the knowledge base.");

    const resolutionResult = await this.runWithRetry("ResolutionAgent", () => this.resolutionAgent.run({
      intent: results.intent,
      sentiment: results.sentiment,
      customer: results.customer,
      knowledge: results.knowledge,
    }), workflowId, "A customer-ready response was composed from the accumulated context.");
    addResult("ResolutionAgent", resolutionResult, "A customer-ready response was composed from the accumulated context.");

    const escalationResult = await this.runWithRetry("EscalationAgent", () => this.escalationAgent.run({
      intent: results.intent,
      sentiment: results.sentiment,
      customer: results.customer,
      knowledge: results.knowledge,
      resolution: results.resolution,
    }), workflowId, "Escalation was evaluated from the combined workflow context.");
    addResult("EscalationAgent", escalationResult, "Escalation was evaluated from the combined workflow context.");

    const confidence = this.aggregateConfidence(results);
    const totalDuration = Date.now() - startedAt;

    const workflowSummary = {
      status: "completed",
      totalDurationMs: totalDuration,
      confidence,
      successfulAgents: Object.keys(results).length,
    };

    this.stateManager.completeWorkflow(workflowId, workflowSummary);
    const escalation = Boolean(results.escalation?.escalate);
    const resolved = Boolean(results.resolution?.response);
    metricsStore.recordRequest(totalDuration, escalation, resolved);

    logWorkflow(workflowId, {
      customerId,
      message,
      results,
      confidence,
      totalDurationMs: totalDuration,
      executionOrder,
      executionLog,
    });

    return {
      ...results,
      confidence,
      processingTime: totalDuration,
      executionOrder,
      executionLog,
      workflowId,
    };
  }

  aggregateConfidence(results) {
    const values = [];
    if (results.intent?.confidence !== undefined) values.push(Number(results.intent.confidence));
    if (results.sentiment?.confidence !== undefined) values.push(Number(results.sentiment.confidence));
    if (results.customer?.customer) values.push(0.9);
    if (results.knowledge?.relevantPolicies?.length) values.push(0.88);
    if (results.resolution?.response) values.push(0.92);
    if (results.escalation?.priority) values.push(0.86);

    if (!values.length) {
      return 0;
    }

    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
  }
}

export default AIOrchestrator;
