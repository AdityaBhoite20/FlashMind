import { useState } from "react";

export default function FlashcardDeck({ flashcards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards.length) return null;

  const card = flashcards[index];

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % flashcards.length);
  }

  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
  }

  return (
    <div className="deck">
      <p className="deck-progress">
        Card {index + 1} / {flashcards.length}
      </p>

      <div className="card" onClick={() => setFlipped((f) => !f)}>
        <p className="card-label">{flipped ? "Answer" : "Question"}</p>
        <p className="card-content">{flipped ? card.answer : card.question}</p>
        <p className="card-hint">Click to flip</p>
      </div>

      <div className="deck-controls">
        <button onClick={prev}>◀ Prev</button>
        <button onClick={next}>Next ▶</button>
      </div>
    </div>
  );
}
