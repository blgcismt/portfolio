import { NextRequest, NextResponse } from "next/server";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_ANON_KEY;

function sbHeaders() {
  return { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
}

export async function GET(req: NextRequest) {
  if (!SB_URL || !SB_KEY) return NextResponse.json([]);
  const lang = req.nextUrl.searchParams.get("lang") ?? "en";
  const res = await fetch(
    `${SB_URL}/rest/v1/wordle_streaks?select=username,streak,lang,created_at&lang=eq.${lang}&order=streak.desc&limit=10`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  if (!SB_URL || !SB_KEY) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const { username, streak, lang } = await req.json();
  if (!username || typeof streak !== "number" || streak < 1 || !["en", "tr"].includes(lang)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await fetch(`${SB_URL}/rest/v1/wordle_streaks`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ username: String(username).slice(0, 20), streak, lang }),
  });
  return NextResponse.json({ ok: true });
}
