import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Contact } from "@/models/Contact";
import { sendNotification } from "@/lib/notifications/notify";

const ContactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional().default(""),
  companyName: z.string().optional().default(""),
  serviceInterest: z.string().default("General Inquiry"),
  estimatedBudget: z.string().optional().default("$1,000 - $5,000"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ContactSchema.parse(body);

    await connectToDatabase();
    const contactDoc = await Contact.create(validated);

    // Trigger real notification
    await sendNotification({
      type: "CONTACT_INQUIRY",
      title: `📩 New Client Inquiry: ${validated.fullName}`,
      data: {
        Name: validated.fullName,
        Email: validated.email,
        Phone: validated.phone || "N/A",
        Company: validated.companyName || "N/A",
        Service: validated.serviceInterest,
        Budget: validated.estimatedBudget,
        Message: validated.message,
        ContactId: String(contactDoc._id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! A senior PulseAI Growth Strategist will respond within 2 business hours.",
        contactId: String(contactDoc._id),
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

    console.error("[Contact API Error]:", err);
    const msg =
      err instanceof Error ? err.message : "An unexpected error occurred while sending your message.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ success: true, count: contacts.length, data: contacts });
  } catch (err: unknown) {
    console.error("[Contact Retrieval Error]:", err);
    const msg = err instanceof Error ? err.message : "Error retrieving contact records.";
    return NextResponse.json({ success: false, error: msg, count: 0, data: [] }, { status: 500 });
  }
}
