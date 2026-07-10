import AIOrchestrator from "../services/AIOrchestrator.js";
import AgentStateManager from "../services/AgentStateManager.js";
import metricsStore from "../services/metricsStore.js";
import { readWorkflowLogs } from "../services/workflowLogger.js";

const orchestrator = new AIOrchestrator();
const stateManager = new AgentStateManager();

export const processAI = async (req, res) => {
  try {
    const { customerId, message } = req.body;

    if (!customerId || !message) {
      return res.status(400).json({ success: false, message: "customerId and message are required" });
    }

    const result = await orchestrator.process({ customerId, message });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAIHealth = (req, res) => {
  res.json({ success: true, data: stateManager.getHealth() });
};

export const getAIMetrics = (req, res) => {
  res.json({ success: true, data: metricsStore.getSnapshot() });
};

export const getAILogs = (req, res) => {
  res.json({ success: true, data: readWorkflowLogs().slice(-10) });
};
