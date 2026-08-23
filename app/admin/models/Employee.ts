import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IEmployee extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address?: string;

  advancePayment: number;
  paidPayment: number;

  workEntries: Schema.Types.ObjectId[];
}

const employeeSchema = new Schema<IEmployee>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    name: { type: String, required: true },

    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String },

    advancePayment: { type: Number, default: 0 },
    paidPayment: { type: Number, default: 0 },

    workEntries: [{ type: Schema.Types.ObjectId, ref: "WorkEntry" }],
  },
  { timestamps: true }
);

employeeSchema.index({ userId: 1, email: 1 }, { unique: true });
employeeSchema.index({ userId: 1, phone: 1 }, { unique: true });

const Employee =
  models.Employee || model<IEmployee>("Employee", employeeSchema);

export default Employee;
