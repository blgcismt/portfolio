"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const links = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "work" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateActive = () => {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 80) {
        setActive(links[links.length - 1].href);
        return;
      }
      const scrollMid = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const { href } of links) {
        const el = document.querySelector(href) as HTMLElement | null;
        if (el && el.offsetTop <= scrollMid) current = href;
      }
      setActive(current);
    };
    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-[var(--border)] transition-colors duration-300 ${
        scrolled || menuOpen ? "bg-[rgba(10,10,15,0.95)]" : "bg-transparent"
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      aria-label="Main navigation"
      role="navigation"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-5">
        <a
          href="#hero"
          className="font-bold text-sm tracking-widest text-[var(--accent)] uppercase"
        >
          IB<span className="cursor-blink">_</span>
        </a>

        {/* Desktop nav — centred */}
        <ul className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2" role="list">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`text-xs tracking-widest uppercase transition-colors duration-200 ${
                  active === href ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {active === href && <span className="text-[var(--accent)] mr-1">›</span>}
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop terminal hint */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-terminal"))}
          className="hidden md:flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
          aria-label="Open terminal"
        >
          <span style={{ fontFamily: "monospace", fontSize: "0.7rem", letterSpacing: "0.05em" }}>[ / ]</span>
        </button>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="md:hidden text-[var(--accent)] text-xs tracking-widest"
        >
          {menuOpen ? "[ CLOSE ]" : "[ MENU ]"}
        </button>
      </div>

      {/* Mobile dropdown — full-width, sibling to the bar so it spans correctly */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--bg-card)]"
          >
            <ul className="flex flex-col px-8 py-6 gap-5" role="list">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-xs tracking-widest uppercase ${
                      active === href ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {active === href && <span className="mr-1">›</span>}
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("open-terminal"));
                  }}
                  className="text-xs tracking-widest uppercase text-[var(--text-muted)]"
                  style={{ fontFamily: "monospace" }}
                >
                  [ terminal ]
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
