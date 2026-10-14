import { NextRequest, NextResponse } from "next/server";
import { approveProposalForBrief } from "@/lib/automation/proposal-approval";

function isAuthorized(request: NextRequest) {
  const token = process.env.INTERNAL_AUTOMATION_TOKEN;
  const authorization = request.headers.get("authorization");
  return Boolean(token && authorization === `Bearer ${token}`);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ briefId: string }> }
) {
  if (!process.env.INTERNAL_AUTOMATION_TOKEN) {
    return NextResponse.json({ success: false, error: "Internal automation is not configured." }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const { briefId } = await context.params;
  try {
    await approveProposalForBrief(briefId);
    return NextResponse.json({ success: true, message: "Approved proposal sent and onboarding tasks activated." });
  } catch (error) {
    console.error("[Proposal Approval Error]", error);
    const message = error instanceof Error ? error.message : "The proposal could not be sent. Please try again.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
