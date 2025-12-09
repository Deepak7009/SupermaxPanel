import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IOrder extends Document {
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: Schema.Types.ObjectId; // renamed to match frontend
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    items: [
      {
        productId: {  // rename here
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
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
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
