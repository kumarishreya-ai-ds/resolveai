import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { deleteKnowledgeDocument, ingestDocumentBuffer, listKnowledgeDocuments, searchKnowledgeBase } from "../services/knowledgeRag.js";
import { getKnowledgeStore } from "../services/knowledgeStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../uploads/knowledge");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();
export const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

export const getDocuments = (req, res) => {
  try {
    const store = getKnowledgeStore();
    res.json({
      success: true,
      data: store.documents.map((doc) => ({
        ...doc,
        chunkCount: store.chunks.filter((chunk) => chunk.documentId === doc.id).length,
        embeddingCount: store.chunks.filter((chunk) => chunk.documentId === doc.id).length,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "A document file is required" });
    const { document, chunks } = await ingestDocumentBuffer({ originalName: req.file.originalname, mimeType: req.file.mimetype, buffer: req.file.buffer, uploadedBy: req.body.uploadedBy || "admin" });
    res.status(201).json({ success: true, data: { document, chunks: chunks.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDocument = (req, res) => {
  try {
    const { id } = req.params;
    const store = deleteKnowledgeDocument(id);
    res.json({ success: true, data: { documents: store.documents.length, chunks: store.chunks.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const retrieveKnowledge = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: "query is required" });
    const result = await searchKnowledgeBase(query, 5);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getKnowledgeMonitor = (req, res) => {
  const store = getKnowledgeStore();
  res.json({ success: true, data: { documents: store.documents.length, embeddingCount: store.chunks.length, chunkCount: store.chunks.length } });
};
