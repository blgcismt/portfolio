"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const contactLinks = [
  { k: "email",    v: "ismetbilgicc@gmail.com",  href: "mailto:ismetbilgicc@gmail.com" },
  { k: "linkedin", v: "linkedin.com/in/ismtblgc", href: "https://linkedin.com/in/ismtblgc" },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="py-16 sm:py-28 px-6 sm:px-8"
      style={{ borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <motion.div
        style={{ width: "100%", maxWidth: "42rem" }}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.25rem", textAlign: "center" }}>
          &#47;&#47; 05. contact
        </p>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "3rem", textAlign: "center" }}>
          Let&apos;s Connect
        </h2>

        {/* Status card */}
        <div className="p-5 sm:p-10" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>

          {/* Status bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "2rem" }}>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 10px #34d399" }}
            />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#34d399", fontWeight: 600 }}>
              Available for Opportunities
            </span>
          </div>

          {/* Identity */}
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.4rem" }}>Ismet Bilgic</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
            Software Engineer · Data Engineer
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
            BASc Software Engineering @ University of Ottawa
          </p>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--border)", marginBottom: "0" }} />

          {/* Contact rows */}
          {contactLinks.map(({ k, v, href }, i) => (
            <motion.a
              key={k}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + 0.1 * i }}
              style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.1rem 0", borderBottom: "1px solid var(--border)", textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0.5rem"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
            >
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", width: "5.5rem", flexShrink: 0 }}>
                {k}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", flex: 1, wordBreak: "break-all" }}>
                {v}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>↗</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
