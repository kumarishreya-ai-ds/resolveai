const DIMENSION = 96;
const STOP_WORDS = new Set(["the", "and", "for", "with", "that", "this", "from", "your", "you", "are", "was", "were", "have", "has", "had", "will", "shall", "can", "could", "should", "would", "there", "their", "about", "into", "when", "then", "than", "they", "them", "our", "out", "not", "but", "all", "any", "may", "over", "under", "between", "after", "before", "upon", "also", "only", "very"]);

export const tokenize = (text = "") => String(text).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word && !STOP_WORDS.has(word));

export const embedText = (text = "") => {
  const vector = Array(DIMENSION).fill(0);
  const tokens = tokenize(text);
  tokens.forEach((token, index) => {
    let hash = 0;
    for (let i = 0; i < token.length; i += 1) hash = ((hash << 5) - hash + token.charCodeAt(i)) | 0;
    const bucket = Math.abs(hash + index * 17) % DIMENSION;
    vector[bucket] += 1;
  });
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / norm).toFixed(6)));
};

export const cosineSimilarity = (a = [], b = []) => {
  if (!a.length || !b.length) return 0;
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom ? Number((dot / denom).toFixed(4)) : 0;
};

export const chunkText = (text = "", size = 900, overlap = 140) => {
  const clean = String(text).replace(/\r/g, "").trim();
  if (!clean) return [];
  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(clean.length, start + size);
    chunks.push(clean.slice(start, end).trim());
    if (end === clean.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks.filter(Boolean);
};

export const scoreToConfidence = (score = 0) => Number(Math.min(0.99, Math.max(0.1, score)).toFixed(2));
