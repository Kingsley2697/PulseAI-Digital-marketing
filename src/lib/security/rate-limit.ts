import "server-only";

type Entry = { count: number; resetAt: number };
const entries = new Map<string, Entry>();

/** Lightweight process-local guard. Use a shared Redis/KV limiter when deploying more than one server instance. */
export function enforceRateLimit(key: string, limit = 5, windowMs = 15 * 60_000) {
  const now = Date.now();
  const existing = entries.get(key);
  const entry = !existing || existing.resetAt <= now ? { count: 0, resetAt: now + windowMs } : existing;
  entry.count += 1;
  entries.set(key, entry);
  return { allowed: entry.count <= limit, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1_000) };
}
