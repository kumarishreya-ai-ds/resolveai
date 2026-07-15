class AgentStateManager {
  constructor() {
    this.workflowStates = new Map();
    this.agentHealth = {};
    this.queue = [];
    this.completed = [];
  }

  enqueue(workflowId, payload = {}) {
    this.queue.push({ workflowId, enqueuedAt: Date.now(), status: "queued", ...payload });
    return this.queue;
  }

  dequeue(workflowId) {
    this.queue = this.queue.filter((item) => item.workflowId !== workflowId);
  }

  startWorkflow(workflowId, payload = {}) {
    const workflow = {
      workflowId,
      startedAt: Date.now(),
      endedAt: null,
      status: "running",
      agents: {},
      executionOrder: [],
      steps: [],
      report: null,
      ...payload,
    };

    this.workflowStates.set(workflowId, workflow);
    return workflow;
  }

  setAgentState(workflowId, agentName, state, details = {}) {
    const workflow = this.workflowStates.get(workflowId);
    if (!workflow) return;

    const existing = workflow.agents[agentName] || {};
    const updated = {
      ...existing,
      name: agentName,
      state,
      currentTask: details.currentTask ?? existing.currentTask ?? null,
      reasoning: details.reasoning ?? existing.reasoning ?? null,
      confidence: details.confidence ?? existing.confidence ?? null,
      startedAt: details.startedAt ?? existing.startedAt ?? null,
      endedAt: details.endedAt ?? existing.endedAt ?? null,
      attempts: details.attempts ?? existing.attempts ?? 1,
      durationMs: details.durationMs ?? existing.durationMs ?? 0,
      tokensUsed: details.tokensUsed ?? existing.tokensUsed ?? 0,
      explanation: details.explanation ?? existing.explanation ?? null,
      error: details.error ?? existing.error ?? null,
    };

    workflow.agents[agentName] = updated;
    if (!workflow.executionOrder.includes(agentName)) workflow.executionOrder.push(agentName);
    workflow.steps.push({ agentName, state, timestamp: Date.now(), ...details });
    this.agentHealth[agentName] = state === "failed" ? "Degraded" : "Healthy";
  }

  completeWorkflow(workflowId, finalState = {}) {
    const workflow = this.workflowStates.get(workflowId);
    if (!workflow) return;

    workflow.endedAt = Date.now();
    workflow.status = finalState.status || "completed";
    workflow.totalDurationMs = workflow.endedAt - workflow.startedAt;
    workflow.summary = finalState.summary || null;
    workflow.report = finalState.report || workflow.report || null;
    this.completed.unshift({ workflowId, ...workflow });
    this.dequeue(workflowId);
  }

  getWorkflowState(workflowId) {
    return this.workflowStates.get(workflowId) || null;
  }

  getWorkflows() {
    return Array.from(this.workflowStates.values()).sort((a, b) => b.startedAt - a.startedAt);
  }

  getQueueSnapshot() {
    return {
      queueSize: this.queue.length,
      running: this.getWorkflows().filter((item) => item.status === "running").length,
      completed: this.completed.length,
      workflows: this.getWorkflows(),
    };
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
