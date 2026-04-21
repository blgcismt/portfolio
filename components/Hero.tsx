"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const ROLES = ["Software Engineer", "Data Engineer", "Co-op Student", "Builder"];
const PARTICLES = 22;

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typewriter
  useEffect(() => {
    const role = ROLES[roleIdx];
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      const type = () => {
        if (i <= role.length) {
          setDisplayed(role.slice(0, i));
          i++;
          timeout = setTimeout(type, 80);
        } else {
          timeout = setTimeout(() => setTyping(false), 1800);
        }
      };
      type();
    } else {
      const erase = () => {
        if (i >= 0) {
          setDisplayed(role.slice(0, i));
          i--;
          timeout = setTimeout(erase, 40);
        } else {
          setRoleIdx(p => (p + 1) % ROLES.length);
          setTyping(true);
        }
      };
      i = role.length;
      erase();
    }
    return () => clearTimeout(timeout);
  }, [roleIdx, typing]);

  // Canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };
    const particles: Particle[] = Array.from({ length: PARTICLES }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 sm:px-10 overflow-hidden scanline"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl w-full">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[var(--accent)] text-xs tracking-[0.3em] uppercase mb-6"
        >
          &#47;&#47; hello world
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-4"
        >
          Ismet
          <br />
          <span className="glow-text text-[var(--accent)]">Bilgic</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-lg md:text-2xl text-[var(--text-muted)] mb-10 h-8 flex items-center gap-2"
        >
          <span className="text-[var(--accent2)]">›</span>
          <span>{displayed}</span>
          <span className="cursor-blink text-[var(--accent)]">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-sm md:text-base text-[var(--text-muted)] max-w-xl leading-relaxed mb-14"
        >
          BASc Software Engineering @ University of Ottawa. Building data pipelines at Bombardier Aerospace.
          GPA 3.94 · Chancellor&apos;s Scholar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-wrap items-center gap-8"
        >
          <a
            href="#experience"
            className="text-xs tracking-widest uppercase text-[var(--accent)] hover:opacity-70 transition-opacity duration-200 font-semibold"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
          >
            Contact Me →
          </a>
          <a
            href="https://github.com/blgcismt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--accent2)] transition-colors duration-200"
          >
            GitHub ↗
          </a>
          <a
            href="/ISMET_BILGIC_RESUME.pdf"
            download
            className="text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--accent3)] transition-colors duration-200"
          >
            Resume ↓
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "float 2s ease-in-out infinite" }}
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase">scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--accent)] to-transparent" />
      </motion.div>
    </section>
  );
}
