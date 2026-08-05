import { useState } from "react";

export default function UploadForm({ onGenerate, loading }) {
  const [text, setText] = useState("");
  const [count, setCount] = useState(8);

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim().length < 20) return;
    onGenerate(text, count);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setText(evt.target.result);
    reader.readAsText(file);
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label htmlFor="study-text">Paste your study material</label>
      <textarea
        id="study-text"
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste notes, an article, or a textbook excerpt here..."
      />

      <div className="upload-controls">
        <input type="file" accept=".txt,.md" onChange={handleFile} />

        <label className="count-label">
          Flashcards:
          <input
            type="number"
            min={3}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>

        <button type="submit" disabled={loading || text.trim().length < 20}>
          {loading ? "Generating..." : "Generate Flashcards"}
        </button>
      </div>
    </form>
  );
}
