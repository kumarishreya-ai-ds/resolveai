import { callGemini } from "./geminiHelper.js";
import { pickScenario } from "./IntentAgent.js";

class SentimentAgent {
  async run(message) {
    const start = Date.now();
    const scenario = pickScenario(message);
    const result = await callGemini(
      `Analyze the sentiment and emotion of this message. Return ONLY valid JSON with keys: sentiment, emotion, confidence. Example: {"sentiment":"negative","emotion":"frustrated","confidence":0.88}. Message: ${message}`,
      () => scenario.sentiment
    );

    return { name: "SentimentAgent", durationMs: Date.now() - start, output: result };
  }
}

export default SentimentAgent;
