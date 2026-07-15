import IntentAgent, { pickScenario } from "./agents/IntentAgent.js";
import SentimentAgent from "./agents/SentimentAgent.js";
import CustomerProfileAgent from "./agents/CustomerProfileAgent.js";
import KnowledgeAgent from "./agents/KnowledgeAgent.js";
import ResolutionAgent from "./agents/ResolutionAgent.js";
import EscalationAgent from "./agents/EscalationAgent.js";
import AgentStateManager from "./AgentStateManager.js";
import { logWorkflow } from "./workflowLogger.js";
import metricsStore from "./metricsStore.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const estimateTokens = (text = "") => Math.max(12, Math.round(String(text).split(/\s+/).filter(Boolean).length * 1.35));
const similarityToLabel = (score) => (score >= 0.9 ? "Very Happy" : score >= 0.75 ? "Satisfied" : score >= 0.55 ? "Neutral" : score >= 0.35 ? "Unsatisfied" : "Very Angry");

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

  async runWithRetry(agentName, runner, workflowId, details = {}) {
    const state = { startedAt: Date.now(), attempts: 0 };
    this.stateManager.setAgentState(workflowId, agentName, "running", { ...state, ...details });

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const result = await runner();
        const duration = result?.durationMs ?? 0;
        const output = result?.output || {};
        this.stateManager.setAgentState(workflowId, agentName, "completed", { startedAt: state.startedAt, endedAt: Date.now(), attempts: attempt, durationMs: duration, tokensUsed: estimateTokens(JSON.stringify(output)), confidence: output.confidence ?? output.score ?? null, reasoning: details.reasoning || null, currentTask: details.currentTask || null, explanation: `${details.explanation || agentName} ${result?.output ? "Completed successfully." : "Completed with partial data."}` });
        return result;
      } catch (error) {
        if (attempt === 2) {
          this.stateManager.setAgentState(workflowId, agentName, "failed", { startedAt: state.startedAt, endedAt: Date.now(), attempts: attempt, durationMs: 0, tokensUsed: 0, error: error.message, explanation: `${details.explanation || agentName} Failed after retry. Continuing with partial results.` });
          return null;
        }
        await delay(250);
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
    this.stateManager.enqueue(workflowId, { customerId, message });
    this.stateManager.startWorkflow(workflowId, { customerId, message });

    const scenario = pickScenario(message);
    const emit = (step, status, detail, extra = {}) => {
      logWorkflow(workflowId, { type: "step", step, status, detail, timestamp: new Date().toISOString(), customerId, message, ...extra });
    };

    emit("Ticket Received", "running", "Ticket accepted and queued for processing.");

    const addResult = (agentName, agentResult, explanation) => {
      if (!agentResult) return;
      executionOrder.push(agentName);
      const output = agentResult.output || {};
      const tokensUsed = estimateTokens(JSON.stringify(output));
      executionLog.push({ name: agentName, durationMs: agentResult.durationMs, tokensUsed, confidence: output.confidence ?? output.score ?? null });
      if (agentName === "IntentAgent") results.intent = { ...output, execution_time: agentResult.durationMs, tokens_used: tokensUsed, explanation: explanation || "Intent identified from customer language." };
      if (agentName === "SentimentAgent") results.sentiment = { ...output, execution_time: agentResult.durationMs, tokens_used: tokensUsed, explanation: explanation || "Sentiment and emotion were analyzed from tone." };
      if (agentName === "CustomerProfileAgent") results.customer = { ...output, execution_time: agentResult.durationMs, tokens_used: tokensUsed, explanation: explanation || "Customer profile loaded from database." };
      if (agentName === "KnowledgeAgent") results.knowledge = { ...output, execution_time: agentResult.durationMs, tokens_used: tokensUsed, explanation: explanation || "Relevant policy guidance selected." };
      if (agentName === "ResolutionAgent") results.resolution = { ...output, execution_time: agentResult.durationMs, tokens_used: tokensUsed, explanation: explanation || "Customer-ready response generated." };
      if (agentName === "EscalationAgent") results.escalation = { ...output, execution_time: agentResult.durationMs, tokens_used: tokensUsed, explanation: explanation || "Escalation evaluated from workflow context." };
    };

    emit("Intent Agent", "running", "Detecting customer intent.", { reasoning: "Extracting intent keywords and issue category." });
    const intentResult = await this.runWithRetry("IntentAgent", () => this.intentAgent.run(message), workflowId, { currentTask: "Classifying customer intent", reasoning: `Detected keywords: ${message.toLowerCase().split(/\s+/).slice(0, 6).join(", ")}`, explanation: "Intent identified from customer language." });
    addResult("IntentAgent", intentResult, "Intent identified from customer language.");
    emit("Intent Agent", "completed", results.intent?.intent || scenario.intent, { confidence: results.intent?.confidence, tokensUsed: results.intent?.tokens_used });

    await delay(350);
    emit("Sentiment Agent", "running", "Analyzing customer sentiment.", { reasoning: "Estimating emotional intensity from language patterns." });
    const sentimentResult = await this.runWithRetry("SentimentAgent", () => this.sentimentAgent.run(message), workflowId, { currentTask: "Analyzing sentiment", reasoning: `Tone inferred from language: ${message.slice(0, 80)}`, explanation: "Sentiment analyzed from message tone." });
    addResult("SentimentAgent", sentimentResult, "Sentiment analyzed from message tone.");
    emit("Sentiment Agent", "completed", results.sentiment?.sentiment || scenario.sentiment.sentiment, { confidence: results.sentiment?.confidence || results.sentiment?.score, tokensUsed: results.sentiment?.tokens_used });

    await delay(350);
    emit("Customer Profile Agent", "running", "Fetching customer profile.", { reasoning: "Loading profile, orders, and complaint history from the database." });
    const profileResult = await this.runWithRetry("CustomerProfileAgent", () => this.customerProfileAgent.run(customerId), workflowId, { currentTask: "Fetching customer profile", reasoning: "Querying customer record and prior tickets." });
    addResult("CustomerProfileAgent", profileResult, "Customer profile loaded from database.");
    emit("Customer Profile Agent", "completed", results.customer?.customer?.name || "Customer loaded", { confidence: 0.9, tokensUsed: results.customer?.tokens_used });

    await delay(350);
    emit("Knowledge Base Agent", "running", "Searching knowledge base.", { reasoning: "Ranking policy documents by similarity to the issue." });
    const knowledgeResult = await this.runWithRetry("KnowledgeAgent", () => this.knowledgeAgent.run(results.intent?.intent, message), workflowId, { currentTask: "Searching knowledge base", reasoning: `Matching documents for ${results.intent?.intent || scenario.intent}`, explanation: "Relevant knowledge selected." });
    addResult("KnowledgeAgent", knowledgeResult, "Relevant knowledge selected.");
    emit("Knowledge Base Agent", "completed", `${results.knowledge?.matchedChunks?.length || 0} chunks matched`, { confidence: results.knowledge?.confidence || 0.88, tokensUsed: results.knowledge?.tokens_used });

    await delay(350);
    emit("Resolution Agent", "running", "Generating AI response.", { reasoning: "Composing an enterprise response using live customer context." });
    const resolutionResult = await this.runWithRetry(
      "ResolutionAgent",
      () => this.resolutionAgent.run({ intent: results.intent, sentiment: results.sentiment, customer: results.customer, knowledge: results.knowledge, message }),
      workflowId,
      { currentTask: "Writing customer response", reasoning: "Using profile, intent, sentiment, and policy context.", explanation: "A customer-ready response was composed." }
    );
    addResult("ResolutionAgent", resolutionResult, "A customer-ready response was composed.");
    emit("Resolution Agent", "completed", results.resolution?.source || "response ready", { confidence: 0.92, tokensUsed: results.resolution?.tokens_used });

    await delay(300);
    emit("Escalation Agent", "running", "Evaluating escalation criteria.", { reasoning: "Comparing confidence, sentiment, and case category against policy." });
    const escalationResult = await this.runWithRetry(
      "EscalationAgent",
      () => this.escalationAgent.run({ intent: results.intent, sentiment: results.sentiment, customer: results.customer, knowledge: results.knowledge, resolution: results.resolution, message }),
      workflowId,
      { currentTask: "Deciding escalation", reasoning: "Assessing whether a human handoff is required.", explanation: "Escalation was evaluated." }
    );
    addResult("EscalationAgent", escalationResult, "Escalation was evaluated.");
    emit("Escalation Agent", "completed", results.escalation?.status || (results.escalation?.escalate ? "Escalate" : "Resolved"), { confidence: results.escalation?.escalate ? 0.6 : 0.94, tokensUsed: results.escalation?.tokens_used });

    const confidence = this.aggregateConfidence(results);
    const totalDuration = Date.now() - startedAt;
    const knowledgeConfidence = Number(results.knowledge?.confidence || 0);
    const satisfactionPrediction = similarityToLabel(Math.max(0.1, Math.min(0.99, (confidence + (results.sentiment?.score ? results.sentiment.score / 100 : 0.7)) / 2)));
    const humanReviewRequired = confidence < 0.8 || /angry|urgent/i.test(results.sentiment?.sentiment || "") || knowledgeConfidence < 0.45;
    const rootCause = {
      primaryCause: results.intent?.intent || scenario.intent,
      secondaryCause: results.sentiment?.sentiment || scenario.sentiment.sentiment,
      businessCategory: results.intent?.intent?.includes("payment") || message.toLowerCase().includes("payment") ? "Finance" : results.intent?.intent?.includes("order") ? "Logistics" : results.intent?.intent?.includes("account") ? "Identity" : "Support",
      resolutionCategory: results.escalation?.escalate ? "Escalation" : "Self-Serve Resolution",
    };
    const recommendations = [];
    if (/refund|charged|payment/i.test(message)) recommendations.push("Offer refund", "Escalate to finance");
    if (/shipping|delayed|wrong product/i.test(message)) recommendations.push("Escalate to logistics", "Follow up in 24 hours");
    if (/cancel|subscription/i.test(message)) recommendations.push("Offer coupon", "Offer downgrade option");
    if (!recommendations.length) recommendations.push("Follow up in 24 hours");

    const explanation = {
      intent: `Why this intent was selected: ${results.intent?.explanation || "The language matched the issue category and support keywords."}`,
      sentiment: `Why this sentiment was selected: ${results.sentiment?.explanation || "The tone and urgency in the customer's language indicated the emotional state."}`,
      knowledge: `Policy documents used: ${(results.knowledge?.matchedChunks || []).map((chunk) => `${chunk.sourceFile} (p.${chunk.page})`).join(", ") || "No matching company knowledge found."}`,
      resolution: `Why this response was generated: ${results.resolution?.explanation || "The response used retrieved policy context, customer history, and the issue type."}`,
      escalation: `Why escalation was ${results.escalation?.escalate ? "required" : "skipped"}: ${results.escalation?.reason || "It met policy and confidence thresholds."}`,
    };

    const report = {
      agentsExecuted: executionOrder.length,
      executionTimeMs: totalDuration,
      confidence,
      finalDecision: results.escalation?.escalate ? "Escalate" : "Resolved",
      escalation: results.escalation?.escalate,
      customerSatisfactionPrediction: satisfactionPrediction,
      explanation,
      rootCause,
      smartRecommendations: recommendations,
      knowledgeConfidence,
      humanReviewRequired,
    };

    this.stateManager.completeWorkflow(workflowId, { status: "completed", summary: report, report, totalDurationMs: totalDuration, confidence, successfulAgents: Object.keys(results).length });

    const escalation = Boolean(results.escalation?.escalate);
    const resolved = Boolean(results.resolution?.response);
    metricsStore.recordRequest(totalDuration, escalation, resolved);

    logWorkflow(workflowId, { type: "summary", customerId, message, results, confidence, report, totalDurationMs: totalDuration, executionOrder, executionLog, timestamp: new Date().toISOString() });

    return {
      ...results,
      confidence,
      processingTime: totalDuration,
      executionOrder,
      executionLog,
      report,
      explanation,
      rootCause,
      smartRecommendations: recommendations,
      satisfactionPrediction,
      humanReviewRequired,
      workflowId,
    };
  }

  aggregateConfidence(results) {
    const values = [];
    if (results.intent?.confidence !== undefined) values.push(Number(results.intent.confidence));
    if (results.sentiment?.confidence !== undefined) values.push(Number(results.sentiment.confidence));
    if (results.customer?.customer) values.push(0.9);
    if (results.knowledge?.confidence !== undefined) values.push(Number(results.knowledge.confidence));
    if (results.resolution?.response) values.push(0.92);
    if (results.escalation?.priority) values.push(0.86);
    return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0;
  }
}

export default AIOrchestrator;
