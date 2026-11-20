"use client";

import { useState, type ReactNode } from "react";
import { getResult, type Cell, type Mark } from "@/lib/game";

type ThemeKey = "classic" | "pets" | "food";

const THEMES: Record<
  ThemeKey,
  { label: string; names: Record<Mark, string>; render: (m: Mark, small?: boolean) => ReactNode }
> = {
  classic: {
    label: "Classic",
    names: { X: "X", O: "O" },
    render: (m, small) => {
      const size = small ? "h-6 w-6" : "h-3/5 w-3/5";
      const common = {
        viewBox: "0 0 100 100",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 12,
        strokeLinecap: "round" as const,
        "aria-hidden": true,
      };
      return m === "X" ? (
        <svg {...common} className={`${size} text-[#ff5c8a]`}>
          <path className="draw" pathLength={100} d="M22 22 L78 78" />
          <path className="draw" pathLength={100} d="M78 22 L22 78" style={{ animationDelay: ".15s" }} />
        </svg>
      ) : (
        <svg {...common} className={`${size} text-[#1b2559]`}>
          <circle className="draw" pathLength={100} cx="50" cy="50" r="30" />
        </svg>
      );
    },
  },
  pets: {
    label: "Pets",
    names: { X: "Cat", O: "Dog" },
    render: (m, small) => (
      <span className={`pop ${small ? "text-2xl" : "text-5xl sm:text-6xl"}`} aria-hidden>
        {m === "X" ? "🐱" : "🐶"}
      </span>
    ),
  },
  food: {
    label: "Snacks",
    names: { X: "Pizza", O: "Donut" },
    render: (m, small) => (
      <span className={`pop ${small ? "text-2xl" : "text-5xl sm:text-6xl"}`} aria-hidden>
        {m === "X" ? "🍕" : "🍩"}
      </span>
    ),
  },
};

const EMPTY: Cell[] = Array(9).fill(null);
const other = (m: Mark): Mark => (m === "X" ? "O" : "X");

export default function Game() {
  const [theme, setTheme] = useState<ThemeKey>("classic");
  const [board, setBoard] = useState<Cell[]>(EMPTY);
  const [starter, setStarter] = useState<Mark>("X");
  const [turn, setTurn] = useState<Mark>("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const t = THEMES[theme];
  const result = getResult(board);
  const winLine = result?.kind === "win" ? result.line : [];

  function play(i: number) {
    if (board[i] || result) return;
    const next = board.slice();
    next[i] = turn;
    setBoard(next);

    const r = getResult(next);
    if (r?.kind === "win") setScores((s) => ({ ...s, [r.winner]: s[r.winner] + 1 }));
    else if (r?.kind === "draw") setScores((s) => ({ ...s, draws: s.draws + 1 }));
    else setTurn(other(turn));
  }

  function newGame() {
    const nextStarter = other(starter); // players take turns going first
    setStarter(nextStarter);
    setTurn(nextStarter);
    setBoard(EMPTY);
  }

  function resetAll() {
    setScores({ X: 0, O: 0, draws: 0 });
    setStarter("X");
    setTurn("X");
    setBoard(EMPTY);
  }

  const status =
    result?.kind === "win"
      ? `${t.names[result.winner]} wins!`
      : result?.kind === "draw"
        ? "It's a draw"
        : `${t.names[turn]}'s turn`;

  return (
    <section className="flex w-full flex-col items-center gap-5">
      {/* Theme picker */}
      <div role="group" aria-label="Choose a theme" className="flex rounded-full border-2 border-[#1b2559] bg-white p-1">
        {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setTheme(k)}
            aria-pressed={theme === k}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              theme === k ? "bg-[#1b2559] text-white" : "text-[#1b2559] hover:bg-[#ffe45e]"
            }`}
          >
            {THEMES[k].label}
          </button>
        ))}
      </div>

      {/* Status */}
      <p aria-live="polite" className="flex h-10 items-center gap-2 text-2xl font-bold">
        {!result && t.render(turn, true)}
        {status}
      </p>

      {/* Board */}
      <div className="grid w-full max-w-[22rem] grid-cols-3 gap-[3px] overflow-hidden rounded-2xl bg-[#1b2559] p-[3px] shadow-[6px_6px_0_#1b2559]">
        {board.map((cell, i) => {
          const isWin = winLine.includes(i);
          return (
            <button
              key={i}
              onClick={() => play(i)}
              disabled={!!cell || !!result}
              aria-label={`Square ${i + 1}, ${cell ? t.names[cell] : "empty"}`}
              className={`flex aspect-square items-center justify-center transition-colors ${
                isWin ? "bg-[#ffe45e]" : "bg-white enabled:hover:bg-[#eef2fb]"
              } disabled:cursor-default`}
            >
              {cell && t.render(cell)}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={newGame}
          className="rounded-full bg-[#ff5c8a] px-6 py-2.5 font-bold text-white shadow-[3px_3px_0_#1b2559] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          New Game
        </button>
        <button
          onClick={resetAll}
          className="rounded-full border-2 border-[#1b2559] bg-white px-5 py-2 font-semibold hover:bg-[#ffe45e]"
        >
          Reset scores
        </button>
      </div>

      {/* Scoreboard */}
      <dl className="grid w-full max-w-[22rem] grid-cols-3 gap-3 text-center">
        {[
          { label: t.names.X, value: scores.X },
          { label: "Draws", value: scores.draws },
          { label: t.names.O, value: scores.O },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border-2 border-[#1b2559] bg-white py-2">
            <dd className="text-3xl font-extrabold tabular-nums">{s.value}</dd>
            <dt className="text-sm font-medium">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
