import express from "express";
import { processAI, getAIHealth, getAIMetrics, getAILogs } from "../controllers/aiController.js";

const router = express.Router();

router.post("/process", processAI);
router.get("/health", getAIHealth);
router.get("/metrics", getAIMetrics);
router.get("/logs", getAILogs);

export default router;
