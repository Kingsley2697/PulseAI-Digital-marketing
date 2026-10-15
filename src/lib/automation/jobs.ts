import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import { runLeadAutomation } from "@/lib/automation/lead-automation";
import { sendNotification } from "@/lib/notifications/notify";
import { AutomationJob } from "@/models/AutomationJob";
import { AutomationTask } from "@/models/AutomationTask";
import { Brief } from "@/models/Brief";
import { AuditLog } from "@/models/AuditLog";
import { createCanvaAutofill, getCanvaAutofillJob } from "@/lib/canva/connect";
import { isEmailConfigured, sendCampaignReadyEmail } from "@/lib/email";

const maxConcurrentJobs = 5;

export async function enqueueBriefAutomation(briefId: string) {
  await connectToDatabase();
  return AutomationJob.create({ type: "brief_automation", sourceId: briefId, status: "queued", runAfter: new Date() });
}

function retryAt(attempts: number) {
  return new Date(Date.now() + Math.min(60 * 60_000, 30_000 * 2 ** attempts));
}

async function runBriefAutomation(briefId: string) {
  const brief = await Brief.findById(briefId);
  if (!brief) throw new Error("Brief no longer exists.");
  if (brief.automationStatus === "ready_for_review") return;

  await Brief.findByIdAndUpdate(briefId, { automationStatus: "processing", automationError: "" });
  const automation = await runLeadAutomation({
    source: "brief",
    recordId: String(brief._id),
    name: brief.contactName,
    email: brief.email,
    phone: brief.phone,
    company: brief.businessName,
    industry: brief.industry,
    budget: brief.monthlyBudget,
    services: brief.services,
    goals: brief.primaryGoals,
    message: brief.notes,
    timeline: brief.timeline,
  });

  await Brief.findByIdAndUpdate(briefId, {
    aiLeadAnalysis: automation.analysis,
    hubspotContactId: automation.hubspotContactId || "",
    automationCompletedAt: new Date(),
    proposalDraft: automation.proposalDraft,
    launchPlan: automation.launchPlan,
    automationStatus: "ready_for_review",
    automationError: automation.errors.join(" | "),
    status: "reviewing",
  });

  const existingTaskCount = await AutomationTask.countDocuments({ sourceType: "brief", sourceId: brief._id });
  if (existingTaskCount === 0) {
    await AutomationTask.insertMany(automation.tasks.map((task) => ({ ...task, sourceType: "brief", sourceId: brief._id })));
  }

  const canvaJobId = await createCanvaAutofill({ businessName: brief.businessName, proposal: automation.proposalDraft, launchPlan: automation.launchPlan });
  if (canvaJobId) {
    await Brief.findByIdAndUpdate(briefId, { canvaAutofillJobId: canvaJobId });
    await AutomationJob.create({ type: "canva_status", sourceId: brief._id, status: "queued", runAfter: new Date(Date.now() + 15_000) });
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  await sendNotification({
    type: "BRIEF_SUBMITTED",
    title: `AI review ready: ${brief.businessName}`,
    data: {
      Business: brief.businessName,
      Contact: `${brief.contactName} (${brief.email})`,
      BriefId: String(brief._id),
      LeadQualification: automation.analysis?.qualification || "pending manual review",
      AIRecommendation: automation.analysis?.recommendedNextStep || "Review manually",
      StaffDashboard: `${appUrl}/staff`,
    },
    staffReviewAlert: { dashboardUrl: `${appUrl}/staff`, summary: `AI review is ready for ${brief.businessName}.` },
  });
  await AuditLog.create({ action: "brief.automation.completed", entityType: "brief", entityId: briefId, metadata: { errors: automation.errors } });
}

export async function processAutomationJobs(limit = maxConcurrentJobs) {
  await connectToDatabase();
  let processed = 0;
  for (let index = 0; index < limit; index += 1) {
    const job = await AutomationJob.findOneAndUpdate(
      { status: { $in: ["queued", "retrying"] }, runAfter: { $lte: new Date() } },
      { $set: { status: "processing" }, $inc: { attempts: 1 } },
      { sort: { runAfter: 1 }, new: true }
    );
    if (!job) break;
    processed += 1;
    try {
      if (job.type === "brief_automation") await runBriefAutomation(String(job.sourceId));
      if (job.type === "canva_status") {
        const brief = await Brief.findById(job.sourceId);
        if (!brief?.canvaAutofillJobId) throw new Error("Canva autofill job is missing.");
        const canva = await getCanvaAutofillJob(brief.canvaAutofillJobId);
        if (!canva.complete) throw new Error("Canva design is still being generated.");
        await Brief.findByIdAndUpdate(job.sourceId, { canvaDesignUrl: canva.designUrl || "" });
        if (canva.designUrl && !brief.canvaClientEmailSentAt && isEmailConfigured()) {
          const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
          await sendCampaignReadyEmail({
            name: brief.contactName,
            email: brief.email,
            company: brief.businessName,
            assetReviewUrl: canva.designUrl,
            onboardingUrl: `${appUrl}/brief-status/${brief.clientTrackingToken}`,
          });
          await Brief.findByIdAndUpdate(job.sourceId, { canvaClientEmailSentAt: new Date() });
        }
      }
      await AutomationJob.findByIdAndUpdate(job._id, { status: "completed", completedAt: new Date(), lastError: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown automation failure.";
      const failed = job.attempts >= job.maxAttempts;
      await AutomationJob.findByIdAndUpdate(job._id, {
        status: failed ? "failed" : "retrying",
        lastError: message,
        runAfter: failed ? job.runAfter : retryAt(job.attempts),
      });
      if (failed) {
        await Brief.findByIdAndUpdate(job.sourceId, { automationStatus: "failed", automationError: message });
        await AuditLog.create({ action: "brief.automation.failed", entityType: "automation", entityId: String(job._id), metadata: { briefId: String(job.sourceId), message } });
      }
    }
  }
  return { processed };
}
