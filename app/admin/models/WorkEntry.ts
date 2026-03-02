import { Schema, Document, model, models } from "mongoose";

export interface IWorkEntry extends Document {
  employee: Schema.Types.ObjectId;
  date: Date;
  quantity?: number;
  amount?: number;
  status: "WORK" | "WORK_OFF";
}

const workEntrySchema = new Schema<IWorkEntry>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },

    quantity: Number,
    amount: Number,

    status: {
      type: String,
      enum: ["WORK", "WORK_OFF"],
      default: "WORK",
    },
  },
  { timestamps: true },
);

workEntrySchema.index({ employee: 1, date: 1 }, { unique: true });

const WorkEntry =
  models.WorkEntry || model<IWorkEntry>("WorkEntry", workEntrySchema);

export default WorkEntry;
