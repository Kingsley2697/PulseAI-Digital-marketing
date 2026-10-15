import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { storeCanvaAuthorization } from "@/lib/canva/connect";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const store = await cookies();
  const raw = store.get("canva_oauth")?.value;
  store.delete("canva_oauth");
  try {
    const saved = raw ? JSON.parse(raw) as { state: string; verifier: string; ownerId: string } : null;
    if (!code || !saved || saved.state !== state) throw new Error("Canva authorization could not be verified.");
    await storeCanvaAuthorization(saved.ownerId, code, saved.verifier);
    return NextResponse.redirect(new URL("/staff?message=canva-connected", request.url));
  } catch (error) {
    return NextResponse.redirect(new URL(`/staff?error=${encodeURIComponent(error instanceof Error ? error.message : "Canva connection failed.")}`, request.url));
  }
}
