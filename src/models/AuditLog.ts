import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAuditLog extends Document {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: "brief" | "staff" | "automation" | "canva";
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: String, default: "" },
    actorEmail: { type: String, default: "" },
    action: { type: String, required: true, index: true },
    entityType: { type: String, enum: ["brief", "staff", "automation", "canva"], required: true },
    entityId: { type: String, default: "", index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
