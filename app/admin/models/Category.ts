import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: ICategory["_id"] | null;
  level: number; // 0 = main, 1 = sub, 2 = sub-sub
  ancestors?: Array<{ _id: Schema.Types.ObjectId; name: string; slug: string }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
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
    image: {
      type: String,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    ancestors: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Category" },
        name: String,
        slug: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compute level & ancestors before saving
CategorySchema.pre("save", async function (next) {
  if (this.parent) {
    const parentCategory = await mongoose
      .model("Category")
      .findById(this.parent)
      .select("ancestors level name slug");

    if (parentCategory) {
      this.level = parentCategory.level + 1;
      this.ancestors = [
        ...(parentCategory.ancestors || []),
        {
          _id: parentCategory._id,
          name: parentCategory.name,
          slug: parentCategory.slug,
        },
      ];
    }
  } else {
    this.level = 0;
    this.ancestors = [];
  }

  next();
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
