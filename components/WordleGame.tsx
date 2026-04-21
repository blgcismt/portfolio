"use client";

export const WORDS_EN = [
  "react", "stack", "async", "query", "debug", "array", "class", "fetch",
  "state", "props", "build", "cache", "parse", "scope", "types", "proxy",
  "hooks", "event", "await", "error", "pixel", "modal", "route", "token",
  "merge", "patch", "index", "cloud", "model", "logic", "style", "input",
  "table", "chart", "graph", "queue", "frame", "store", "media", "serve",
  "codec", "agent", "local", "float", "split", "regex", "shell", "alias",
  "crash", "spawn", "mutex", "chunk", "yield", "macro", "tuple", "union",
  "loops", "bytes", "nodes", "redux", "axios", "clone", "swift", "heaps",
];

export const WORDS_TR = [
  "kitap", "kalem", "araba", "deniz", "haber", "resim", "yemek", "bilgi",
  "nehir", "uzman", "orman", "insan", "hayat", "sabah", "erkek", "paket",
  "fikir", "dergi", "kural", "yazar", "noter", "ekran", "girdi", "dosya",
  "şehir", "müzik", "güzel", "köpek", "çocuk", "büyük", "küçük", "çanta",
  "balık", "doğru", "bölüm", "yüzük", "köprü", "yarış", "akşam", "şeker",
  "çiçek", "şarkı", "sınıf", "fırın", "çıktı", "tabak", "kanat", "simit",
  "asker", "temel", "sebze", "meyve", "takım", "geçit", "çözüm", "keman",
  "beyin", "sevgi", "tablo", "müdür", "özgür", "devir", "başka", "şişko",
];

export type Color = "green" | "yellow" | "gray" | "empty";
export interface GuessRow { letters: string[]; colors: Color[]; }

export function getColors(guess: string[], answer: string[]): Color[] {
  const colors: Color[] = Array(answer.length).fill("gray");
  const remaining = [...answer];
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) { colors[i] = "green"; remaining[i] = ""; }
  }
  for (let i = 0; i < answer.length; i++) {
    if (colors[i] === "green") continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) { colors[i] = "yellow"; remaining[idx] = ""; }
  }
  return colors;
}

const BG: Record<Color, string> = { green: "#538d4e", yellow: "#b59f3b", gray: "#3a3a3c", empty: "transparent" };
const BORDER_C: Record<Color, string> = { green: "#538d4e", yellow: "#b59f3b", gray: "#3a3a3c", empty: "var(--border)" };
const TEXT_C: Record<Color, string> = { green: "#fff", yellow: "#fff", gray: "#fff", empty: "var(--text)" };

interface Props {
  lang: "en" | "tr";
  answer: string;
  guesses: GuessRow[];
  currentInput: string;
  gameOver: boolean;
  won: boolean;
  error: string;
  streak: number;
}

export default function WordleGame({ lang, answer, guesses, currentInput, gameOver, won, error, streak }: Props) {
  const wordLen = Array.from(answer).length;
  const MAX = 6;

  return (
    <div style={{ fontFamily: "monospace" }}>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
        wordle <span style={{ color: "var(--accent)" }}>[{lang === "en" ? "english" : "turkish"}]</span>
        <span style={{ opacity: 0.5, marginLeft: "1rem" }}>
          guess the {wordLen}-letter word · 6 attempts · r new word · q quit
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {Array.from({ length: MAX }, (_, i) => {
          const submitted = guesses[i];
          const isCurrent = i === guesses.length && !gameOver;
          const curChars = Array.from(currentInput).slice(0, wordLen);
          const letters: string[] = submitted
            ? submitted.letters
            : isCurrent
            ? Array.from({ length: wordLen }, (_, j) => curChars[j] ?? "")
            : Array(wordLen).fill("");
          const colors: Color[] = submitted ? submitted.colors : Array(wordLen).fill("empty");

          return (
            <div key={i} style={{ display: "flex", gap: "0.3rem" }}>
              {Array.from({ length: wordLen }, (_, j) => (
                <div
                  key={j}
                  style={{
                    width: "2rem", height: "2rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase",
                    border: `1px solid ${BORDER_C[colors[j]]}`,
                    background: BG[colors[j]],
                    color: TEXT_C[colors[j]],
                    transition: "background 0.15s",
                  }}
                >
                  {letters[j]}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {error && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#ef4444" }}>{error}</div>
      )}

      {gameOver ? (
        <div style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
          {won ? (
            <>
              <span style={{ color: "#34d399" }}>✓ correct in {guesses.length}/{MAX}!</span>
              <span style={{ color: "var(--text-muted)" }}>  streak: </span>
              <span style={{ color: "var(--accent)" }}>{streak}</span>
              {streak > 0 && <span style={{ color: "var(--accent)", opacity: 0.7 }}>  ·  s save streak</span>}
              <span style={{ color: "var(--text-muted)" }}>  ·  r new word  ·  q quit</span>
            </>
          ) : (
            <>
              <span style={{ color: "#ef4444" }}>the word was </span>
              <span style={{ color: "var(--accent)" }}>{answer}</span>
              <span style={{ color: "var(--text-muted)" }}>  ·  streak reset  ·  r new word  ·  q quit</span>
            </>
          )}
        </div>
      ) : (
        <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)", opacity: 0.6 }}>
          type your guess below ↓ and press enter
        </div>
      )}
    </div>
  );
}
