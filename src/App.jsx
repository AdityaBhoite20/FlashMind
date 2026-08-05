import { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import FlashcardDeck from "./components/FlashcardDeck.jsx";
import QuizMode from "./components/QuizMode.jsx";
import ProgressTracker, { useProgress } from "./components/ProgressTracker.jsx";
import { generateFlashcards } from "./api.js";

export default function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [mode, setMode] = useState("study"); // 'study' | 'quiz'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceNote, setSourceNote] = useState(null);
  const { history, recordSession } = useProgress();

  async function handleGenerate(text, count) {
    setLoading(true);
    setError(null);
    try {
      const data = await generateFlashcards(text, count);
      setFlashcards(data.flashcards);
      setSourceNote(data.note || `Generated with ${data.source}`);
      setMode("study");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🧠 FlashMind</h1>
        <p>Turn your study material into flashcards and quizzes, powered by GPT-4.</p>
      </header>

      <UploadForm onGenerate={handleGenerate} loading={loading} />

      {error && <p className="error">{error}</p>}
      {sourceNote && <p className="source-note">{sourceNote}</p>}

      {flashcards.length > 0 && (
        <>
          <div className="mode-switch">
            <button className={mode === "study" ? "active" : ""} onClick={() => setMode("study")}>
              Study Mode
            </button>
            <button className={mode === "quiz" ? "active" : ""} onClick={() => setMode("quiz")}>
              Quiz Mode
            </button>
          </div>

          {mode === "study" ? (
            <FlashcardDeck flashcards={flashcards} />
          ) : (
            <QuizMode flashcards={flashcards} onComplete={recordSession} />
          )}
        </>
      )}

      <section className="progress-section">
        <h2>Your Progress</h2>
        <ProgressTracker history={history} />
      </section>
    </div>
  );
}
