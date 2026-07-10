class AgentStateManager {
  constructor() {
    this.workflowStates = new Map();
    this.agentHealth = {};
  }

  startWorkflow(workflowId) {
    const workflow = {
      workflowId,
      startedAt: Date.now(),
      endedAt: null,
      status: "running",
      agents: {},
      executionOrder: [],
    };

    this.workflowStates.set(workflowId, workflow);
    return workflow;
  }

  setAgentState(workflowId, agentName, state, details = {}) {
    const workflow = this.workflowStates.get(workflowId);
    if (!workflow) {
      return;
    }

    const existing = workflow.agents[agentName] || {};
    const updated = {
      ...existing,
      name: agentName,
      state,
      startedAt: details.startedAt ?? existing.startedAt ?? null,
      endedAt: details.endedAt ?? existing.endedAt ?? null,
      attempts: details.attempts ?? existing.attempts ?? 1,
      durationMs: details.durationMs ?? existing.durationMs ?? 0,
      explanation: details.explanation ?? existing.explanation ?? null,
      error: details.error ?? existing.error ?? null,
    };

    workflow.agents[agentName] = updated;
    if (!workflow.executionOrder.includes(agentName)) {
      workflow.executionOrder.push(agentName);
    }
    this.agentHealth[agentName] = state === "failed" ? "Degraded" : "Healthy";
  }

  completeWorkflow(workflowId, finalState = {}) {
    const workflow = this.workflowStates.get(workflowId);
    if (!workflow) {
      return;
    }

    workflow.endedAt = Date.now();
    workflow.status = finalState.status || "completed";
    workflow.totalDurationMs = workflow.endedAt - workflow.startedAt;
    workflow.summary = finalState.summary || null;
  }

  getWorkflowState(workflowId) {
    return this.workflowStates.get(workflowId) || null;
  }

  getHealth() {
    const agentNames = Object.keys(this.agentHealth);
    const base = agentNames.length > 0 ? agentNames : ["IntentAgent", "SentimentAgent", "CustomerProfileAgent", "KnowledgeAgent", "ResolutionAgent", "EscalationAgent"];

    return base.reduce((acc, name) => {
      acc[name] = this.agentHealth[name] || "Healthy";
      return acc;
    }, {});
  }
}

export default AgentStateManager;
