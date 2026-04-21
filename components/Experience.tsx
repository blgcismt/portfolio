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
      className="flex flex-col items-center border-t border-[var(--border)] px-6 sm:px-8"
      style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-5 text-center">&#47;&#47; 02. work</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Experience</h2>
        </motion.div>

        <div className="space-y-0">
          {experiences.map((e, i) => (
            <motion.div
              key={e.company + e.period}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + 0.28 * i, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex gap-8"
            >
              {/* Timeline spine */}
              <div className="flex flex-col items-center pt-1.5 shrink-0">
                {/* Dot with pulse */}
                <div className="relative w-3 h-3 shrink-0">
                  {/* Ripple */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: e.colorHex }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: [0, 0.5, 0], scale: [0.5, 2.8, 3.5] } : {}}
                    transition={{ delay: 0.15 + 0.28 * i, duration: 0.9, ease: "easeOut" }}
                  />
                  {/* Dot */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: e.color, background: "var(--bg)" }}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: [0, 1.5, 1] } : {}}
                    transition={{ delay: 0.15 + 0.28 * i, duration: 0.5, times: [0, 0.55, 1], ease: "easeOut" }}
                  />
                </div>

                {/* Animated line segment */}
                {i < experiences.length - 1 && (
                  <motion.div
                    className="w-px flex-1 mt-2"
                    style={{ background: "var(--border)", originY: 0 }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{ delay: 0.3 + 0.28 * i, duration: 0.55, ease: "easeInOut" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-14 flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.25 + 0.28 * i, duration: 0.5 }}
                  className="mb-3"
                >
                  <h3 className="text-lg font-bold leading-snug">
                    {e.role}{" "}
                    <span className="font-normal" style={{ color: e.color }}>
                      @ {e.company}
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] tracking-wide mt-1">
                    {e.period} · {e.location}
                  </p>
                </motion.div>

                <ul className="space-y-3 mb-5">
                  {e.bullets.map((b, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -12 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.35 + 0.28 * i + 0.07 * j, duration: 0.4 }}
                      className="flex gap-3 text-sm text-[var(--text-muted)] leading-relaxed"
                    >
                      <span className="shrink-0 mt-0.5" style={{ color: e.color }}>›</span>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.45 + 0.28 * i, duration: 0.4 }}
                  className="flex flex-wrap gap-2"
                >
                  {e.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] tracking-widest uppercase px-3 py-1 border border-[var(--border)] text-[var(--text-muted)]"
                      style={{ background: "var(--bg-card)" }}
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
