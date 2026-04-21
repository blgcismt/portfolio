"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HistoryEntry = { input: string; output: string[] };

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

const LS_OUTPUT = [
  "  /about   /work   /skills   /projects   /contact",
];

function processCommand(
  raw: string,
  close: () => void
): { output: string[]; action?: () => void } {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "help" || cmd === "?") return { output: HELP_OUTPUT };
  if (cmd === "whoami") return { output: WHOAMI_OUTPUT };
  if (cmd === "ls") return { output: LS_OUTPUT };
  if (cmd === "clear") return { output: [], action: () => {} }; // handled separately
  if (cmd === "exit" || cmd === "q") return { output: ["  closing terminal..."], action: close };

  if (["about", "work", "skills", "projects", "contact"].includes(cmd)) {
    const id = cmd === "work" ? "experience" : cmd;
    return {
      output: [`  → navigating to /${cmd}...`],
      action: () => {
        close();
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      },
    };
  }

  if (cmd === "resume") {
    return {
      output: ["  → downloading ISMET_BILGIC_RESUME.pdf..."],
      action: () => {
        const a = document.createElement("a");
        a.href = "/ISMET_BILGIC_RESUME.pdf";
        a.download = "ISMET_BILGIC_RESUME.pdf";
        a.click();
      },
    };
  }

  if (cmd === "github") {
    return {
      output: ["  → opening github.com/blgcismt..."],
      action: () => window.open("https://github.com/blgcismt", "_blank"),
    };
  }

  if (cmd === "linkedin") {
    return {
      output: ["  → opening linkedin.com/in/ismtblgc..."],
      action: () => window.open("https://linkedin.com/in/ismtblgc", "_blank"),
    };
  }

  if (cmd === "") return { output: [] };

  return {
    output: [
      `  command not found: ${raw.trim()}`,
      "  type 'help' for available commands",
    ],
  };
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [navIdx, setNavIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setInput("");
    setNavIdx(-1);
  }, []);

  // Open on / or Ctrl+K or custom event from navbar button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") { close(); return; }
      if ((e.key === "/" && !open && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") ||
          (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-terminal", onOpenEvent);
    };
  }, [open, close]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const submit = () => {
    const raw = input;
    const cmd = raw.trim().toLowerCase();

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      setNavIdx(-1);
      return;
    }

    const { output, action } = processCommand(raw, close);
    setHistory(prev => [...prev, { input: raw, output }]);
    setInput("");
    setNavIdx(-1);
    if (action) setTimeout(action, 120);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { submit(); return; }
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9998, backdropFilter: "blur(4px)" }}
          />

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "fixed",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(640px, 92vw)",
              zIndex: 9999,
              border: "1px solid var(--border)",
              background: "#0d0d14",
              display: "flex",
              flexDirection: "column",
              maxHeight: "65vh",
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
                ismet@portfolio:~$ terminal
              </span>
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                ESC to close
              </span>
            </div>

            {/* Output area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.8 }}>
              {/* Welcome */}
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
                          : line.startsWith("  →") ? "var(--accent3)"
                          : "var(--text-muted)",
                        whiteSpace: "pre",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.5rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--accent2)", opacity: 0.7, flexShrink: 0 }}>ismet@portfolio</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}>:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  color: "var(--text)",
                  caretColor: "var(--accent)",
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
