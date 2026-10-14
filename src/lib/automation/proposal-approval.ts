import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";
import { AutomationTask } from "@/models/AutomationTask";
import { sendApprovedProposal } from "@/lib/automation/lead-automation";

export async function approveProposalForBrief(briefId: string) {
  await connectToDatabase();
  const brief = await Brief.findById(briefId);
  if (!brief || !brief.proposalDraft?.body) {
    throw new Error("An approved proposal draft was not found.");
  }

  const proposalTask = await AutomationTask.findOne({
    sourceType: "brief",
    sourceId: brief._id,
    category: "proposal",
  });
  if (proposalTask?.status === "completed") {
    throw new Error("This proposal has already been sent.");
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
}
