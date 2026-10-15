import { NextRequest, NextResponse } from "next/server";
import { processAutomationJobs } from "@/lib/automation/jobs";

export async function POST(request: NextRequest) {
  const token = process.env.INTERNAL_AUTOMATION_TOKEN;
  if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  const result = await processAutomationJobs();
  return NextResponse.json({ success: true, ...result });
}
