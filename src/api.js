const BASE_URL = "/api";

export async function generateFlashcards(text, count = 8) {
  const res = await fetch(`${BASE_URL}/flashcards/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, count }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate flashcards");
  }

  return res.json();
}
