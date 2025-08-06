// src/components/Welcome.jsx
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";

export default function Welcome() {
  const { setCurrentQ, setTopClub, setScores } = useQuiz();

  const handleStart = () => {
    setScores({});
    setTopClub("");
    setCurrentQ(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/10 backdrop-blur-xl text-white rounded-2xl shadow-xl px-4 sm:px-8 py-10 sm:py-12 w-full max-w-2xl text-center animate-fadeIn"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-white">
        ⚽ Premier League<br />Personality Quiz
      </h1>

      <p className="text-lg text-white/90 mb-8">
        Find out which Premier League club matches your personality.<br />
        30 fun questions. No football knowledge needed.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        className="px-6 py-3 rounded-lg bg-purple-200 hover:bg-purple-300 text-purple-800 font-semibold shadow-md transition-all"
      >
        👉 Start the Quiz
      </motion.button>
    </motion.div>
  );
}
