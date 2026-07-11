import { NextResponse } from "next/server";
import {
  checkPassword,
  isAuthed,
  adminConfigured,
  SESSION_COOKIE,
  sessionValue,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** Session check — used by the CMS to decide whether to show the login form. */
export async function GET() {
  return NextResponse.json({ authed: isAuthed(), configured: adminConfigured() });
}

/** Log in with the admin password → sets an httpOnly session cookie. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String((body as { password?: unknown }).password ?? "");

  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server." },
      { status: 503 },
    );
  }
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

/** Log out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
