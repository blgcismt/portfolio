"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 26;
const ROWS = 16;
const TICK = 140;

type Pos = [number, number];
type Dir = [number, number];

function randomFood(snake: Pos[]): Pos {
  const occupied = new Set(snake.map(([x, y]) => `${x},${y}`));
  let pos: Pos;
  do {
    pos = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
  } while (occupied.has(`${pos[0]},${pos[1]}`));
  return pos;
}

function initState() {
  const snake: Pos[] = [[13, 8], [12, 8], [11, 8]];
  return { snake, dir: [1, 0] as Dir, food: randomFood(snake), score: 0, dead: false };
}

interface SnakeGameProps {
  onQuit: () => void;
  onSaveScore?: (score: number) => void;
}

export default function SnakeGame({ onQuit, onSaveScore }: SnakeGameProps) {
  const [state, setState] = useState(initState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const pendingDir = useRef<Dir>([1, 0]);

  const restart = useCallback(() => {
    pendingDir.current = [1, 0];
    setState(initState());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "q" || e.key === "Escape") { onQuit(); return; }
      if (e.key === "r" || e.key === "R") { restart(); return; }
      if ((e.key === "s" || e.key === "S") && stateRef.current.dead && stateRef.current.score > 0) {
        onSaveScore?.(stateRef.current.score); return;
      }
      const dirs: Record<string, Dir> = {
        ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
      };
      const nd = dirs[e.key];
      if (nd) { e.preventDefault(); pendingDir.current = nd; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onQuit, restart]);

  useEffect(() => {
    const id = setInterval(() => {
      setState(prev => {
        if (prev.dead) return prev;
        let [dx, dy] = pendingDir.current;
        if (dx === -prev.dir[0] && dy === -prev.dir[1]) [dx, dy] = prev.dir;
        const [hx, hy] = prev.snake[0];
        const head: Pos = [(hx + dx + COLS) % COLS, (hy + dy + ROWS) % ROWS];
        const ateFood = head[0] === prev.food[0] && head[1] === prev.food[1];
        const newSnake: Pos[] = [head, ...prev.snake.slice(0, ateFood ? undefined : -1)];
        const dead = newSnake.slice(1).some(([x, y]) => x === head[0] && y === head[1]);
        return {
          snake: newSnake,
          dir: [dx, dy] as Dir,
          food: ateFood ? randomFood(newSnake) : prev.food,
          score: prev.score + (ateFood ? 10 : 0),
          dead,
        };
      });
    }, TICK);
    return () => clearInterval(id);
  }, []);

  const snakeSet = new Set(state.snake.map(([x, y]) => `${x},${y}`));
  const [hx, hy] = state.snake[0];

  return (
    <div style={{ fontFamily: "monospace", userSelect: "none" }}>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
        score: <span style={{ color: "var(--accent)" }}>{state.score}</span>
        <span style={{ marginLeft: "1.5rem", opacity: 0.6 }}>wasd / ↑↓←→  ·  r restart  ·  q quit</span>
      </div>
      <div style={{ border: "1px solid var(--border)", display: "inline-block" }}>
        {Array.from({ length: ROWS }, (_, y) => (
          <div key={y} style={{ display: "flex" }}>
            {Array.from({ length: COLS }, (_, x) => {
              const isHead = x === hx && y === hy;
              const isBody = !isHead && snakeSet.has(`${x},${y}`);
              const isFood = x === state.food[0] && y === state.food[1];
              return (
                <span
                  key={x}
                  style={{
                    display: "inline-block",
                    width: "0.62rem",
                    fontSize: "0.62rem",
                    lineHeight: "0.9rem",
                    textAlign: "center",
                    color: isHead ? "var(--accent)"
                      : isBody ? "#60a5fa"
                      : isFood ? "#f59e0b"
                      : "#1e293b",
                  }}
                >
                  {isHead ? "█" : isBody ? "▪" : isFood ? "◆" : "·"}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {state.dead && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
          <span style={{ color: "#ef4444" }}>game over — score: {state.score}</span>
          <span style={{ color: "var(--text-muted)", marginLeft: "1rem" }}>r restart</span>
          {state.score > 0 && onSaveScore && (
            <span style={{ color: "var(--accent)", marginLeft: "0.75rem" }}>s save score</span>
          )}
          <span style={{ color: "var(--text-muted)", marginLeft: "0.75rem" }}>q quit</span>
        </div>
      )}
    </div>
  );
}
