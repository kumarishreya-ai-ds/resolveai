import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const storeFile = path.join(dataDir, "knowledgeStore.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(storeFile)) fs.writeFileSync(storeFile, JSON.stringify({ documents: [], chunks: [] }, null, 2), "utf8");

const readStore = () => JSON.parse(fs.readFileSync(storeFile, "utf8") || "{\"documents\":[],\"chunks\":[]}");
const writeStore = (store) => fs.writeFileSync(storeFile, JSON.stringify(store, null, 2), "utf8");

export const getKnowledgeStore = () => readStore();
export const saveKnowledgeStore = (store) => writeStore(store);

export const removeKnowledgeDocument = (documentId) => {
  const store = readStore();
  store.documents = store.documents.filter((doc) => doc.id !== documentId);
  store.chunks = store.chunks.filter((chunk) => chunk.documentId !== documentId);
  writeStore(store);
  return store;
};

export const upsertKnowledgeDocument = (document) => {
  const store = readStore();
  store.documents = [document, ...store.documents.filter((item) => item.id !== document.id)];
  writeStore(store);
  return store;
};

export const upsertKnowledgeChunks = (documentId, chunks) => {
  const store = readStore();
  store.chunks = [...store.chunks.filter((chunk) => chunk.documentId !== documentId), ...chunks];
  writeStore(store);
  return store;
};
