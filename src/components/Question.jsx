// src/components/Question.jsx
import { useQuiz } from "../context/QuizContext";
import { useMemo } from "react";

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function Question() {
  const { currentQ, questions, answer } = useQuiz();
  const q = questions?.[currentQ];

  const shuffledOptions = useMemo(() => {
    return q?.options ? shuffleArray(q.options) : [];
  }, [q]);

  if (!q || !q.options) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-red-100 text-red-800 rounded-2xl shadow-md">
        <p>Error loading question.</p>
      </div>
    );
  }

  return (
    <div className="h-[30rem] flex items-center justify-center w-full px-4">
      <div className="p-8 max-w-xl w-full mx-auto bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 ease-in-out animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6 text-purple-700">
          Q{currentQ + 1}. {q.text}
        </h2>

        <ul className="space-y-4">
          {shuffledOptions.map((option, idx) => (
            <li key={idx}>
              <button
                onClick={() => answer(option.clubs)}
                className="w-full text-left px-5 py-3 rounded-lg bg-purple-100 hover:bg-purple-300 hover:text-white transition duration-200 font-medium shadow-sm"
              >
                {option.text}
              </button>
            </li>
          ))}
        </ul>

        <p className="text-sm mt-8 text-gray-500 text-center">
          Question {currentQ + 1} of {questions.length}
        </p>
      </div>
    </div>
  );
}
