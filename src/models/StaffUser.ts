import mongoose, { Document, Model, Schema } from "mongoose";

export type StaffRole = "admin" | "strategist" | "reviewer";

export interface IStaffUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: StaffRole;
  active: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffUserSchema = new Schema<IStaffUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "strategist", "reviewer"], default: "reviewer" },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const StaffUser: Model<IStaffUser> =
  mongoose.models.StaffUser || mongoose.model<IStaffUser>("StaffUser", StaffUserSchema);
