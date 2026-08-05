import { useMemo, useState } from "react";

/** Builds a 4-option multiple choice question for each flashcard,
 * using other flashcards' answers as distractors. */
function buildQuiz(flashcards) {
  return flashcards.map((card, i) => {
    const distractors = flashcards
      .filter((_, j) => j !== i)
      .map((c) => c.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [...distractors, card.answer].sort(() => Math.random() - 0.5);

    return { question: card.question, correctAnswer: card.answer, options };
  });
}

export default function QuizMode({ flashcards, onComplete }) {
  const quiz = useMemo(() => buildQuiz(flashcards), [flashcards]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!flashcards.length) return null;

  const q = quiz[step];

  function choose(option) {
    if (selected) return;
    setSelected(option);
    const correct = option === q.correctAnswer;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (step + 1 < quiz.length) {
        setStep((s) => s + 1);
        setSelected(null);
      } else {
        setFinished(true);
        onComplete({ score: correct ? score + 1 : score, total: quiz.length });
      }
    }, 700);
  }

  if (finished) {
    return (
      <div className="quiz-result">
        <h3>Quiz complete!</h3>
        <p>
          Score: {score} / {quiz.length}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="quiz-progress">
        Question {step + 1} / {quiz.length}
      </p>
      <p className="quiz-question">{q.question}</p>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          const isCorrect = selected && opt === q.correctAnswer;
          const isWrongPick = selected === opt && opt !== q.correctAnswer;
          return (
            <button
              key={i}
              className={isCorrect ? "correct" : isWrongPick ? "wrong" : ""}
              onClick={() => choose(opt)}
              disabled={Boolean(selected)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
