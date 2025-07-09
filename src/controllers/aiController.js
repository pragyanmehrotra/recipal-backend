import { aiChatService } from "../services/aiService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const aiChatHandler = asyncHandler(async (req, res) => {
  // Expect { messages: [{role: 'user'|'ai', text: string}], ... }
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing or invalid messages array" });
  }
  const response = await aiChatService(messages);
  res.json(response);
});
