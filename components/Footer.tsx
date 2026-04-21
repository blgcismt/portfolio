export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 px-6 text-center">
      <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)]">
        <span className="text-[var(--accent)]">Ismet Bilgic</span> · Ottawa, ON ·{" "}
        <span className="cursor-blink">©</span> {new Date().getFullYear()}
      </p>
      <p className="text-[9px] tracking-widest uppercase text-[var(--text-muted)] mt-2 opacity-40">
        Built with Next.js · Framer Motion · Tailwind CSS
      </p>
    </footer>
  );
}
