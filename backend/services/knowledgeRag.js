import fs from "fs";
import path from "path";
import * as pdfParseModule from "pdf-parse";
import mammoth from "mammoth";
import { fileURLToPath } from "url";
import { chunkText, embedText, cosineSimilarity } from "./knowledgeVector.js";
import { getKnowledgeStore, removeKnowledgeDocument, upsertKnowledgeChunks, upsertKnowledgeDocument } from "./knowledgeStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../uploads/knowledge");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const parseMarkdown = (buffer) => buffer.toString("utf8");
const parseTxt = (buffer) => buffer.toString("utf8");
const parsePdf = async (buffer) => { const parser = pdfParseModule.default || pdfParseModule; const result = await parser(buffer); return result?.text || ""; };
const parseDocx = async (buffer) => (await mammoth.extractRawText({ buffer })).value || "";

const extractTextByType = async (mimeType, originalName, buffer) => {
  const ext = path.extname(originalName).toLowerCase();
  if (mimeType === "application/pdf" || ext === ".pdf") return parsePdf(buffer);
  if (mimeType.includes("wordprocessingml") || ext === ".docx") return parseDocx(buffer);
  if (mimeType === "text/markdown" || ext === ".md") return parseMarkdown(buffer);
  return parseTxt(buffer);
};

export const buildChunks = (documentId, sourceFile, text) => chunkText(text).map((chunk, index) => ({
  id: `${documentId}-chunk-${index + 1}`,
  documentId,
  sourceFile,
  page: Math.floor(index / 3) + 1,
  chunkIndex: index + 1,
  text: chunk,
  embedding: embedText(chunk),
}));

export const ingestDocumentBuffer = async ({ originalName, mimeType, buffer, uploadedBy = "admin" }) => {
  const content = await extractTextByType(mimeType, originalName, buffer);
  const documentId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const chunks = buildChunks(documentId, originalName, content);
  const document = { id: documentId, name: originalName, mimeType, uploadedBy, uploadedAt: new Date().toISOString(), chunkCount: chunks.length, embeddingCount: chunks.length, textLength: content.length };
  upsertKnowledgeDocument(document);
  upsertKnowledgeChunks(documentId, chunks);
  return { document, chunks, content };
};

export const searchKnowledgeBase = async (query, topK = 5) => {
  const start = Date.now();
  const store = getKnowledgeStore();
  const queryEmbedding = embedText(query);
  const ranked = store.chunks
    .map((chunk) => ({ ...chunk, similarity: cosineSimilarity(chunk.embedding, queryEmbedding) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return {
    documents: store.documents,
    chunks: ranked.map((chunk) => ({ id: chunk.id, documentId: chunk.documentId, sourceFile: chunk.sourceFile, page: chunk.page, text: chunk.text, similarity: chunk.similarity, confidence: Number((chunk.similarity * 100).toFixed(1)), snippet: chunk.text.slice(0, 220), reason: `Matched query terms from ${chunk.sourceFile}` })),
    embeddingCount: store.chunks.length,
    retrievalLatencyMs: Date.now() - start,
  };
};

export const listKnowledgeDocuments = () => getKnowledgeStore().documents;
export const deleteKnowledgeDocument = (documentId) => removeKnowledgeDocument(documentId);

