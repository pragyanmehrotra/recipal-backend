import { Router } from "express";
import { aiChatHandler } from "../controllers/aiController.js";

const router = Router();

// POST /api/ai/chat
router.post("/chat", aiChatHandler);

export default router;
