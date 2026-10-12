import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Contact, inMemoryContacts } from "@/models/Contact";
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

    const db = await connectToDatabase();
    let savedRecord: any;

    if (db) {
      try {
        const contactDoc = await Contact.create(validated);
        savedRecord = contactDoc.toObject();
      } catch (dbErr) {
        console.warn("MongoDB insert error for Contact, fallback to memory:", dbErr);
        savedRecord = {
          _id: "contact_" + Date.now(),
          ...validated,
          createdAt: new Date(),
          status: "new",
        };
        inMemoryContacts.unshift(savedRecord);
      }
    } else {
      savedRecord = {
        _id: "contact_" + Date.now(),
        ...validated,
        createdAt: new Date(),
        status: "new",
      };
      inMemoryContacts.unshift(savedRecord);
    }

    // Trigger notification
    await sendNotification({
      type: "CONTACT_INQUIRY",
      title: `📩 New Contact Inquiry: ${validated.fullName}`,
      data: {
        Name: validated.fullName,
        Email: validated.email,
        Phone: validated.phone || "N/A",
        Company: validated.companyName || "N/A",
        Service: validated.serviceInterest,
        Budget: validated.estimatedBudget,
        Message: validated.message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! A senior PulseAI Growth Strategist will respond within 2 business hours.",
        contactId: savedRecord._id,
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

    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while sending your message." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50).lean();
      if (contacts.length > 0) {
        return NextResponse.json({ success: true, count: contacts.length, data: contacts });
      }
    }
    return NextResponse.json({ success: true, count: inMemoryContacts.length, data: inMemoryContacts });
  } catch (err) {
    console.error("Error retrieving contact messages:", err);
    return NextResponse.json({ success: true, count: 0, data: [] });
  }
}
