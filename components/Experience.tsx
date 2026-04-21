"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    company: "Bombardier Aerospace",
    role: "Data Engineer Intern",
    period: "Sep 2024 – Present",
    location: "Dorval, QC",
    color: "var(--accent)",
    colorHex: "#00d4ff",
    bullets: [
      "Built Python automation with FFT cross-correlation & multithreading to validate 1,400+ parameters, cutting a weeks-long 3-4 engineer process to under an hour.",
      "Engineered two Snowflake views (300+ lines each) automating daily Power BI reporting for 50–60+ stakeholders, eliminating 1–1.5 days of manual weekly work.",
      "End-to-end Python data pipeline integrating Snowflake, AWS S3, and DSP sources for monthly aircraft KPIs, cutting a 2-hour manual process to 30 minutes.",
      "Fleet-scale parameter investigation tools with direct AWS S3 streaming and autopilot event detection across Global 5000 & CL650 fleets.",
    ],
    tags: ["Python", "Snowflake", "AWS S3", "Power BI", "FFT"],
  },
  {
    company: "Scale AI",
    role: "Deputy Coding Team Lead",
    period: "Oct 2024 – Jun 2025",
    location: "Remote",
    color: "var(--accent2)",
    colorHex: "#7c3aed",
    bullets: [
      "Oversaw code review and quality control for 250+ tasks across Python, Java, SQL, HTML/CSS, and JavaScript.",
      "Achieved avg feedback score of 4.4/5 measured by client satisfaction.",
      "Led a team of 120+ coders, coordinating assignments, maintaining quality, and ensuring timely delivery.",
      "Improved AI model accuracy and localization across English, French, and Turkish models.",
    ],
    tags: ["Python", "Java", "SQL", "JavaScript", "Team Leadership"],
  },
  {
    company: "Deloitte",
    role: "IT Operations Specialist Intern",
    period: "Jan 2024 – Apr 2024",
    location: "Ottawa, ON",
    color: "var(--accent3)",
    colorHex: "#f59e0b",
    bullets: [
      "Python solutions with pandas & NumPy to categorize 47 types of stuck manifests, reducing resolution time from 45 min to 3–5 min.",
      "Complex SQL queries in SSMS and MySQL automating data extraction and analysis.",
      "PowerShell & Python scripts including Selenium-based tools, saving 20% man-hours over 4 months.",
    ],
    tags: ["Python", "pandas", "SQL", "PowerShell", "Selenium"],
  },
  {
    company: "Bombardier Aerospace",
    role: "Program Analyst Intern",
    period: "May 2023 – Sep 2023",
    location: "Dorval, QC",
    color: "var(--accent)",
    colorHex: "#00d4ff",
    bullets: [
      "Python & openpyxl automation for data transfer across file formats, cutting a week's work to 3 hours.",
      "SQL-based milestone tracking automation, enhancing efficiency and accuracy of project monitoring.",
    ],
    tags: ["Python", "openpyxl", "SQL"],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderTop: "1px solid var(--border)",
        padding: "7rem 2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "56rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.5rem", textAlign: "center" }}>
            &#47;&#47; 02. work
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "3.5rem", textAlign: "center" }}>
            Experience
          </h2>
        </motion.div>

        <div>
          {experiences.map((e, i) => (
            <motion.div
              key={e.company + e.period}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + 0.28 * i, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: "flex", gap: "2rem" }}
            >
              {/* Timeline spine */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "0.375rem", flexShrink: 0 }}>
                <div style={{ position: "relative", width: "0.75rem", height: "0.75rem", flexShrink: 0 }}>
                  <motion.div
                    style={{ position: "absolute", inset: 0, borderRadius: "50%", background: e.colorHex }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: [0, 0.5, 0], scale: [0.5, 2.8, 3.5] } : {}}
                    transition={{ delay: 0.15 + 0.28 * i, duration: 0.9, ease: "easeOut" }}
                  />
                  <motion.div
                    style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${e.colorHex}`, background: "var(--bg)" }}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: [0, 1.5, 1] } : {}}
                    transition={{ delay: 0.15 + 0.28 * i, duration: 0.5, times: [0, 0.55, 1], ease: "easeOut" }}
                  />
                </div>
                {i < experiences.length - 1 && (
                  <motion.div
                    style={{ width: "1px", flex: 1, marginTop: "0.5rem", background: "var(--border)", transformOrigin: "top" }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{ delay: 0.3 + 0.28 * i, duration: 0.55, ease: "easeInOut" }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: "4rem", flex: 1, minWidth: 0 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.25 + 0.28 * i, duration: 0.5 }}
                  style={{ marginBottom: "2rem" }}
                >
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.4 }}>
                    {e.role}{" "}
                    <span style={{ fontWeight: 400, color: e.colorHex }}>@ {e.company}</span>
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em", marginTop: "0.5rem" }}>
                    {e.period} · {e.location}
                  </p>
                </motion.div>

                <ul style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                  {e.bullets.map((b, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -12 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.35 + 0.28 * i + 0.07 * j, duration: 0.4 }}
                      style={{ display: "flex", gap: "0.875rem", fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.8, listStyle: "none" }}
                    >
                      <span style={{ flexShrink: 0, marginTop: "0.1rem", color: e.colorHex }}>›</span>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.45 + 0.28 * i, duration: 0.4 }}
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {e.tags.map(t => (
                    <span
                      key={t}
                      style={{ fontSize: "0.625rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.25rem 0.75rem", border: "1px solid var(--border)", color: "var(--text-muted)", background: "var(--bg-card)" }}
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
