import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICanvaConnection extends Document {
  ownerId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CanvaConnectionSchema = new Schema<ICanvaConnection>(
  {
    ownerId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true, select: false },
    refreshToken: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CanvaConnection: Model<ICanvaConnection> =
  mongoose.models.CanvaConnection || mongoose.model<ICanvaConnection>("CanvaConnection", CanvaConnectionSchema);
