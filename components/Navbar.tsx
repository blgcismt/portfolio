"use client";
import { motion } from "framer-motion";
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
        scrolled ? "bg-[rgba(10,10,15,0.95)]" : "bg-transparent"
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      aria-label="Main navigation"
      role="navigation"
    >
      <div className="relative flex items-center justify-center px-6 sm:px-8 py-5">
        <a
          href="#hero"
          className="absolute left-6 sm:left-8 font-bold text-sm tracking-widest text-[var(--accent)] uppercase"
        >
          IB<span className="cursor-blink">_</span>
        </a>

        <ul className="hidden md:flex gap-8" role="list">
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

        {/* Terminal hint — desktop only */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-terminal"))}
          className="absolute right-6 sm:right-8 hidden md:flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
          aria-label="Open terminal"
        >
          <span style={{ fontFamily: "monospace", fontSize: "0.7rem", letterSpacing: "0.05em" }}>[ / ]</span>
        </button>

        <div className="absolute right-6 sm:right-8 md:hidden">
          <MobileNav active={active} />
        </div>
      </div>
    </motion.nav>
  );
}

function MobileNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="text-[var(--accent)] text-xs tracking-widest"
      >
        {open ? "[ CLOSE ]" : "[ MENU ]"}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-[var(--bg-card)] border-b border-[var(--border)] py-4 px-6"
        >
          <ul className="flex flex-col gap-4" role="list">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block text-xs tracking-widest uppercase ${
                    active === href ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
