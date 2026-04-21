"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillGroups = [
  {
    category: "Languages",
    icon: "{ }",
    color: "var(--accent)",
    skills: ["Python", "SQL", "Java", "JavaScript", "Bash / PowerShell", "HTML / CSS"],
  },
  {
    category: "Libraries",
    icon: "[ ]",
    color: "var(--accent2)",
    skills: ["pandas", "NumPy", "openpyxl", "Selenium"],
  },
  {
    category: "Cloud & Databases",
    icon: "//",
    color: "var(--accent3)",
    skills: ["Snowflake", "AWS S3", "AWS Lambda", "PostgreSQL", "MySQL"],
  },
  {
    category: "Tools",
    icon: ">_",
    color: "#34d399",
    skills: ["Power BI", "Git", "SSMS"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
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
        <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-5 text-center">&#47;&#47; 03. skills</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-14 text-center">Tech Stack</h2>

        <div className="space-y-0">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.12 * gi, duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-10 border-b border-[var(--border)] last:border-0"
              style={{ paddingTop: "1.75rem", paddingBottom: "1.75rem" }}
            >
              <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                <span
                  className="text-sm font-bold"
                  style={{ fontFamily: "monospace", color: group.color }}
                >
                  {group.icon}
                </span>
                <span
                  className="text-[10px] tracking-widest uppercase font-semibold"
                  style={{ color: group.color }}
                >
                  {group.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                {group.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.12 * gi + 0.05 * si }}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
