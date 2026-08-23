import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IFactoryExpense extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  entryDate: Date;
  entryPerson: string;
  quantity: number;
  shopName: string;
  status: "pending" | "paid";
}

const factoryExpenseSchema = new Schema<IFactoryExpense>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
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
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const FactoryExpense =
  models.FactoryExpense ||
  model<IFactoryExpense>("FactoryExpense", factoryExpenseSchema);

export default FactoryExpense;
