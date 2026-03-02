import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IFactoryExpense extends Document {
  name: string;
  amount: number;
  entryDate: Date;
  entryPerson: string;
  quantity: number;
  shopName: string;
  status: "pending" | "approved" | "rejected";
}

const factoryExpenseSchema = new Schema<IFactoryExpense>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    entryDate: {
      type: Date,
      required: true,
    },

    entryPerson: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const FactoryExpense =
  models.FactoryExpense ||
  model<IFactoryExpense>("FactoryExpense", factoryExpenseSchema);

export default FactoryExpense;
