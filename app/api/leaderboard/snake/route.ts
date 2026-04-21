import { NextRequest, NextResponse } from "next/server";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_ANON_KEY;

function sbHeaders() {
  return { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
}

export async function GET() {
  if (!SB_URL || !SB_KEY) return NextResponse.json([]);
  const res = await fetch(
    `${SB_URL}/rest/v1/snake_scores?select=username,score,created_at&order=score.desc&limit=10`,
    { headers: sbHeaders(), next: { revalidate: 30 } }
  );
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  if (!SB_URL || !SB_KEY) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const { username, score } = await req.json();
  if (!username || typeof score !== "number" || score < 0) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await fetch(`${SB_URL}/rest/v1/snake_scores`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ username: String(username).slice(0, 20), score }),
  });
  return NextResponse.json({ ok: true });
}
