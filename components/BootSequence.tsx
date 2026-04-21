"use client";
import { useEffect, useRef, useState } from "react";

const LINES = [
  "> initializing portfolio...",
  "> loading assets.................. done",
  "> connecting to ismet@portfolio",
  "> hello, world ✓",
];

const CHAR_SPEED = 28;  // ms per character
const LINE_PAUSE = 350; // ms pause after each line completes

export default function BootSequence() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([""]);
  const [visible, setVisible] = useState(true);
  const skipRef = useRef(false);

  const finish = () => {
    if (skipRef.current) return;
    skipRef.current = true;
    setVisible(false);
  };

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let tid: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (skipRef.current) return;
      const line = LINES[lineIdx];

      if (charIdx <= line.length) {
        setDisplayedLines(prev => {
          const next = [...prev];
          next[lineIdx] = line.slice(0, charIdx);
          return next;
        });
        charIdx++;
        tid = setTimeout(tick, CHAR_SPEED);
      } else {
        lineIdx++;
        charIdx = 0;
        if (lineIdx >= LINES.length) {
          tid = setTimeout(finish, 900);
        } else {
          setDisplayedLines(prev => [...prev, ""]);
          tid = setTimeout(tick, LINE_PAUSE);
        }
      }
    };

    tid = setTimeout(tick, 300);
    return () => clearTimeout(tid);
  }, []);

  // Any key or click skips
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 100000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        cursor: "default",
      }}
    >
      <div style={{ width: "min(560px, 90vw)" }}>
        {displayedLines.map((text, i) => {
          const isComplete = i < displayedLines.length - 1;
          const isLastLine = i === LINES.length - 1;
          const isActive   = i === displayedLines.length - 1;
          return (
            <div
              key={i}
              style={{
                fontSize: "0.9rem",
                lineHeight: 2.2,
                color: isLastLine && isComplete
                  ? "#34d399"
                  : isComplete
                  ? "var(--text-muted)"
                  : "var(--text)",
              }}
            >
              {text}
              {isActive && (
                <span className="cursor-blink" style={{ color: "var(--accent)", marginLeft: "1px" }}>▌</span>
              )}
            </div>
          );
        })}
      </div>

      <p style={{
        position: "absolute",
        bottom: "2.5rem",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        opacity: 0.5,
      }}>
        press any key to skip
      </p>
    </div>
  );
}
