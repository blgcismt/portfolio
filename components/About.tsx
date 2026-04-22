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
      className="py-16 sm:py-28 px-6 sm:px-8"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderTop: "1px solid var(--border)",
      }}
    >
      <motion.div
        style={{ width: "100%", maxWidth: "56rem" }}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.5rem", textAlign: "center" }}>
          &#47;&#47; 01. about
        </p>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "3.5rem", textAlign: "center" }}>
          Who I am
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-muted)", lineHeight: 1.9, fontSize: "1rem" }}>
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

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
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
                style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", borderBottom: "1px solid var(--border)", padding: "1.75rem 0" }}
              >
                <span style={{ color: "var(--accent)", width: "5rem", flexShrink: 0, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {k}
                </span>
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                  >
                    {v} ↗
                  </a>
                ) : (
                  <span style={{ color: "var(--text)" }}>{v}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem" }}>
          {stats.map(({ value, label, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i }}
              style={{ border: "1px solid var(--border)", padding: "2rem 1rem", textAlign: "center", background: "var(--bg-card)", transition: "border-color 0.3s", cursor: "default" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.75rem" }}>
                {value}<span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>{suffix}</span>
              </div>
              <div style={{ fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
