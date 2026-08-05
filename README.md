# 🧠 FlashMind – AI-Based Flashcard Generator

FlashMind is a full-stack web tool that converts pasted study material into flashcards using an LLM (GPT-4 via the OpenAI API), with a quiz-based revision mode and basic progress tracking.

---

## 🚀 Features

* **AI flashcard generation** — paste notes or an article, get back structured Q&A flashcards via the OpenAI API (`gpt-4o-mini` by default, configurable)
* **Offline fallback mode** — if no API key is configured, a simple heuristic generator still produces usable flashcards, so the app runs end-to-end without a paid key
* **Study mode** — flippable flashcard deck, one card at a time
* **Quiz mode** — auto-generated multiple-choice quiz from the flashcards, with distractors pulled from other answers
* **Progress tracking** — quiz scores are stored per session (localStorage) and summarized as overall accuracy

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + Vite
* **Backend:** Node.js + Express
* **AI:** OpenAI API (`openai` npm SDK)
* **Storage:** localStorage for progress (no DB yet — see Future Improvements)

---

## 📂 Project Structure

```
FlashMind/
├── backend/
│   ├── server.js
│   ├── routes/flashcards.js   # /api/flashcards/generate endpoint
│   └── .env
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   └── components/
    │       ├── UploadForm.jsx
    │       ├── FlashcardDeck.jsx
    │       ├── QuizMode.jsx
    │       └── ProgressTracker.jsx
    └── vite.config.js
```

---

## ⚡ Running locally

**Backend**
```bash
cd backend
cp .env. .env   # add your OPENAI_API_KEY (optional — offline fallback works without it)
npm install
npm start               # runs on http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev              # runs on http://localhost:5173, proxies /api to the backend
```

---

## 🎯 Purpose

Built to explore practical LLM integration: prompt design for structured JSON output, a graceful fallback when the model/API is unavailable, and turning generated content into an interactive study workflow (flashcards → quiz → progress).

---

## 📌 Future Improvements

* Persist flashcard decks and progress in a real database instead of localStorage
* Spaced-repetition scheduling (e.g. SM-2) instead of a flat quiz loop
* User accounts and saved decks
* Support PDF/DOCX upload, not just plain text

---

## 📜 License

MIT

---

## 🙌 Author

**Aditya Bhoite**
