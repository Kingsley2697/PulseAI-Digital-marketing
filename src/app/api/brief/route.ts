import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief, inMemoryBriefs } from "@/models/Brief";
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
  paymentStatus: z.enum(["pending", "paid", "scheduled"]).default("pending"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = BriefSubmissionSchema.parse(body);

    const db = await connectToDatabase();
    let savedBrief: any;

    if (db) {
      try {
        const briefDoc = await Brief.create(validatedData);
        savedBrief = briefDoc.toObject();
      } catch (dbErr) {
        console.warn("Direct MongoDB insert failed, falling back to memory:", dbErr);
        savedBrief = {
          _id: "brief_" + Date.now(),
          ...validatedData,
          createdAt: new Date(),
          status: "new",
        };
        inMemoryBriefs.unshift(savedBrief);
      }
    } else {
      savedBrief = {
        _id: "brief_" + Date.now(),
        ...validatedData,
        createdAt: new Date(),
        status: "new",
      };
      inMemoryBriefs.unshift(savedBrief);
    }

    // Trigger Telegram and/or Email alerts
    await sendNotification({
      type: "BRIEF_SUBMITTED",
      title: `🚀 New Growth Brief: ${validatedData.businessName}`,
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Marketing Brief successfully registered with PulseAI Digital.",
        briefId: savedBrief._id,
        brief: savedBrief,
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

    console.error("API Brief submission error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during brief submission." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const liveBriefs = await Brief.find().sort({ createdAt: -1 }).limit(50).lean();
      if (liveBriefs.length > 0) {
        return NextResponse.json({ success: true, count: liveBriefs.length, data: liveBriefs });
      }
    }

    // Return in-memory briefs or mock seed data if freshly launched
    const fallbackList = inMemoryBriefs.length > 0 ? inMemoryBriefs : getInitialSampleBriefs();
    return NextResponse.json({ success: true, count: fallbackList.length, data: fallbackList });
  } catch (err: unknown) {
    console.error("Error fetching briefs:", err);
    return NextResponse.json({ success: true, count: 0, data: getInitialSampleBriefs() });
  }
}

function getInitialSampleBriefs() {
  return [
    {
      _id: "sample_brief_1",
      businessName: "Aura Skincare Labs",
      industry: "D2C & Cosmetics",
      websiteUrl: "https://auraskincare.example.com",
      targetAudience: "Women 22-45 interested in clean, dermatological anti-aging beauty",
      primaryGoals: ["Direct Sales / E-commerce ROAS", "Omnichannel Content Scaling"],
      monthlyBudget: "$5,000 - $10,000 / mo",
      services: [
        "AI Content & Social Media Automation",
        "AI-Driven Meta & Google Ad Management",
      ],
      contactName: "Elena Rostova",
      email: "elena@auraskincare.example.com",
      phone: "+1 (415) 890-2341",
      preferredCurrency: "USD",
      paymentMethod: "crypto",
      paymentStatus: "paid",
      status: "in-progress",
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      _id: "sample_brief_2",
      businessName: "Apex Logistics Nigeria",
      industry: "B2B Freight & Supply Chain",
      websiteUrl: "https://apexlogistics.example.ng",
      targetAudience: "Import/Export corporate executives & retail distributors in Lagos & Abuja",
      primaryGoals: ["High-Intent Qualified B2B Leads", "Conversational AI WhatsApp Bot"],
      monthlyBudget: "₦3,150,000 / mo (Scale Plan)",
      services: [
        "Conversational AI Lead Capture Chatbots",
        "Local SEO & Google Business Profile Optimization",
      ],
      contactName: "Tunde Bakare",
      email: "tbakare@apexlogistics.example.ng",
      phone: "+234 803 555 0192",
      preferredCurrency: "NGN",
      paymentMethod: "flutterwave",
      paymentStatus: "paid",
      status: "converted",
      createdAt: new Date(Date.now() - 3600000 * 22),
    },
  ];
}
