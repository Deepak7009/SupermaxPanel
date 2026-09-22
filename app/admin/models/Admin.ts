import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "superadmin" | "user";
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  passwordToken?: string;
  passwordTokenExpiry?: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: "" },
    role: {
      type: String,
      enum: ["superadmin", "user"],
      default: "user",
    },
    isActive: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    passwordToken: { type: String, default: null },
    passwordTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const Admin = models.Admin || model<IAdmin>("Admin", adminSchema);

export default Admin;
