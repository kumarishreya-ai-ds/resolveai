import { callGemini } from "./geminiHelper.js";

class IntentAgent {
  async run(message) {
    const start = Date.now();
    const result = await callGemini(
      `Classify the customer's intent from this message. Return ONLY valid JSON with keys: intent, confidence. Example: {"intent":"billing","confidence":0.92}. Message: ${message}`,
      () => ({
        intent: "support",
        confidence: 0.65,
      })
    );

    return {
      name: "IntentAgent",
      durationMs: Date.now() - start,
      output: result,
    };
  }
}

export default IntentAgent;
