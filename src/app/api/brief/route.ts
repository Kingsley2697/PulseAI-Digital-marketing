import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";
import { sendNotification } from "@/lib/notifications/notify";
import { runLeadAutomation } from "@/lib/automation/lead-automation";

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
  paymentStatus: z
    .enum(["pending", "verifying", "paid", "scheduled", "failed"])
    .default("pending"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = BriefSubmissionSchema.parse(body);

    await connectToDatabase();
    const briefDoc = await Brief.create(validatedData);

    const automation = await runLeadAutomation({
      source: "brief",
      recordId: String(briefDoc._id),
      name: validatedData.contactName,
      email: validatedData.email,
      phone: validatedData.phone,
      company: validatedData.businessName,
      industry: validatedData.industry,
      budget: validatedData.monthlyBudget,
      services: validatedData.services,
      goals: validatedData.primaryGoals,
      message: validatedData.notes,
      timeline: validatedData.timeline,
    });

    await Brief.findByIdAndUpdate(briefDoc._id, {
      aiLeadAnalysis: automation.analysis,
      hubspotContactId: automation.hubspotContactId || "",
      automationCompletedAt: new Date(),
    });

    // Trigger real-time notification
    await sendNotification({
      type: "BRIEF_SUBMITTED",
      title: `🚀 New Real Client Brief: ${validatedData.businessName}`,
      data: {
        Business: validatedData.businessName,
        Industry: validatedData.industry,
        Contact: `${validatedData.contactName} (${validatedData.email})`,
        Phone: validatedData.phone,
        Budget: validatedData.monthlyBudget,
        Services: validatedData.services,
        Goals: validatedData.primaryGoals,
        Currency: validatedData.preferredCurrency,
        PaymentOption: validatedData.paymentMethod,
        BriefId: String(briefDoc._id),
        LeadQualification: automation.analysis?.qualification || "pending manual review",
        AIRecommendation: automation.analysis?.recommendedNextStep || "Review manually",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Marketing Brief successfully registered in live database.",
        briefId: String(briefDoc._id),
        brief: briefDoc,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: err.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }

    console.error("[API Brief Submission Error]:", err);
    const errorMsg =
      err instanceof Error ? err.message : "An unexpected error occurred during brief submission.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "This endpoint is not publicly available." },
    { status: 403 }
  );
}
