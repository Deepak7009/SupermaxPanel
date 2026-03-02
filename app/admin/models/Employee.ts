import { Schema, Document, model, models } from "mongoose";

export interface IEmployee extends Document {
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

employeeSchema.index({ email: 1 }, { unique: true });
employeeSchema.index({ phone: 1 }, { unique: true });

const Employee =
  models.Employee || model<IEmployee>("Employee", employeeSchema);

export default Employee;
