import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_ANON_KEY;
const MAX_SCORE = 100_000;

function sbHeaders() {
  return { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
}

function sanitizeUsername(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const clean = raw.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 20);
  return clean.length > 0 ? clean : null;
}

export async function GET() {
  if (!SB_URL || !SB_KEY) return NextResponse.json([]);
  const res = await fetch(
    `${SB_URL}/rest/v1/snake_scores?select=username,score,created_at&order=score.desc&limit=10`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  if (!SB_URL || !SB_KEY) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const body = await req.json();
  const username = sanitizeUsername(body.username);
  const score = body.score;
  if (!username || !Number.isFinite(score) || !Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await fetch(`${SB_URL}/rest/v1/snake_scores`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ username, score }),
  });
  return NextResponse.json({ ok: true });
}
