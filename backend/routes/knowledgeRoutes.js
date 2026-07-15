import express from "express";
import { deleteDocument, getDocuments, getKnowledgeMonitor, retrieveKnowledge, upload, uploadDocument } from "../controllers/knowledgeController.js";

const router = express.Router();
router.get("/", getDocuments);
router.get("/monitor", getKnowledgeMonitor);
router.post("/retrieve", retrieveKnowledge);
router.post("/upload", upload.single("file"), uploadDocument);
router.delete("/:id", deleteDocument);
export default router;
