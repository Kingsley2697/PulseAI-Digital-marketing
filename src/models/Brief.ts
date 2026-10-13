import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrief extends Document {
  // Step 1: Business Details
  businessName: string;
  industry: string;
  websiteUrl?: string;
  socialHandles?: string;
  teamSize?: string;

  // Step 2: Target Audience & Goals
  targetAudience: string;
  primaryGoals: string[];
  currentMonthlyRevenue?: string;

  // Step 3: Budget & Services
  monthlyBudget: string;
  services: string[];
  timeline?: string;

  // Step 4: Contact & Billing Info
  contactName: string;
  email: string;
  phone: string;
  notes?: string;
  preferredCurrency: "USD" | "NGN";
  paymentMethod?: "flutterwave" | "crypto" | "invoice";
  paymentStatus: "pending" | "verifying" | "paid" | "scheduled" | "failed";

  // Real Payment Tracking Fields
  paymentRef?: string;
  paymentAmount?: number;
  paymentVerifiedAt?: Date;
  flwTransactionId?: string;
  cryptoInvoiceId?: string;
  cryptoNetwork?: string;
  cryptoDepositAddress?: string;
  cryptoAmount?: string;
  cryptoTxHash?: string;

  aiLeadAnalysis?: {
    summary: string;
    qualification: "high" | "medium" | "low";
    recommendedNextStep: string;
    suggestedServices: string[];
    internalNotes: string;
  };
  hubspotContactId?: string;
  automationCompletedAt?: Date;

  // System
  status: "new" | "reviewing" | "in-progress" | "converted";
  createdAt: Date;
  updatedAt: Date;
}

const BriefSchema = new Schema<IBrief>(
  {
    businessName: { type: String, required: true },
    industry: { type: String, required: true },
    websiteUrl: { type: String, default: "" },
    socialHandles: { type: String, default: "" },
    teamSize: { type: String, default: "1-10" },

    targetAudience: { type: String, required: true },
    primaryGoals: { type: [String], default: [] },
    currentMonthlyRevenue: { type: String, default: "$10k - $50k" },

    monthlyBudget: { type: String, required: true },
    services: { type: [String], default: [] },
    timeline: { type: String, default: "Immediate (Within 7 days)" },

    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: "" },
    preferredCurrency: { type: String, enum: ["USD", "NGN"], default: "USD" },
    paymentMethod: { type: String, enum: ["flutterwave", "crypto", "invoice"], default: "invoice" },
    paymentStatus: {
      type: String,
      enum: ["pending", "verifying", "paid", "scheduled", "failed"],
      default: "pending",
    },

    paymentRef: { type: String, default: "" },
    paymentAmount: { type: Number },
    paymentVerifiedAt: { type: Date },
    flwTransactionId: { type: String, default: "" },
    cryptoInvoiceId: { type: String, default: "" },
    cryptoNetwork: { type: String, default: "" },
    cryptoDepositAddress: { type: String, default: "" },
    cryptoAmount: { type: String, default: "" },
    cryptoTxHash: { type: String, default: "" },
    aiLeadAnalysis: {
      summary: { type: String, default: "" },
      qualification: { type: String, enum: ["high", "medium", "low"] },
      recommendedNextStep: { type: String, default: "" },
      suggestedServices: { type: [String], default: [] },
      internalNotes: { type: String, default: "" },
    },
    hubspotContactId: { type: String, default: "" },
    automationCompletedAt: { type: Date },

    status: { type: String, enum: ["new", "reviewing", "in-progress", "converted"], default: "new" },
  },
  { timestamps: true }
);

export const Brief: Model<IBrief> =
  mongoose.models.Brief || mongoose.model<IBrief>("Brief", BriefSchema);
