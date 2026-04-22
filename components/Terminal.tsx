"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SnakeGame from "./SnakeGame";
import WordleGame, { WORDS_EN, WORDS_TR, getColors } from "./WordleGame";
import { VALID_EN, VALID_TR } from "@/lib/wordle-valid";
import type { GuessRow } from "./WordleGame";

type HistoryEntry = { input: string; output: string[] };
type WordleLang = "en" | "tr";
type GameMode = { type: "snake" } | { type: "wordle"; lang: WordleLang } | null;
type SubmitState =
  | { type: "snake"; score: number }
  | { type: "wordle"; streak: number; lang: WordleLang }
  | null;

async function fetchLeaderboard(type: "snake" | "wordle", lang = "en"): Promise<string[]> {
  try {
    const url = type === "snake"
      ? "/api/leaderboard/snake"
      : `/api/leaderboard/wordle?lang=${lang}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json() as { username: string; score?: number; streak?: number }[];

    const divider = "  ─────────────────────────────────────";
    const title = type === "snake" ? "  snake leaderboard" : `  wordle streaks [${lang}]`;
    const colHeader = type === "snake"
      ? "  rank  name                pts"
      : "  rank  name               streak";

    if (data.length === 0) {
      return [title, divider, colHeader, divider, "  (no entries yet)", divider];
    }

    const rows = data.map((row, i) => {
      const rank = `${i + 1}.`.padEnd(6);
      const name = (row.username ?? "").replace(/[\r\n\t]/g, "").slice(0, 18).padEnd(19);
      const val = type === "snake" ? String(row.score ?? 0) : String(row.streak ?? 0);
      return `  ${rank}${name}${val}`;
    });

    return [title, divider, colHeader, divider, ...rows, divider];
  } catch {
    return ["  could not load leaderboard"];
  }
}

const HELP_OUTPUT = [
  "  available commands",
  "  ──────────────────────────────────────────",
  "  about      →  scroll to About",
  "  work       →  scroll to Work Experience",
  "  skills     →  scroll to Tech Stack",
  "  projects   →  scroll to Projects",
  "  contact    →  scroll to Contact",
  "  resume     →  download resume PDF",
  "  github     →  open GitHub profile",
  "  linkedin   →  open LinkedIn profile",
  "  whoami     →  who is this person?",
  "  ls         →  list all sections",
  "  ──────────────────────────────────────────",
  "  snake               →  play snake",
  "  wordle / wordle tr  →  play wordle",
  "  leaderboard [snake|wordle|wordle tr]",
  "  ──────────────────────────────────────────",
  "  clear      →  clear terminal",
  "  exit / q   →  close terminal",
];

const WHOAMI_OUTPUT = [
  "  Ismet Bilgic",
  "  ──────────────────────────────────────────",
  "  role       Software Engineer · Data Engineer",
  "  school     University of Ottawa (BASc SWE)",
  "  gpa        3.94 / 4.0  ·  Chancellor's Scholar",
  "  status     ● available for opportunities",
  "  based      Ottawa, ON 🇨🇦",
];

const LS_OUTPUT = ["  /about   /work   /skills   /projects   /contact"];

function processCommand(
  raw: string,
  close: () => void,
  startGame: (mode: GameMode) => void
): { output: string[]; action?: () => void } {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "help" || cmd === "?") return { output: HELP_OUTPUT };
  if (cmd === "whoami") return { output: WHOAMI_OUTPUT };
  if (cmd === "ls") return { output: LS_OUTPUT };
  if (cmd === "clear") return { output: [] };
  if (cmd === "exit" || cmd === "q") return { output: ["  closing terminal..."], action: close };

  if (cmd === "snake") return { output: [], action: () => startGame({ type: "snake" }) };
  if (cmd === "wordle" || cmd === "wordle en") return { output: [], action: () => startGame({ type: "wordle", lang: "en" }) };
  if (cmd === "wordle tr") return { output: [], action: () => startGame({ type: "wordle", lang: "tr" }) };

  if (["about", "work", "skills", "projects", "contact"].includes(cmd)) {
    const id = cmd === "work" ? "experience" : cmd;
    return {
      output: [`  → navigating to /${cmd}...`],
      action: () => { close(); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300); },
    };
  }

  if (cmd === "resume") {
    return {
      output: ["  → downloading ISMET_BILGIC_RESUME.pdf..."],
      action: () => { const a = document.createElement("a"); a.href = "/ISMET_BILGIC_RESUME.pdf"; a.download = "ISMET_BILGIC_RESUME.pdf"; a.click(); },
    };
  }

  if (cmd === "github") return { output: ["  → opening github.com/blgcismt..."], action: () => window.open("https://github.com/blgcismt", "_blank") };
  if (cmd === "linkedin") return { output: ["  → opening linkedin.com/in/ismtblgc..."], action: () => window.open("https://linkedin.com/in/ismtblgc", "_blank") };
  if (cmd === "") return { output: [] };

  return { output: [`  command not found: ${raw.trim()}`, "  type 'help' for available commands"] };
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [navIdx, setNavIdx] = useState(-1);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [submitState, setSubmitState] = useState<SubmitState>(null);

  // Wordle state
  const [wordleAnswer, setWordleAnswer] = useState("");
  const [wordleLang, setWordleLang] = useState<WordleLang>("en");
  const [wordleGuesses, setWordleGuesses] = useState<GuessRow[]>([]);
  const [wordleGameOver, setWordleGameOver] = useState(false);
  const [wordleWon, setWordleWon] = useState(false);
  const [wordleError, setWordleError] = useState("");
  const [wordleStreak, setWordleStreak] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setInput("");
    setNavIdx(-1);
    setGameMode(null);
    setSubmitState(null);
    setHistory([]);
    setWordleGuesses([]);
    setWordleGameOver(false);
    setWordleWon(false);
    setWordleError("");
    setWordleStreak(0);
  }, []);

  const startWordleGame = useCallback((lang: WordleLang) => {
    const words = lang === "en" ? WORDS_EN : WORDS_TR;
    const dayIndex = Math.floor(Date.now() / 86400000); // UTC days since epoch
    const answer = words[dayIndex % words.length];
    setWordleAnswer(answer);
    setWordleLang(lang);
    setWordleGuesses([]);
    setWordleGameOver(false);
    setWordleWon(false);
    setWordleError("");
    setGameMode({ type: "wordle", lang });
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    if (mode?.type === "wordle") startWordleGame(mode.lang);
    else setGameMode(mode);
  }, [startWordleGame]);

  const saveToLeaderboard = useCallback(async (pending: NonNullable<SubmitState>, username: string) => {
    const label = pending.type === "snake" ? `snake score [${pending.score}]` : `wordle streak`;
    setHistory(prev => [...prev, { input: `→ saving ${label}`, output: ["  saving..."] }]);

    try {
      const endpoint = pending.type === "snake" ? "/api/leaderboard/snake" : "/api/leaderboard/wordle";
      // Wordle: server computes streak from last_win_day — don't send streak from client
      const body = pending.type === "snake"
        ? { username, score: pending.score }
        : { username, lang: pending.lang };

      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await res.json() as { ok?: boolean; streak?: number; error?: string };

      const lang = pending.type === "wordle" ? pending.lang : "en";
      const board = await fetchLeaderboard(pending.type, lang);

      let topLine: string;
      if (res.status === 409) {
        topLine = `  already submitted today — current streak: ${result.streak}`;
      } else if (pending.type === "snake") {
        topLine = "  ✓ score saved!";
      } else {
        topLine = `  ✓ streak saved! — now at ${result.streak}`;
      }

      setHistory(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], output: [topLine, "", ...board] };
        return next;
      });
    } catch {
      setHistory(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], output: ["  failed to save — check connection"] };
        return next;
      });
    }
  }, []);

  const handleWordleGuess = useCallback((raw: string) => {
    const guess = raw.trim().toLowerCase();
    if (guess === "q") { setGameMode(null); return; }
    if (guess === "s" && wordleGameOver && wordleStreak > 0) {
      setGameMode(null);
      setSubmitState({ type: "wordle", streak: wordleStreak, lang: wordleLang });
      return;
    }
    if (wordleGameOver) return;

    const answerChars = Array.from(wordleAnswer);
    const guessChars = Array.from(guess);

    if (guessChars.length !== answerChars.length) {
      setWordleError(`  must be exactly ${answerChars.length} characters`);
      return;
    }

    const validSet = wordleLang === "tr" ? VALID_TR : VALID_EN;
    if (!validSet.has(guess)) {
      setWordleError("  not a valid word");
      return;
    }

    const colors = getColors(guessChars, answerChars);
    const newGuesses: GuessRow[] = [...wordleGuesses, { letters: guessChars, colors }];
    const won = colors.every(c => c === "green");
    const lost = !won && newGuesses.length >= 6;

    setWordleGuesses(newGuesses);
    setWordleError("");
    if (won || lost) {
      setWordleGameOver(true);
      setWordleWon(won);
      if (won) setWordleStreak(prev => prev + 1);
      else setWordleStreak(0);
    }
  }, [wordleAnswer, wordleLang, wordleGuesses, wordleGameOver, wordleStreak]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") {
        if (submitState) { setSubmitState(null); return; }
        if (gameMode) { setGameMode(null); return; }
        close();
        return;
      }
      if (
        (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") ||
        (e.key === "k" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpenEvent);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-terminal", onOpenEvent); };
  }, [open, close, gameMode, submitState]);

  useEffect(() => {
    if (open && gameMode?.type !== "snake") setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, gameMode, submitState]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, wordleGuesses]);

  const submit = () => {
    const raw = input;

    // Name entry for leaderboard submission
    if (submitState) {
      const name = raw.trim().slice(0, 20);
      if (!name) return;
      const pending = submitState;
      setSubmitState(null);
      setInput("");
      setNavIdx(-1);
      void saveToLeaderboard(pending, name);
      return;
    }

    // Wordle game input
    if (gameMode?.type === "wordle") {
      handleWordleGuess(raw);
      setInput("");
      setNavIdx(-1);
      return;
    }

    const cmd = raw.trim().toLowerCase();

    if (cmd === "clear") { setHistory([]); setInput(""); setNavIdx(-1); return; }

    // Async leaderboard command
    if (cmd.startsWith("leaderboard")) {
      const parts = cmd.split(/\s+/);
      const type = parts[1] === "wordle" ? "wordle" : "snake";
      const lang: WordleLang = parts[2] === "tr" ? "tr" : "en";

      setHistory(prev => [...prev, { input: raw, output: ["  loading..."] }]);
      setInput("");
      setNavIdx(-1);
      fetchLeaderboard(type, lang).then(output => {
        setHistory(prev => { const next = [...prev]; next[next.length - 1] = { ...next[next.length - 1], output }; return next; });
      });
      return;
    }

    const { output, action } = processCommand(raw, close, startGame);
    setHistory(prev => [...prev, { input: raw, output }]);
    setInput("");
    setNavIdx(-1);
    if (action) setTimeout(action, 120);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { submit(); return; }
    if (gameMode || submitState) return;
    const inputs = history.map(h => h.input).filter(Boolean).reverse();
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(navIdx + 1, inputs.length - 1);
      setNavIdx(next);
      setInput(inputs[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = navIdx - 1;
      if (next < 0) { setNavIdx(-1); setInput(""); }
      else { setNavIdx(next); setInput(inputs[next] ?? ""); }
    }
  };

  const titleLabel = submitState
    ? `saving ${submitState.type === "snake" ? "snake score" : "wordle streak"}...`
    : gameMode?.type === "snake"
    ? "snake"
    : gameMode?.type === "wordle"
    ? `wordle [${gameMode.lang}]`
    : "terminal";

  const escLabel = submitState ? "cancel" : gameMode ? "exit game" : "to close";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9998, backdropFilter: "blur(4px)" }}
          />

          {/* Centering wrapper — keeps position separate from Framer Motion transforms */}
          <div className="terminal-modal-wrap">
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: "min(640px, 92vw)",
              border: "1px solid var(--border)", background: "#0d0d14",
              display: "flex", flexDirection: "column",
              boxShadow: "0 0 60px rgba(0,212,255,0.08)",
            }}
          >
            {/* Title bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.025)", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <div onClick={close} style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: "#ff5f57", cursor: "pointer" }} />
                <div style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: "#28c840" }} />
              </div>
              <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                ismet@portfolio:~$ {titleLabel}
              </span>
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                ESC {escLabel}
              </span>
            </div>

            {/* Output area */}
            <div className="px-4 sm:px-6 py-4 sm:py-5" style={{ flex: 1, overflowY: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.8 }}>
              {gameMode?.type === "snake" ? (
                <SnakeGame
                  onQuit={() => setGameMode(null)}
                  onSaveScore={score => { setGameMode(null); setSubmitState({ type: "snake", score }); }}
                />
              ) : gameMode?.type === "wordle" ? (
                <WordleGame
                  lang={wordleLang}
                  answer={wordleAnswer}
                  guesses={wordleGuesses}
                  currentInput={input}
                  gameOver={wordleGameOver}
                  won={wordleWon}
                  error={wordleError}
                  streak={wordleStreak}
                />
              ) : (
                <>
                  {history.length === 0 && (
                    <div style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                      <div style={{ color: "var(--accent)", marginBottom: "0.25rem" }}>ismet@portfolio — interactive terminal</div>
                      <div>type <span style={{ color: "var(--accent)" }}>help</span> to see available commands</div>
                    </div>
                  )}
                  {history.map((entry, i) => (
                    <div key={i} style={{ marginBottom: "0.75rem" }}>
                      <div style={{ color: "var(--accent)" }}>
                        <span style={{ color: "var(--accent2)", opacity: 0.7 }}>ismet@portfolio</span>
                        <span style={{ color: "var(--text-muted)" }}>:~$ </span>
                        {entry.input}
                      </div>
                      {entry.output.map((line, j) => (
                        <div
                          key={j}
                          style={{
                            color: line.includes("not found") ? "#ef4444"
                              : line.includes("●") ? "#34d399"
                              : line.includes("──") ? "var(--border)"
                              : line.startsWith("  →") || line.startsWith("  ✓") ? "var(--accent3)"
                              : line.startsWith("  failed") ? "#ef4444"
                              : "var(--text-muted)",
                            whiteSpace: "pre",
                          }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input row — hidden during snake game */}
            {gameMode?.type !== "snake" && (
              <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
                {submitState ? (
                  <>
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#f59e0b", flexShrink: 0 }}>
                      save {submitState.type === "snake" ? `snake [${submitState.score} pts]` : `streak [${submitState.streak}]`}
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>→ name:</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--accent2)", opacity: 0.7, flexShrink: 0 }}>ismet@portfolio</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}>:~$</span>
                  </>
                )}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    fontFamily: "monospace", fontSize: "0.8rem",
                    color: "var(--text)", caretColor: "var(--accent)",
                  }}
                />
              </div>
            )}
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
