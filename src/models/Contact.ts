import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  serviceInterest: string;
  estimatedBudget?: string;
  message: string;
  status: "new" | "replied" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    companyName: { type: String, default: "" },
    serviceInterest: { type: String, default: "General Inquiry" },
    estimatedBudget: { type: String, default: "$1,000 - $5,000" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "replied", "closed"], default: "new" },
  },
  { timestamps: true }
);

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
