// src/components/Result.jsx
import { useEffect, useState, useRef } from "react";
import { useQuiz } from "../context/QuizContext";
import { motion } from "framer-motion";
import { useWindowSize } from "@uidotdev/usehooks";
import { clubReasons } from "../data/clubReasons";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";

const clubColors = {
  "Arsenal": { primary: "#EF0107", secondary: "#FBE122" },
  "AFC Bournemouth": { primary: "#DA291C", secondary: "#000000" },
  "Aston Villa": { primary: "#DA291C", secondary: "#FEE505" },
  "Brentford": { primary: "#D20000", secondary: "#FFB400" },
  "Brighton & Hove Albion": { primary: "#0057B8", secondary: "#FFCD00" },
  "Burnley": { primary: "#6C1D45", secondary: "#EDE939" },
  "Chelsea": { primary: "#034694", secondary: "#DBA111" },
  "Crystal Palace": { primary: "#1B458F", secondary: "#F8E71C" },
  "Everton": { primary: "#003399", secondary: "#F5A300" },
  "Fulham": { primary: "#FFFFFF", secondary: "#CC0000" },
  "Leeds United": { primary: "#FFFFFF", secondary: "#F6EB61" },
  "Liverpool": { primary: "#C8102E", secondary: "#FFFFFF" },
  "Manchester City": { primary: "#6CABDD", secondary: "#EC3325" },
  "Manchester United": { primary: "#DA291C", secondary: "#FFFFFF" },
  "Newcastle United": { primary: "#241F20", secondary: "#41B6E6" },
  "Nottingham Forest": { primary: "#DD0000", secondary: "#FFFFFF" },
  "Sunderland": { primary: "#EB172C", secondary: "#002060" },
  "Tottenham Hotspur": { primary: "#FFFFFF", secondary: "#FEDB00" },
  "West Ham United": { primary: "#7A263A", secondary: "#1BB1E7" },
  "Wolverhampton Wanderers": { primary: "#FDB913", secondary: "#FFFFFF" },
};

const gradientOverrides = {
  "AFC Bournemouth": "linear-gradient(to bottom right, #DA291C, #333333)",
  "Fulham": "linear-gradient(to bottom right, #CC0000, #f5f5f5)",
  "Tottenham Hotspur": "linear-gradient(to bottom right, #FEDB00, #001f3f)",
};

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 180;
}

