import { useQuiz } from "../context/QuizContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FootballProgress() {
  const { currentQ, questions } = useQuiz();
  const total = questions.length;

  if (currentQ === -1) return null;

  const isResult = currentQ >= total;

  const startPercent = 1.5;
  const endPercent = 97;
  const clampedQ = Math.min(currentQ, total - 1);

  const percent = startPercent + (clampedQ / (total - 1)) * (endPercent - startPercent);
  const left = `calc(${percent}% - 0.25rem)`; // offset to center ball

  return (
    <div className="absolute bottom-10 left-0 w-full h-20 z-50 pointer-events-none overflow-hidden">
      {/* Dotted Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 border-t border-dotted border-white opacity-30" />

      {/* Ball */}
      <AnimatePresence>
        {!isResult && (
          <motion.div
            key="ball"
            initial={false}
            animate={{ left }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute bottom-[0.35rem] animate-bounce"
            style={{ width: "3rem", position: "absolute" }}
          >
            <FootballSVG />
          </motion.div>
        )}

        {isResult && (
          <motion.div
            key="flyoff"
            initial={{ left: "calc(97% - 0.25rem)", bottom: "0.35rem", opacity: 1 }}
            animate={{ x: 100, y: -100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              width: "3rem",
              position: "absolute",
              pointerEvents: "none",
            }}
          >
            <FootballSVG />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FootballSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="white"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10 drop-shadow-md"
    >
      <circle cx="128" cy="128" r="96" />
      <polygon points="128 88 88 115.5 103.28 160 152.72 160 168 115.5 128 88" />
      <line x1="128" y1="64" x2="128" y2="88" />
      <line x1="65.17" y1="108.09" x2="88" y2="115.5" />
      <line x1="89.17" y1="179.42" x2="103.28" y2="160" />
      <line x1="166.83" y1="179.42" x2="152.72" y2="160" />
      <line x1="190.83" y1="108.09" x2="168" y2="115.5" />
      <polyline points="164.25 39.08 128 64 91.75 39.08" />
      <polyline points="223.85 133.42 190.82 108.08 202.77 67.78" />
      <polyline points="53.23 67.78 65.17 108.08 32.15 133.42" />
      <polyline points="152.13 220.94 166.83 179.42 209.08 179.42" />
      <polyline points="46.92 179.42 89.17 179.42 103.87 220.94" />
    </svg>
  );
}
