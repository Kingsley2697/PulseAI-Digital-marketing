import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { connectToDatabase } from "@/lib/db/mongodb";
import { CanvaConnection } from "@/models/CanvaConnection";

const tokenUrl = "https://api.canva.com/rest/v1/oauth/token";

function encryptionKey() {
  const value = process.env.CANVA_TOKEN_ENCRYPTION_KEY;
  const key = value ? Buffer.from(value, "base64") : undefined;
  if (!key || key.length !== 32) throw new Error("CANVA_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return key;
}

function seal(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`;
}

function open(value: string) {
  const [ivValue, tagValue, encryptedValue] = value.split(".");
  if (!ivValue || !tagValue || !encryptedValue) throw new Error("Stored Canva token is invalid.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8");
}

export function createCanvaAuthorization() {
  const clientId = process.env.CANVA_CLIENT_ID;
  const redirectUri = process.env.CANVA_REDIRECT_URI;
  if (!clientId || !redirectUri) throw new Error("Canva OAuth is not configured.");
  const verifier = randomBytes(64).toString("base64url");
  const state = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const scope = "design:content:write design:meta:read brandtemplate:meta:read brandtemplate:content:read asset:read asset:write";
  const url = new URL("https://www.canva.com/api/oauth/authorize");
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope, state, code_challenge: challenge, code_challenge_method: "S256" }).toString();
  return { url: url.toString(), state, verifier };
}

async function exchange(body: URLSearchParams) {
  const clientId = process.env.CANVA_CLIENT_ID;
  const clientSecret = process.env.CANVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Canva OAuth credentials are not configured.");
  const response = await fetch(tokenUrl, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
  const payload = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number; error?: string };
  if (!response.ok || !payload.access_token || !payload.refresh_token) throw new Error(payload.error || "Canva token exchange failed.");
  return payload as Required<Pick<typeof payload, "access_token" | "refresh_token" | "expires_in">>;
}

export async function storeCanvaAuthorization(ownerId: string, code: string, verifier: string) {
  const result = await exchange(new URLSearchParams({ grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: process.env.CANVA_REDIRECT_URI || "" }));
  await connectToDatabase();
  await CanvaConnection.findOneAndUpdate({ ownerId }, { accessToken: seal(result.access_token), refreshToken: seal(result.refresh_token), expiresAt: new Date(Date.now() + (result.expires_in || 14_400) * 1_000) }, { upsert: true, new: true });
}

export async function getCanvaAccessToken() {
  await connectToDatabase();
  const connection = await CanvaConnection.findOne().select("+accessToken +refreshToken").sort({ updatedAt: -1 });
  if (!connection) return null;
  if (connection.expiresAt.getTime() > Date.now() + 60_000) return open(connection.accessToken);
  const result = await exchange(new URLSearchParams({ grant_type: "refresh_token", refresh_token: open(connection.refreshToken) }));
  connection.accessToken = seal(result.access_token);
  connection.refreshToken = seal(result.refresh_token);
  connection.expiresAt = new Date(Date.now() + (result.expires_in || 14_400) * 1_000);
  await connection.save();
  return result.access_token;
}

function valueAt(source: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, source);
}

export async function createCanvaAutofill(source: Record<string, unknown>) {
  const templateId = process.env.CANVA_BRAND_TEMPLATE_ID;
  const rawMap = process.env.CANVA_AUTOFILL_FIELD_MAP;
  const token = await getCanvaAccessToken();
  if (!templateId || !rawMap || rawMap === "{}" || !token) return null;
  const mapping = JSON.parse(rawMap) as Record<string, string>;
  const data = Object.fromEntries(Object.entries(mapping).flatMap(([field, path]) => {
    const value = valueAt(source, path);
    return typeof value === "string" && value.trim() ? [[field, { type: "text", text: value.slice(0, 10_000) }]] : [];
  }));
  if (Object.keys(data).length === 0) return null;
  const response = await fetch("https://api.canva.com/rest/v1/autofills", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ type: "create_from_brand_template", brand_template_id: templateId, data }) });
  const payload = await response.json() as { job?: { id?: string }; error?: { message?: string } };
  if (!response.ok || !payload.job?.id) throw new Error(payload.error?.message || "Canva autofill request failed.");
  return payload.job.id;
}

export async function getCanvaAutofillJob(jobId: string) {
  const token = await getCanvaAccessToken();
  if (!token) throw new Error("Canva account is not connected.");
  const response = await fetch(`https://api.canva.com/rest/v1/autofills/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
  const payload = await response.json() as { job?: { status?: string; result?: { design?: { urls?: { edit_url?: string }; url?: string } }; error?: { message?: string } } };
  if (!response.ok || !payload.job) throw new Error("Canva autofill status request failed.");
  if (payload.job.status === "failed") throw new Error(payload.job.error?.message || "Canva could not generate the design.");
  return { complete: payload.job.status === "success", designUrl: payload.job.result?.design?.urls?.edit_url || payload.job.result?.design?.url };
}
