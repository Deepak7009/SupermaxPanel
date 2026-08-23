"use client";

import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createProduct } from "@/redux/thunks/productThunks";
import { createCategory } from "@/redux/thunks/categoryThunks";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Base Modal Props
interface BaseModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
}

// Generic Modal
const Modal = ({ isOpen, setIsOpen, title, children }: BaseModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--background)] rounded shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <button
          className="absolute top-3 right-3 text-[var(--label-muted)] hover:text-[var(--foreground)]"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// Product Modal
const ProductModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("0");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0 });
  const [tags, setTags] = useState("");
  const [images, setImages] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const selectedCategory = categories.find((c) => c._id === categoryId);
    if (!selectedCategory) return alert("Select a valid category");

    await dispatch(
      createProduct({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        price: Number(price),
        discount: Number(discount),
        stock: Number(stock),
        sku,
        categories: [selectedCategory._id] as unknown as { _id: string; name: string }[],
        brand,
        weight,
        dimensions,
        tags: tags.split(",").map((t) => t.trim()),
        isFeatured,
        isActive: true,
        images: images.split(",").map((url) => url.trim()),
      }),
    );

    setIsOpen(false);
  };

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c._id }));

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Product">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select
          value={categoryId}
          onChange={setCategoryId}
          options={categoryOptions}
          placeholder="Select Category"
        />
        <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input type="number" placeholder="Discount (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        <Input type="number" placeholder="Stock Quantity" value={stock} onChange={(e) => setStock(e.target.value)} />
        <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <Input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <Input placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Input
          placeholder="Dimensions (L,W,H)"
          value={`${dimensions.length},${dimensions.width},${dimensions.height}`}
          onChange={(e) => {
            const [l, w, h] = e.target.value.split(",").map(Number);
            setDimensions({ length: l || 0, width: w || 0, height: h || 0 });
          }}
        />
        <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <Input placeholder="Image URLs (comma separated)" value={images} onChange={(e) => setImages(e.target.value)} />
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isFeatured}
            onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
          />
          <span className="text-sm">Featured</span>
        </div>
        <Button type="submit" className="bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover-bg)]">
          Save Product
        </Button>
      </form>
    </Modal>
  );
};

// Category Modal
const CategoryModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parentCategory = parent
      ? categories.find((c) => c._id === parent)
      : null;

    await dispatch(
      createCategory({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        parent: parentCategory ? { _id: parentCategory._id, name: parentCategory.name } : null,
        isActive,
      }),
    );

    setIsOpen(false);
  };

  const parentOptions = categories.map((c) => ({ label: c.name, value: c._id }));

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Category">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select
          value={parent}
          onChange={setParent}
          options={parentOptions}
          placeholder="Select Parent Category (optional)"
        />
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(Boolean(checked))}
          />
          <span className="text-sm">Active</span>
        </div>
        <Button type="submit" className="bg-[var(--btn-success-bg)] hover:bg-[var(--btn-success-hover-bg)]">
          Save Category
        </Button>
      </form>
    </Modal>
  );
};

export { Modal, ProductModal, CategoryModal };
