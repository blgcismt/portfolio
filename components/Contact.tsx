"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const links = [
  { label: "email", value: "ismetbilgicc@gmail.com", href: "mailto:ismetbilgicc@gmail.com" },
  { label: "linkedin", value: "linkedin.com/in/ismtblgc", href: "https://linkedin.com/in/ismtblgc" },
  { label: "github", value: "github.com/blgcismt", href: "https://github.com/blgcismt" },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="flex flex-col items-center border-t border-[var(--border)] px-6 sm:px-8"
      style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      <motion.div
        className="w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-5">&#47;&#47; 05. contact</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-10">Let&apos;s Connect</h2>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-16">
          I&apos;m always open to new opportunities, collaborations, or just a good conversation.
          Drop me a line. I read every message.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {links.map((l, i) => (
            <motion.a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              className="border border-[var(--border)] p-6 text-left hover:border-[var(--accent)] hover:bg-[var(--bg-card)] transition-all duration-200 group"
            >
              <div className="text-[10px] tracking-widest uppercase text-[var(--accent)] mb-1">{l.label}</div>
              <div className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">{l.value}</div>
            </motion.a>
          ))}
        </div>

        <motion.a
          href="mailto:ismetbilgicc@gmail.com"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="inline-block mt-12 px-10 py-4 text-xs tracking-widest uppercase border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-200"
          style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
        >
          Say Hello →
        </motion.a>
      </motion.div>
    </section>
  );
}
