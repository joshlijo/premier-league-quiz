// src/App.jsx
import { useQuiz } from "./context/QuizContext";
import Question from "./components/Question";
import Result from "./components/Result";
import Welcome from "./components/Welcome";
import FootballProgress from "./components/FootballProgress";
import Footer from "./components/Footer";
import { Analytics } from '@vercel/analytics/react';

// Clubs that need black footer text
const clubsWithWhite = [
  "Fulham",
  "Tottenham Hotspur",
  "Leeds United",
  "Liverpool",
  "Manchester United",
  "Nottingham Forest",
  "Wolverhampton Wanderers",
];

export default function App() {
  const { currentQ, topClub, questions } = useQuiz();

  // Background gradient logic
  const gradientSteps = [
    "linear-gradient(to right, #3b82f6, #60a5fa)",
    "linear-gradient(to right, #60a5fa, #6366f1)",
    "linear-gradient(to right, #6366f1, #8b5cf6)",
    "linear-gradient(to right, #8b5cf6, #a855f7)",
    "linear-gradient(to right, #a855f7, #ec4899)",
    "linear-gradient(to right, #ec4899, #f43f5e)",
    "linear-gradient(to right, #f43f5e, #f97316)",
    "linear-gradient(to right, #f97316, #14b8a6)",
    "linear-gradient(to right, #14b8a6, #0ea5e9)",
    "linear-gradient(to right, #0ea5e9, #10b981)",
  ];

  let bgImage;
  if (currentQ === -1) {
    bgImage = "linear-gradient(to right, #9333ea, #f43f5e)";
  } else if (currentQ >= questions.length) {
    bgImage = undefined; // Let Result.jsx take full control
  } else {
    bgImage = gradientSteps[currentQ % gradientSteps.length];
  }

  // Footer brightness logic
  const isResultPage = currentQ >= questions.length;
  const isBrightFooter = isResultPage && clubsWithWhite.includes(topClub);

  return (
    <div
      style={{
        ...(bgImage && { backgroundImage: bgImage }),
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
      className="h-screen w-screen flex flex-col overflow-hidden"
    >
      <div className="pt-4 px-4">
        <FootballProgress />
      </div>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl sm:px-6 px-4 flex items-center justify-center -translate-y-4">
          {currentQ === -1 ? (
            <Welcome />
          ) : currentQ < questions.length ? (
            <Question />
          ) : (
            <Result />
          )}
        </div>
      </main>

      {/* ✅ Footer always visible, only dark on result page for white clubs */}
      <Footer isBright={isBrightFooter} />

      {/* ✅ Vercel Analytics tracking */}
      <div id="analytics-wrapper">
        {console.log("📈 Rendering <Analytics /> now")}
        <Analytics />
      </div>
    </div>
  );
}
