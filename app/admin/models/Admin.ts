import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends mongoose.Document {
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();   
});

adminSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const Admin = models.Admin || model<IAdmin>('Admin', adminSchema);
export default Admin;
