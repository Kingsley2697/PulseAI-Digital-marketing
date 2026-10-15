import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enqueueBriefAutomation, processAutomationJobs } from "@/lib/automation/jobs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { Brief } from "@/models/Brief";
import { sendNotification } from "@/lib/notifications/notify";

const BriefSubmissionSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(2, "Industry is required"),
  websiteUrl: z.string().optional().default(""),
  socialHandles: z.string().optional().default(""),
  teamSize: z.string().optional().default("1-10"),
  targetAudience: z.string().min(3, "Target audience description is required"),
  primaryGoals: z.array(z.string()).min(1, "Select at least one primary goal"),
  currentMonthlyRevenue: z.string().optional().default("$10k - $50k"),
  monthlyBudget: z.string().min(1, "Monthly budget is required"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  timeline: z.string().optional().default("Immediate (Within 7 days)"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(5, "Contact phone number is required"),
  notes: z.string().optional().default(""),
  preferredCurrency: z.enum(["USD", "NGN"]).default("USD"),
  paymentMethod: z.enum(["flutterwave", "crypto", "invoice"]).default("invoice"),
  paymentStatus: z.enum(["pending", "verifying", "paid", "scheduled", "failed"]).default("pending"),
});

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const rate = enforceRateLimit(`brief:${forwardedFor || "unknown"}`);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Too many submissions. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
    }
    const validatedData = BriefSubmissionSchema.parse(await req.json());
    await connectToDatabase();
    const brief = await Brief.create({
      ...validatedData,
      clientTrackingToken: randomBytes(24).toString("base64url"),
      automationStatus: "queued",
    });
    await sendNotification({
      type: "BRIEF_SUBMITTED",
      title: `New client brief: ${brief.businessName}`,
      data: {
        Business: brief.businessName,
        Contact: `${brief.contactName} (${brief.email})`,
        Services: brief.services,
        Budget: brief.monthlyBudget,
        BriefId: String(brief._id),
      },
    });
    await enqueueBriefAutomation(String(brief._id));
    // Fast path for long-running local servers. In production, call the protected jobs endpoint every minute.
    void processAutomationJobs(1).catch((error) => console.error("[Brief Worker Start Error]", error));

    return NextResponse.json(
      {
        success: true,
        message: "Marketing brief received. Your strategy workspace is now being prepared.",
        briefId: String(brief._id),
        trackingUrl: `/brief-status/${brief.clientTrackingToken}`,
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: err.issues.map((e) => ({ field: e.path.join("."), message: e.message })) }, { status: 400 });
    }
    console.error("[API Brief Submission Error]:", err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "An unexpected error occurred." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: "This endpoint is not publicly available." }, { status: 403 });
}
