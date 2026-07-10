import express from "express";
import { getConversations, createConversation } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", getConversations);
router.post("/", createConversation);

export default router;