export default function Result() {
  const { scores, topClub, setTopClub, resetQuiz } = useQuiz();
  const { width, height } = useWindowSize();
  const [copied, setCopied] = useState(false);
  const [isBrightBackground, setIsBrightBackground] = useState(false);
  const exportCardRef = useRef(null);

  useEffect(() => {
    if (!topClub && Object.keys(scores).length > 0) {
      const max = Math.max(...Object.values(scores));
      const topClubs = Object.entries(scores)
        .filter(([_, score]) => score === max)
        .map(([club]) => club);
      const chosen = topClubs[Math.floor(Math.random() * topClubs.length)];
      setTopClub(chosen);
    }
  }, [scores, topClub, setTopClub]);

  useEffect(() => {
    if (topClub && width && height) {
      const { primary, secondary } = clubColors[topClub] || {
        primary: "#ffffff",
        secondary: "#000000",
      };
      confetti({
        particleCount: 400,
        angle: 90,
        spread: 140,
        startVelocity: 30,
        origin: { x: 0.5, y: 0 },
        colors: [primary, secondary, "#ffffff", "#000000"],
        scalar: 1.1,
      });
    }
  }, [topClub, width, height]);

  useEffect(() => {
    if (topClub) {
      const originalColors = clubColors[topClub] || {
        primary: "#ffffff",
        secondary: "#000000",
      };

      const rawPrimary = originalColors.primary;
      const rawSecondary = originalColors.secondary;

      let primary = rawPrimary;
      let secondary = rawSecondary;

      const similar = primary.toLowerCase() === secondary.toLowerCase();
      const fallbackSecondary = isLight(primary) ? "#111111" : "#f0f0f0";

      if (similar) {
        secondary = fallbackSecondary;
      }

      if (secondary === "#000000" || secondary === "#ffffff") {
        secondary = isLight(primary) ? "#222" : "#eee";
      }

      const bg =
        gradientOverrides[topClub] ||
        `linear-gradient(135deg, ${secondary} 0%, ${primary} 75%)`;

      document.body.style.background = bg;

      const clubHasWhite =
        rawPrimary.toUpperCase() === "#FFFFFF" ||
        rawSecondary.toUpperCase() === "#FFFFFF";

      setIsBrightBackground(clubHasWhite || isLight(secondary));
    }
  }, [topClub]);

  if (!topClub || Object.keys(scores).length === 0) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-yellow-100 text-yellow-800 rounded shadow-md">
        <p>Calculating your results…</p>
      </div>
    );
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const secondaryClubs = sorted.filter(([club]) => club !== topClub).slice(0, 2);
  const { primary } = clubColors[topClub];
  const textColorClass = isLight(primary) ? "text-black" : "text-white";

  const resultText = `🏆 I got ${topClub} on the Premier League Personality Quiz!\n\nAccording to the quiz, ${clubReasons[topClub].me}\n\nTake the quiz 👉 https://premierleaguequiz.vercel.app/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const node = exportCardRef.current;
    html2canvas(node, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${topClub}_quiz_result.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <>
      {/* Hidden export card */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
          background: primary,
          padding: "2rem",
        }}
      >
        <div
          ref={exportCardRef}
          className="p-8 shadow-xl w-[600px] h-auto text-center"
          style={{
            background: primary,
            color: isLight(primary) ? "#000000" : "#ffffff",
            borderRadius: "0px",
          }}
        >
          <h1 className="text-3xl font-bold mb-4">🏆 {topClub}</h1>
          <p className="text-md italic mb-6 leading-relaxed">{clubReasons[topClub].you}</p>
          <hr className="my-6 border-gray-300 opacity-50" />
          <h2 className="text-lg font-semibold underline mb-2">Clubs I Also Resonate With:</h2>
          <ul className="text-sm text-left px-6 space-y-3">
            {secondaryClubs.map(([club], idx) => (
              <li key={club}>
                {["🥈", "🥉"][idx]} <strong>{club}</strong> — {clubReasons[club].you}
              </li>
            ))}
          </ul>
          <p className="text-xs mt-6 opacity-70">Premier League Personality Quiz by Joshua</p>
        </div>
      </div>

      {/* Main result card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pt-4 sm:pt-6 md:pt-10">
        <div
          style={{
            background: primary,
            border: `2px solid ${primary}`,
            boxShadow: `0 0 50px ${primary}aa, 0 0 100px ${primary}55`,
          }}
          className={`p-6 sm:p-10 rounded-2xl ${textColorClass} text-center space-y-6 animate-fade-in transition-all duration-500 max-w-3xl w-[92%]`}
        >
          <h2 className="text-2xl font-bold">You're most like:</h2>
          <h1 className="text-4xl font-extrabold">{topClub}</h1>
          <p className="italic opacity-90">
            {clubReasons[topClub]?.you || "🧩 You're one of a kind — no club can contain you."}
          </p>

          <div>
            <h3 className="font-semibold text-lg mb-2 underline">Clubs You Also Resonate With:</h3>
            <ul className="space-y-4 text-sm opacity-95 text-left max-w-3xl mx-auto">
              {secondaryClubs.map(([club], idx) => (
                <li key={club}>
                  {["🥈", "🥉"][idx]}{" "}
                  <span className="font-semibold">{club}</span> –{" "}
                  {clubReasons[club]?.you || ""}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition"
            >
              {copied ? "📋 Copied!" : "📋 Copy Your Result"}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
            >
              📸 Download Shareable Card
            </button>
          </div>

          <motion.button
            onClick={resetQuiz}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className={`mt-6 px-4 py-2 text-sm rounded-lg border ${
              isLight(primary)
                ? "text-black border-black hover:bg-black/10"
                : "text-white border-white hover:bg-white/10"
            } transition-all`}
          >
            🔄 Take the quiz again
          </motion.button>
        </div>
      </div>
    </>
  );
}
