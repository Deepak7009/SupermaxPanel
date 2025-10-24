import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "./Category";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  category: ICategory["_id"];
  price: number;
  discount?: number;
  finalPrice: number;
  stock: number;
  sku: string;
  images: string[];
  brand?: string;
  weight?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    images: [
      {
        type: String,
      },
    ],
    brand: {
      type: String,
    },
    weight: {
      type: String,
    },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    tags: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate final price before saving
ProductSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * (this.discount || 0)) / 100;
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
