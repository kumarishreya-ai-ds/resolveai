import express from "express";
import { processAI, getAIHealth, getAIMetrics, getAILogs, getAIState, getAIMonitor } from "../controllers/aiController.js";

const router = express.Router();

router.post("/process", processAI);
router.get("/health", getAIHealth);
router.get("/metrics", getAIMetrics);
router.get("/logs", getAILogs);
router.get("/state", getAIState);
router.get("/state/:workflowId", getAIState);
router.get("/monitor", getAIMonitor);

export default router;
