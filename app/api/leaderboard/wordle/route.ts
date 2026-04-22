import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_ANON_KEY;
const VALID_LANGS = ["en", "tr"] as const;
type Lang = (typeof VALID_LANGS)[number];

function sbHeaders() {
  return { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
}

function sanitizeUsername(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  // Strip all ASCII control characters (including \n \r \t \0)
  const clean = raw.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 20);
  return clean.length > 0 ? clean : null;
}

function isValidLang(lang: unknown): lang is Lang {
  return VALID_LANGS.includes(lang as Lang);
}

export async function GET(req: NextRequest) {
  if (!SB_URL || !SB_KEY) return NextResponse.json([]);
  const rawLang = req.nextUrl.searchParams.get("lang") ?? "en";
  if (!isValidLang(rawLang)) return NextResponse.json({ error: "invalid lang" }, { status: 400 });
  const res = await fetch(
    `${SB_URL}/rest/v1/wordle_streaks?select=username,streak,updated_at&lang=eq.${rawLang}&order=streak.desc&limit=10`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  if (!SB_URL || !SB_KEY) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const body = await req.json();
  const username = sanitizeUsername(body.username);
  if (!username || !isValidLang(body.lang)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const lang: Lang = body.lang;

  const today = Math.floor(Date.now() / 86400000); // UTC days since epoch
  const encodedUser = encodeURIComponent(username);

  // Check if this user already has a row
  const checkRes = await fetch(
    `${SB_URL}/rest/v1/wordle_streaks?username=eq.${encodedUser}&lang=eq.${lang}&select=streak,last_win_day`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  const existing = await checkRes.json() as { streak: number; last_win_day: number }[];

  if (existing.length > 0) {
    const row = existing[0];

    // Block double submission on the same day
    if (row.last_win_day === today) {
      return NextResponse.json({ error: "already_submitted", streak: row.streak }, { status: 409 });
    }

    // Consecutive day → increment; gap → reset to 1
    const newStreak = row.last_win_day === today - 1 ? row.streak + 1 : 1;

    await fetch(
      `${SB_URL}/rest/v1/wordle_streaks?username=eq.${encodedUser}&lang=eq.${lang}`,
      {
        method: "PATCH",
        headers: { ...sbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ streak: newStreak, last_win_day: today, updated_at: new Date().toISOString() }),
      }
    );

    return NextResponse.json({ ok: true, streak: newStreak });
  }

  // First time — insert with streak 1
  await fetch(`${SB_URL}/rest/v1/wordle_streaks`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ username, lang, streak: 1, last_win_day: today }),
  });

  return NextResponse.json({ ok: true, streak: 1 });
}
