import { searchKnowledgeBase } from "../knowledgeRag.js";

class KnowledgeAgent {
  async run(intent, message = "") {
    const start = Date.now();
    const query = [intent?.intent || intent || "", message].filter(Boolean).join(" ").trim();
    const retrieval = await searchKnowledgeBase(query, 5);
    const topChunks = retrieval.chunks;
    const bestScore = topChunks[0]?.similarity || 0;

    return {
      name: "KnowledgeAgent",
      durationMs: Date.now() - start,
      output: {
        retrievedDocuments: Array.from(new Map(topChunks.map((chunk) => [chunk.sourceFile, { sourceFile: chunk.sourceFile, page: chunk.page, similarity: chunk.similarity }])).values()),
        matchedChunks: topChunks,
        relevantPolicies: topChunks.map((chunk) => chunk.snippet),
        suggestedActions: topChunks.length ? ["Review matching policy section", "Use retrieved policy language in the response"] : ["No matching company knowledge found."],
        confidence: Number(bestScore.toFixed(2)),
        retrievalLatencyMs: retrieval.retrievalLatencyMs,
        embeddingCount: retrieval.embeddingCount,
        noMatch: topChunks.length === 0,
      },
    };
  }
}

export default KnowledgeAgent;

