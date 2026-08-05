import { useEffect, useState } from "react";

const STORAGE_KEY = "flashmind_progress";

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function useProgress() {
  const [history, setHistory] = useState(loadHistory);

  function recordSession(result) {
    const entry = { ...result, date: new Date().toISOString() };
    const updated = [...history, entry];
    setHistory(updated);
    saveHistory(updated);
  }

  return { history, recordSession };
}

export default function ProgressTracker({ history }) {
  const [expanded, setExpanded] = useState(false);

  if (!history.length) {
    return <p className="progress-empty">No quiz sessions yet — complete a quiz to start tracking progress.</p>;
  }

  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.total, 0);
  const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="progress">
      <div className="progress-summary" onClick={() => setExpanded((e) => !e)}>
        <p>
          <strong>{history.length}</strong> sessions · <strong>{accuracy}%</strong> overall accuracy
        </p>
        <span>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <ul className="progress-list">
          {history
            .slice()
            .reverse()
            .map((h, i) => (
              <li key={i}>
                {new Date(h.date).toLocaleString()} — {h.score}/{h.total}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
