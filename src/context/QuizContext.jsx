// src/context/QuizContext.jsx
import { createContext, useContext, useState, useMemo } from "react";
import { questions as originalQuestions } from "../data/questions";

const QuizContext = createContext();

export function useQuiz() {
  return useContext(QuizContext);
}

export function QuizProvider({ children }) {
  const [currentQ, setCurrentQ] = useState(-1); // Start on Welcome screen
  const [scores, setScores] = useState({});
  const [topClub, setTopClub] = useState("");

  // Shuffle questions once when component mounts
  const shuffledQuestions = useMemo(() => {
    const qCopy = [...originalQuestions];
    for (let i = qCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qCopy[i], qCopy[j]] = [qCopy[j], qCopy[i]];
    }
    return qCopy;
  }, []);

  const [questions] = useState(shuffledQuestions);

  const answer = (clubsObj) => {
    setScores((prev) => {
      const updated = { ...prev };
      for (const club in clubsObj) {
        updated[club] = (updated[club] || 0) + clubsObj[club];
      }
      return updated;
    });
    setCurrentQ((prevQ) => prevQ + 1);
  };

  const resetQuiz = () => {
    setScores({});
    setTopClub("");
    setCurrentQ(0);
  };

  return (
    <QuizContext.Provider
      value={{
        currentQ,
        setCurrentQ,
        answer,
        scores,
        setScores,
        topClub,
        setTopClub,
        resetQuiz,
        questions // Export questions for use in components
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
