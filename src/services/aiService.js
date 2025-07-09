import fetch from "node-fetch";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "meta/llama3-8b-instruct"; // You can change to another supported model if desired

export async function aiChatService(messages) {
  if (!NVIDIA_API_KEY) {
    return { error: "NVIDIA_API_KEY not set in environment" };
  }
  try {
    // Add a system prompt for recipe help if not present
    const hasSystem = messages.some((m) => m.role === "system");
    const systemPrompt = {
      role: "system",
      content:
        "You are a helpful AI recipe assistant. Suggest recipes, answer cooking questions, and help users plan meals based on their preferences.",
    };
    const formattedMessages = hasSystem
      ? messages.map((m) => ({
          role: m.role === "ai" ? "assistant" : m.role,
          content: m.text,
        }))
      : [
          systemPrompt,
          ...messages.map((m) => ({
            role: m.role === "ai" ? "assistant" : m.role,
            content: m.text,
          })),
        ];

    const payload = {
      model: DEFAULT_MODEL,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 512,
    };
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { error: `NVIDIA API error: ${response.status} ${errorText}` };
    }
    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "[No response]";
    return { ai: aiMessage };
  } catch (err) {
    return { error: err.message || "Unknown error" };
  }
}
