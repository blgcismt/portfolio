"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "3.94", label: "GPA", suffix: "/4" },
  { value: "3+", label: "Years of Experience", suffix: "" },
  { value: "2027", label: "Expected Graduation", suffix: "" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
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
        <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-5 text-center">&#47;&#47; 01. about</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Who I am</h2>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6 text-[var(--text-muted)] leading-relaxed text-sm">
            <p>
              I&apos;m a Software Engineering co-op student at the University of Ottawa,
              currently interning at Bombardier Aerospace as a Data Engineer. I like
              turning messy data into clean, automated systems.
            </p>
            <p>
              My work spans Python automation, cloud data pipelines, and full-stack
              development. I&apos;ve compressed weeks of manual engineering work into minutes.
            </p>
            <p>
              Outside of Bombardier, I spent time as Deputy Coding Team Lead at Scale AI,
              where I oversaw quality control for 250+ tasks and led a team of 120+ coders
              improving AI model accuracy.
            </p>
          </div>

          <div className="space-y-5">
            {[
              { k: "location", v: "Ottawa, ON 🇨🇦" },
              { k: "email", v: "ismetbilgicc@gmail.com", link: "mailto:ismetbilgicc@gmail.com" },
              { k: "linkedin", v: "ismtblgc", link: "https://linkedin.com/in/ismtblgc" },
              { k: "github", v: "blgcismt", link: "https://github.com/blgcismt" },
            ].map(({ k, v, link }) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="flex gap-6 text-sm border-b border-[var(--border)] pb-5"
              >
                <span className="text-[var(--accent)] w-20 shrink-0 text-xs tracking-wider uppercase">{k}</span>
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                    {v} ↗
                  </a>
                ) : (
                  <span className="text-[var(--text)]">{v}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {stats.map(({ value, label, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i }}
              className="border border-[var(--border)] py-8 px-4 text-center hover:border-[var(--accent)] transition-colors duration-300"
              style={{ background: "var(--bg-card)" }}
            >
              <div className="text-3xl font-bold text-[var(--accent)] mb-3">
                {value}<span className="text-base text-[var(--text-muted)]">{suffix}</span>
              </div>
              <div className="text-[10px] tracking-widest uppercase text-[var(--text-muted)]">{label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
