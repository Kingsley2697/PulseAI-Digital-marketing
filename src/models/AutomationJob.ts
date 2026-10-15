import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IAutomationJob extends Document {
  type: "brief_automation" | "canva_status";
  sourceId: Types.ObjectId;
  status: "queued" | "processing" | "completed" | "retrying" | "failed";
  attempts: number;
  maxAttempts: number;
  runAfter: Date;
  lastError?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationJobSchema = new Schema<IAutomationJob>(
  {
    type: { type: String, enum: ["brief_automation", "canva_status"], required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true, index: true },
    status: { type: String, enum: ["queued", "processing", "completed", "retrying", "failed"], default: "queued", index: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    runAfter: { type: Date, default: Date.now, index: true },
    lastError: { type: String, default: "" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

AutomationJobSchema.index({ status: 1, runAfter: 1 });

export const AutomationJob: Model<IAutomationJob> =
  mongoose.models.AutomationJob || mongoose.model<IAutomationJob>("AutomationJob", AutomationJobSchema);
