import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
const client = hasApiKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const SYSTEM_PROMPT = `You are FlashMind, an assistant that converts study material into flashcards.
Given raw study text, produce concise flashcards as a JSON array of objects:
[{ "question": "...", "answer": "..." }]
Rules:
- 5 to 12 flashcards depending on how much material is given
- Questions should be specific and testable, not vague
- Answers should be short (1-3 sentences)
- Return ONLY valid JSON, no markdown fences, no commentary`;

/**
 * POST /api/flashcards/generate
 * body: { text: string, count?: number }
 * Calls the OpenAI API to turn study material into flashcards.
 * Falls back to a simple offline heuristic generator if no API key is configured,
 * so the app is runnable/demoable without live API access.
 */
router.post("/generate", async (req, res) => {
  const { text, count = 8 } = req.body;

  if (!text || typeof text !== "string" || text.trim().length < 20) {
    return res.status(400).json({ error: "Please provide at least a paragraph of study material." });
  }

  if (!hasApiKey) {
    return res.json({
      source: "offline-fallback",
      note: "No OPENAI_API_KEY configured — using a simple heuristic generator instead of GPT-4. Add a key in .env to enable real LLM generation.",
      flashcards: heuristicFlashcards(text, count),
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Study material:\n\n${text}\n\nGenerate ${count} flashcards.` },
      ],
      temperature: 0.4,
    });

    const raw = completion.choices[0].message.content.trim();
    const flashcards = JSON.parse(raw);

    res.json({ source: MODEL, flashcards });
  } catch (err) {
    console.error("OpenAI generation failed:", err.message);
    res.status(502).json({
      error: "Flashcard generation failed. Falling back to offline mode.",
      flashcards: heuristicFlashcards(text, count),
    });
  }
});

/**
 * Offline fallback: splits study material into sentences and turns each
 * into a naive fill-in-the-blank style question. Not as good as an LLM,
 * but keeps the app fully functional without an API key.
 */
function heuristicFlashcards(text, count) {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25)
    .slice(0, count);

  return sentences.map((sentence, i) => {
    const words = sentence.split(" ");
    const keyIdx = words.findIndex((w) => w.length > 6) ?? Math.floor(words.length / 2);
    const blankIdx = keyIdx >= 0 ? keyIdx : Math.floor(words.length / 2);
    const answer = words[blankIdx]?.replace(/[.,!?]$/, "") || "?";
    const question = words
      .map((w, idx) => (idx === blankIdx ? "____" : w))
      .join(" ");

    return {
      question: `Fill in the blank (${i + 1}): ${question}`,
      answer,
    };
  });
}

export default router;
