"use client";
import { useEffect, useState } from "react";

export default function Cursor() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    setVisible(true);

    let animFrame: number;
    let current = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      current = { x: e.clientX, y: e.clientY };
      setPos(current);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const checkHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovered(!!el.closest("a, button, [data-hover]"));
    };
    const lerp = () => {
      setTrail(prev => ({
        x: prev.x + (current.x - prev.x) * 0.12,
        y: prev.y + (current.y - prev.y) * 0.12,
      }));
      animFrame = requestAnimationFrame(lerp);
    };
    animFrame = requestAnimationFrame(lerp);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: clicking ? 6 : hovered ? 10 : 8,
          height: clicking ? 6 : hovered ? 10 : 8,
          borderRadius: "50%",
          background: "var(--accent)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 10000,
          transition: "width 0.1s, height 0.1s",
          boxShadow: "0 0 10px var(--accent)",
        }}
      />
      <div
        style={{
          position: "fixed",
          left: trail.x,
          top: trail.y,
          width: hovered ? 40 : 30,
          height: hovered ? 40 : 30,
          borderRadius: "50%",
          border: `1px solid ${hovered ? "var(--accent)" : "rgba(0,212,255,0.4)"}`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "width 0.2s, height 0.2s, border-color 0.2s",
        }}
      />
    </>
  );
}
