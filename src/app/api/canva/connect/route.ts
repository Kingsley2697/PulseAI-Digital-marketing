import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStaffSession } from "@/lib/auth/staff";
import { createCanvaAuthorization } from "@/lib/canva/connect";

export async function GET() {
  const session = await getStaffSession();
  if (!session || session.role !== "admin") return NextResponse.redirect(new URL("/staff/login", process.env.NEXT_PUBLIC_APP_URL));
  const { url, state, verifier } = createCanvaAuthorization();
  const store = await cookies();
  store.set("canva_oauth", JSON.stringify({ state, verifier, ownerId: session.id }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/canva", maxAge: 600 });
  return NextResponse.redirect(url);
}
