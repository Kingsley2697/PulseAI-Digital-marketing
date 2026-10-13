import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";
import { AutomationTask } from "@/models/AutomationTask";
import { sendApprovedProposal } from "@/lib/automation/lead-automation";

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
    await connectToDatabase();
    const brief = await Brief.findById(briefId);
    if (!brief || !brief.proposalDraft?.body) {
      return NextResponse.json({ success: false, error: "An approved proposal draft was not found." }, { status: 404 });
    }

    await sendApprovedProposal({
      name: brief.contactName,
      email: brief.email,
      company: brief.businessName,
      proposal: brief.proposalDraft,
    });

    await Promise.all([
      Brief.findByIdAndUpdate(briefId, { status: "reviewing" }),
      AutomationTask.updateMany(
        { sourceType: "brief", sourceId: brief._id, category: "proposal", status: "pending_review" },
        { status: "completed" }
      ),
      AutomationTask.updateMany(
        { sourceType: "brief", sourceId: brief._id, category: "onboarding", status: "pending_review" },
        { status: "in_progress" }
      ),
    ]);

    return NextResponse.json({ success: true, message: "Approved proposal sent and onboarding tasks activated." });
  } catch (error) {
    console.error("[Proposal Approval Error]", error);
    return NextResponse.json(
      { success: false, error: "The proposal could not be sent. Please try again." },
      { status: 500 }
    );
  }
}
