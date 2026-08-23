"use client";

import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createProduct, updateProduct } from "@/redux/thunks/productThunks";

import DialogModal from "@/components/common/DialogModal";
import FloatingInput from "@/components/common/FloatingInput";
import MultiSelect from "@/components/common/MultiSelect";
import Button from "@/components/common/Button";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/redux/types/product";

interface ProductModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product?: Product | null;
}

const ProductModal = ({ isOpen, setIsOpen, product }: ProductModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  // ---------------- STATE ----------------
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [sku, setSku] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0 });
  const [tags, setTags] = useState("");
  const [images, setImages] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // ---------------- RESET FORM WHEN product / isOpen CHANGES ----------------
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || 0);
      setDiscount(product.discount || 0);
      setStock(product.stock || 0);
      setSku(product.sku || "");
      setCategoryIds((product.categories ?? []).map((c) => c._id));
      setBrand(product.brand || "");
      setWeight(product.weight || "");
      setDimensions(
        product.dimensions
          ? {
              length: product.dimensions.length ?? 0,
              width: product.dimensions.width ?? 0,
              height: product.dimensions.height ?? 0,
            }
          : { length: 0, width: 0, height: 0 }
      );
      setTags((product.tags ?? []).join(","));
      setImages((product.images ?? []).join(","));
      setIsFeatured(product.isFeatured || false);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setDiscount(0);
      setStock(0);
      setSku("");
      setCategoryIds([]);
      setBrand("");
      setWeight("");
      setDimensions({ length: 0, width: 0, height: 0 });
      setTags("");
      setImages("");
      setIsFeatured(false);
    }
  }, [product]);

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (categoryIds.length === 0) {
      return alert("Please select at least one category");
    }

    const payload = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      price,
      discount,
      stock,
      sku,
      // Send as plain IDs; API stores them and returns populated {_id, name} objects
      categories: categoryIds as unknown as { _id: string; name: string }[],
      brand,
      weight,
      dimensions,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      images: images.split(",").map((t) => t.trim()).filter(Boolean),
      isFeatured,
      isActive: true,
    };

    if (product) {
      await dispatch(updateProduct({ id: product._id, updatedData: payload }));
    } else {
      await dispatch(createProduct(payload));
    }

    setIsOpen(false);
  };

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c._id,
  }));

  // ---------------- JSX ----------------
  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={product ? "Edit Product" : "Add Product"}
      className="max-w-4xl"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Row 1: Name + Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--muted-foreground)] font-medium">
              Categories <span className="text-[var(--text-error)]">*</span>
            </label>
            <MultiSelect
              options={categoryOptions}
              value={categoryIds}
              onChange={setCategoryIds}
              placeholder="Select categories..."
            />
          </div>
        </div>

        {/* Description */}
        <Textarea
          value={description}
          placeholder="Description"
          className="w-full h-24 resize-none"
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Row 2: Price, Discount, Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingInput
            label="Price"
            type="number"
            value={price.toString()}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <FloatingInput
            label="Discount (%)"
            type="number"
            value={discount.toString()}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
          <FloatingInput
            label="Stock"
            type="number"
            value={stock.toString()}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        {/* Row 3: SKU, Brand, Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingInput
            label="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <FloatingInput
            label="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <FloatingInput
            label="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        {/* Row 4: Dimensions, Tags, Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingInput
            label="Dimensions L,W,H"
            value={`${dimensions.length},${dimensions.width},${dimensions.height}`}
            onChange={(e) => {
              const [l, w, h] = e.target.value.split(",").map(Number);
              setDimensions({ length: l || 0, width: w || 0, height: h || 0 });
            }}
          />
          <FloatingInput
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <FloatingInput
            label="Image URLs (comma separated)"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isFeatured}
            onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
          />
          <span>Featured</span>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit">
            {product ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </form>
    </DialogModal>
  );
};

export default ProductModal;
