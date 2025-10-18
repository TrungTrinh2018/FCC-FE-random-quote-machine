import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const PALETTE = [
  "#f05f57",
  "#27ae60",
  "#8e44ad",
  "#2c3e50",
  "#e67e22",
  "#16a085",
  "#c0392b",
  "#2980b9",
];

const QUOTES = [
  {
    text: "If you hear a voice within you say 'you cannot paint,' then by all means paint and that voice will be silenced.",
    author: "Vincent Van Gogh",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  {
    text: "Programs must be written for people to read.",
    author: "Harold Abelson",
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
];

const rand = (n) => Math.floor(Math.random() * n);
const nextIndex = (len, exclude) => {
  if (len < 2) return 0;
  let i = exclude;
  while (i === exclude) i = rand(len);
  return i;
};

export default function App() {
  const [qIndex, setQIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | out | in
  const [busy, setBusy] = useState(false); // khóa nút khi animating

  useEffect(() => {
    setQIndex(rand(QUOTES.length));
    setCIndex(rand(PALETTE.length));
  }, []);

  const color = PALETTE[cIndex];
  const { text, author } = QUOTES[qIndex] || { text: "", author: "" };

  const handleNewQuote = () => {
    if (busy) return; // chặn spam click
    setBusy(true);

    // 3s tổng: 1.5s out -> đổi -> 1.5s in
    setPhase("out");
    setTimeout(() => {
      setQIndex((i) => nextIndex(QUOTES.length, i));
      setCIndex((i) => nextIndex(PALETTE.length, i));
      setPhase("in");
      setTimeout(() => {
        setPhase("idle");
        setBusy(false);
      }, 1500);
    }, 1500);
  };

  const tweetHref =
    "https://twitter.com/intent/tweet?hashtags=quotes&text=" +
    encodeURIComponent(`"${text}" — ${author}`);

  const fadeClass = phase === "out" ? "fade-quote out" : "fade-quote";

  return (
    <div
      className="app-wrap d-flex justify-content-center align-items-center"
      style={{ backgroundColor: color }}
    >
      <div
        id="quote-box"
        className="bg-white rounded-3 shadow p-4 mx-3"
        style={{ color }}
      >
        {/* text */}
        <div id="text" className={`mb-2 ${fadeClass}`}>
          <i className="fa-solid fa-quote-left me-2" aria-hidden="true"></i>
          {text}
        </div>

        {/* author */}
        <div id="author" className={`text-end mb-4 ${fadeClass}`}>
          — {author}
        </div>

        {/* actions: tweet (trái) + new quote (phải) */}
        <div className="d-flex justify-content-between">
          <a
            id="tweet-quote"
            className="btn text-white"
            style={{ backgroundColor: color }}
            href={tweetHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tweet this quote"
            title="Tweet this quote"
          >
            Tweet
          </a>

          <button
            id="new-quote"
            className="btn text-white"
            style={{ backgroundColor: color }}
            onClick={handleNewQuote}
            type="button"
            disabled={busy}
          >
            New quote
          </button>
        </div>
      </div>
    </div>
  );
}
