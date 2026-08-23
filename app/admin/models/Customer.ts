import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  orders: Schema.Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },

    // store order history
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// avoid duplicate customers per user
customerSchema.index({ userId: 1, email: 1 }, { unique: true });
customerSchema.index({ userId: 1, phone: 1 }, { unique: true });

const Customer =
  models.Customer || model<ICustomer>("Customer", customerSchema);

export default Customer;
