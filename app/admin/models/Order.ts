import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IPaymentEntry {
  amount: number;
  type: "advance" | "partial" | "installment" | "full";
  method: "cash" | "upi" | "bank" | "other";
  note?: string;
  date: Date;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
  customerAddress?: string;
  note?: string;

  items: Array<{
    productId: Schema.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  // Payment tracking
  paidAmount: number;
  advanceAmount: number;
  paymentStatus: "unpaid" | "advance" | "partial" | "paid" | "overpaid";
  payments: IPaymentEntry[];

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerMobile: { type: String },
    customerAddress: { type: String },
    note: { type: String },

    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // Payment tracking fields
    paidAmount:    { type: Number, default: 0 },
    advanceAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "advance", "partial", "paid", "overpaid"],
      default: "unpaid",
    },
    payments: [
      {
        amount: { type: Number, required: true },
        type:   { type: String, enum: ["advance", "partial", "installment", "full"], required: true },
        method: { type: String, enum: ["cash", "upi", "bank", "other"], default: "cash" },
        note:   { type: String },
        date:   { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
