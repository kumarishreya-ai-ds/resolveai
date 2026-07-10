import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class KnowledgeAgent {
  async run(intent) {
    const start = Date.now();

    try {
      const knowledgePath = path.resolve(__dirname, "../../data/knowledgeBase.json");
      const raw = fs.readFileSync(knowledgePath, "utf8");
      const knowledgeBase = JSON.parse(raw);
      const key = intent?.toLowerCase();
      const match = knowledgeBase[key] || knowledgeBase.support || knowledgeBase.billing;

      const result = {
        relevantPolicies: match?.policies || [],
        suggestedActions: match?.actions || [],
      };

      return {
        name: "KnowledgeAgent",
        durationMs: Date.now() - start,
        output: result,
      };
    } catch (error) {
      return {
        name: "KnowledgeAgent",
        durationMs: Date.now() - start,
        output: {
          relevantPolicies: [],
          suggestedActions: [],
          error: error.message,
        },
      };
    }
  }
}

export default KnowledgeAgent;
