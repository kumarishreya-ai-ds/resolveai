import AIOrchestrator from "../services/AIOrchestrator.js";

const orchestrator = new AIOrchestrator();

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
