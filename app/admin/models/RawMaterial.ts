import mongoose, { Schema, Document } from "mongoose";

export interface IRawMaterial extends Document {
  userId: mongoose.Types.ObjectId;
  shopName: string;
  materialName: string;
  quantity: number;
  buyerName: string;
  amount: number;
  date: Date;
  status: "pending" | "paid";
}

const RawMaterialSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    shopName: {
      type: String,
      required: true,
    },
    materialName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.RawMaterial ||
  mongoose.model<IRawMaterial>("RawMaterial", RawMaterialSchema);