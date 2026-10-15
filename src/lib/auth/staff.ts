import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db/mongodb";
import { StaffUser, type StaffRole } from "@/models/StaffUser";

const cookieName = "pulseai_staff_session";
const sessionDurationSeconds = 60 * 60 * 12;

export type StaffSession = { id: string; email: string; role: StaffRole; expiresAt: number };

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

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, expected] = passwordHash.split(":");
  if (!salt || !expected) return false;
  return constantTimeEqual(scryptSync(password, salt, 64).toString("hex"), expected);
}

async function ensureBootstrapAdmin() {
  const email = process.env.STAFF_DASHBOARD_EMAIL?.trim().toLowerCase();
  const password = process.env.STAFF_DASHBOARD_PASSWORD;
  if (!email || !password) return;
  await connectToDatabase();
  await StaffUser.updateOne(
    { email },
    { $setOnInsert: { name: "Primary administrator", email, passwordHash: hashPassword(password), role: "admin", active: true } },
    { upsert: true }
  );
}

export async function verifyStaffCredentials(email: string, password: string): Promise<StaffSession | null> {
  if (!process.env.STAFF_SESSION_SECRET) return null;
  await ensureBootstrapAdmin();
  const user = await StaffUser.findOne({ email: email.trim().toLowerCase(), active: true }).select("+passwordHash");
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  await StaffUser.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });
  return { id: String(user._id), email: user.email, role: user.role, expiresAt: 0 };
}

export async function createStaffSession(user: Omit<StaffSession, "expiresAt">) {
  const expiresAt = Date.now() + sessionDurationSeconds * 1_000;
  const payload = Buffer.from(JSON.stringify({ ...user, expiresAt } satisfies StaffSession)).toString("base64url");
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
    if (!session.id || !["admin", "strategist", "reviewer"].includes(session.role) || !session.email || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function destroyStaffSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function createStaffUser(input: { name: string; email: string; password: string; role: StaffRole }) {
  await connectToDatabase();
  return StaffUser.create({ ...input, email: input.email.trim().toLowerCase(), passwordHash: hashPassword(input.password) });
}
