import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IAutomationTask extends Document {
  sourceType: "brief" | "contact";
  sourceId: Types.ObjectId;
  title: string;
  description: string;
  category: "review" | "proposal" | "onboarding" | "campaign";
  status: "pending_review" | "approved" | "in_progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const AutomationTaskSchema = new Schema<IAutomationTask>(
  {
    sourceType: { type: String, enum: ["brief", "contact"], required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, enum: ["review", "proposal", "onboarding", "campaign"], required: true },
    status: {
      type: String,
      enum: ["pending_review", "approved", "in_progress", "completed", "cancelled"],
      default: "pending_review",
    },
  },
  { timestamps: true }
);

export const AutomationTask: Model<IAutomationTask> =
  mongoose.models.AutomationTask || mongoose.model<IAutomationTask>("AutomationTask", AutomationTaskSchema);
