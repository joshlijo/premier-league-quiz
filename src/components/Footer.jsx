// src/components/Footer.jsx
export default function Footer({ isBright }) {
  return (
    <footer
      className={`text-base font-medium text-center py-4 ${
        isBright ? "text-black" : "text-white/90 drop-shadow-md"
      }`}
    >
      Made by Joshua ⚽
    </footer>
  );
}
