import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "pulseai_staff_session";
const sessionDurationSeconds = 60 * 60 * 12;

type StaffSession = { email: string; role: "staff"; expiresAt: number };

function sign(value: string) {
  const secret = process.env.STAFF_SESSION_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function verifyStaffCredentials(email: string, password: string) {
  const configuredEmail = process.env.STAFF_DASHBOARD_EMAIL;
  const configuredPassword = process.env.STAFF_DASHBOARD_PASSWORD;
  if (!configuredEmail || !configuredPassword || !process.env.STAFF_SESSION_SECRET) return false;
  return constantTimeEqual(email.trim().toLowerCase(), configuredEmail.trim().toLowerCase()) &&
    constantTimeEqual(password, configuredPassword);
}

export async function createStaffSession(email: string) {
  const expiresAt = Date.now() + sessionDurationSeconds * 1_000;
  const payload = Buffer.from(JSON.stringify({ email, role: "staff", expiresAt } satisfies StaffSession)).toString("base64url");
  const signature = sign(payload);
  if (!signature) throw new Error("STAFF_SESSION_SECRET is not configured.");

  const cookieStore = await cookies();
  cookieStore.set(cookieName, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionDurationSeconds,
  });
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(cookieName)?.value;
  if (!value) return null;

  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;
  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const expectedSignature = sign(payload);
  if (!expectedSignature || !constantTimeEqual(signature, expectedSignature)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as StaffSession;
    if (session.role !== "staff" || !session.email || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function destroyStaffSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
