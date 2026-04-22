"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const C = {
  brace:  "#abb2bf",
  key:    "#00d4ff",
  str:    "#98c379",
  punct:  "#4b5563",
};

type Seg = { text: string; color: string };

const jsonLines: Seg[][] = [
  [{ text: "{", color: C.brace }],
  [
    { text: '  "languages"', color: C.key }, { text: ": [", color: C.punct },
    { text: '"Python"',           color: C.str }, { text: ", ", color: C.punct },
    { text: '"SQL"',              color: C.str }, { text: ", ", color: C.punct },
    { text: '"Java"',             color: C.str }, { text: ", ", color: C.punct },
    { text: '"JavaScript"',       color: C.str }, { text: ", ", color: C.punct },
    { text: '"Bash / PowerShell"',color: C.str }, { text: ", ", color: C.punct },
    { text: '"HTML / CSS"',       color: C.str },
    { text: "],", color: C.punct },
  ],
  [
    { text: '  "frameworks"', color: C.key }, { text: ": [", color: C.punct },
    { text: '"Next.js"',     color: C.str }, { text: ", ", color: C.punct },
    { text: '"React"',       color: C.str }, { text: ", ", color: C.punct },
    { text: '"Tailwind CSS"',color: C.str },
    { text: "],", color: C.punct },
  ],
  [
    { text: '  "libraries"', color: C.key }, { text: ": [", color: C.punct },
    { text: '"pandas"',   color: C.str }, { text: ", ", color: C.punct },
    { text: '"NumPy"',    color: C.str }, { text: ", ", color: C.punct },
    { text: '"openpyxl"', color: C.str }, { text: ", ", color: C.punct },
    { text: '"Selenium"', color: C.str },
    { text: "],", color: C.punct },
  ],
  [
    { text: '  "cloud"', color: C.key }, { text: ": [", color: C.punct },
    { text: '"Snowflake"',  color: C.str }, { text: ", ", color: C.punct },
    { text: '"AWS S3"',     color: C.str }, { text: ", ", color: C.punct },
    { text: '"AWS Lambda"', color: C.str }, { text: ", ", color: C.punct },
    { text: '"PostgreSQL"', color: C.str }, { text: ", ", color: C.punct },
    { text: '"MySQL"',      color: C.str },
    { text: "],", color: C.punct },
  ],
  [
    { text: '  "tools"', color: C.key }, { text: ": [", color: C.punct },
    { text: '"Power BI"', color: C.str }, { text: ", ", color: C.punct },
    { text: '"Git"',      color: C.str }, { text: ", ", color: C.punct },
    { text: '"SSMS"',     color: C.str },
    { text: "]", color: C.punct },
  ],
  [{ text: "}", color: C.brace }],
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
      ref={ref}
      className="py-16 sm:py-28 px-6 sm:px-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <motion.div
        style={{ maxWidth: "56rem", margin: "0 auto" }}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.25rem", textAlign: "center" }}>
          &#47;&#47; 03. skills
        </p>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "3rem", textAlign: "center" }}>
          Tech Stack
        </h2>

        {/* Terminal card */}
        <div style={{ border: "1px solid var(--border)", background: "#0d0d14", overflow: "hidden" }}>

          {/* Title bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.025)" }}>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              <div style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: "#28c840" }} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
              ismet@portfolio:~$ cat skills.json
            </span>
          </div>

          {/* JSON content */}
          <div className="px-4 sm:px-7 py-5 sm:py-6 text-xs sm:text-sm" style={{ fontFamily: "monospace", lineHeight: 1.9, overflowX: "auto" }}>
            {jsonLines.map((line, li) => (
              <motion.div
                key={li}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + li * 0.1, duration: 0.4 }}
                style={{ display: "flex", flexWrap: "wrap", whiteSpace: "pre" }}
              >
                {line.map((seg, si) => (
                  <span key={si} style={{ color: seg.color }}>{seg.text}</span>
                ))}
                {/* Blinking cursor on the last line */}
                {li === jsonLines.length - 1 && (
                  <span className="cursor-blink" style={{ color: "var(--accent)", marginLeft: "2px" }}>▌</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
