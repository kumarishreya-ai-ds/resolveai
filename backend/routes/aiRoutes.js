import express from "express";
import { processAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/process", processAI);

export default router;
