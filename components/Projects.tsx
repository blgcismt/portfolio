"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const projects = [
  {
    name: "Echo Explorer",
    path: "~/projects/echo-explorer",
    description:
      "Android navigation app built in Java with SQL, designed for accessibility. Integrated Google Maps API for real-time assistance tailored to visually impaired users.",
    tags: ["Java", "SQL", "Google Maps API", "Android"],
    links: { github: "https://github.com/blgcismt" },
    color: "var(--accent)",
    status: "shipped",
  },
  {
    name: "Flight Data Validator",
    path: "~/projects/flight-data-validator",
    description:
      "Python automation tool using FFT cross-correlation and multithreaded processing to validate signal lag across 1,400+ flight parameters. Reduced a weeks-long process to under an hour.",
    tags: ["Python", "FFT", "Multithreading", "Data Validation"],
    links: {},
    color: "var(--accent2)",
    status: "production @ Bombardier",
  },
  {
    name: "Snowflake Analytics Pipeline",
    path: "~/projects/snowflake-pipeline",
    description:
      "End-to-end data pipeline integrating Snowflake, AWS S3, and DSP reporting sources for monthly aircraft KPI calculations across Global 7500 and retrofit fleets.",
    tags: ["Python", "Snowflake", "AWS S3", "Power BI"],
    links: {},
    color: "var(--accent3)",
    status: "production @ Bombardier",
  },
  {
    name: "Fleet Watchlist Dashboards",
    path: "~/projects/fleet-watchlist",
    description:
      "Built Snowflake views and Power BI dashboards for Global 7500 and retrofit fleet watchlists, enabling real-time aircraft health monitoring for 50–60+ stakeholders. Implemented key-pair authentication for secure automated access.",
    tags: ["Snowflake", "Power BI", "Python", "SQL"],
    links: {},
    color: "#34d399",
    status: "production @ Bombardier",
  },
];

function TypewriterText({
  text,
  active,
  delay = 0,
}: {
  text: string;
  active: boolean;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let tid: ReturnType<typeof setTimeout>;
    let iid: ReturnType<typeof setInterval>;
    tid = setTimeout(() => {
      let i = 0;
      iid = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(iid);
      }, 14);
    }, delay * 1000);
    return () => {
      clearTimeout(tid);
      clearInterval(iid);
    };
  }, [active]);

  const typing = active && displayed.length < text.length;

  return (
    <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 mb-5" style={{ minHeight: "4.5rem" }}>
      {displayed || <span className="opacity-0">.</span>}
      {typing && (
        <span className="cursor-blink text-[var(--accent)] ml-px">▌</span>
      )}
    </p>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="projects"
      ref={ref}
      className="flex flex-col items-center border-t border-[var(--border)] px-6 sm:px-8"
      style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-5 text-center">&#47;&#47; 04. projects</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-14 text-center">What I&apos;ve Built</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 * i, duration: 0.5 }}
              className="group border border-[var(--border)] overflow-hidden hover:border-[var(--accent)] transition-all duration-300 flex flex-col"
              style={{ background: "var(--bg-card)" }}
            >
              {/* Terminal title bar */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] shrink-0"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <span
                  className="text-[10px] text-[var(--text-muted)] ml-1 truncate"
                  style={{ fontFamily: "monospace" }}
                >
                  {p.path}
                </span>
                {p.links.github && (
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto shrink-0 text-[var(--text-muted)] hover:text-[var(--accent)] text-xs transition-colors duration-200"
                    aria-label={`GitHub for ${p.name}`}
                  >
                    ↗
                  </a>
                )}
              </div>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <span
                    className="text-[10px] tracking-widest uppercase px-2 py-1 border"
                    style={{
                      borderColor: p.color,
                      color: p.color,
                      background: `${p.color}18`,
                    }}
                  >
                    {p.status}
                  </span>
                </div>

                <h3
                  className="text-base font-bold mb-3 group-hover:text-[var(--accent)] transition-colors duration-200"
                  style={{ fontFamily: "monospace" }}
                >
                  <span style={{ color: p.color }}>$ </span>
                  <span style={{ color: "var(--text)" }}>{p.name}</span>
                </h3>

                <TypewriterText
                  text={p.description}
                  active={inView}
                  delay={0.4 + 0.55 * i}
                />

                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] tracking-wider uppercase text-[var(--text-muted)]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
