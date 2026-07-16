import AIOrchestrator from "../services/AIOrchestrator.js";
import { getFirstCustomerId } from "../services/seedDatabase.js";
import metricsStore from "../services/metricsStore.js";
import { readWorkflowLogs } from "../services/workflowLogger.js";

const orchestrator = new AIOrchestrator();

export const processAI = async (req, res) => {
  try {
    const { customerId, message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "message is required" });
    }

    const fallbackCustomerId = customerId || (await getFirstCustomerId());
    if (!fallbackCustomerId) {
      return res.status(400).json({ success: false, message: "No customer records available for AI processing" });
    }

    const result = await orchestrator.process({ customerId: fallbackCustomerId, message });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAIHealth = (req, res) => {
  res.json({ success: true, data: orchestrator.stateManager.getHealth() });
};

export const getAIMetrics = (req, res) => {
  res.json({ success: true, data: { ...metricsStore.getSnapshot(), ...orchestrator.stateManager.getQueueSnapshot() } });
};

export const getAILogs = (req, res) => {
  res.json({ success: true, data: readWorkflowLogs().slice(-20) });
};

export const getAIState = (req, res) => {
  const { workflowId } = req.params;
  if (workflowId) {
    return res.json({ success: true, data: orchestrator.stateManager.getWorkflowState(workflowId) });
  }
  res.json({ success: true, data: orchestrator.stateManager.getQueueSnapshot() });
};

export const getAIMonitor = (req, res) => {
  const metrics = metricsStore.getSnapshot();
  const queue = orchestrator.stateManager.getQueueSnapshot();
  res.json({ success: true, data: { ...metrics, ...queue, agents: orchestrator.stateManager.getHealth(), latestWorkflows: queue.workflows.slice(0, 6) } });
};


