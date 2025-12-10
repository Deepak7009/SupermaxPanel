import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  orders: Schema.Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },

    // store order history
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// avoid duplicate customers
customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ phone: 1 }, { unique: true });

const Customer =
  models.Customer || model<ICustomer>("Customer", customerSchema);

export default Customer;
