"use client";

import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createProduct } from "@/redux/thunks/productThunks";
import { createCategory } from "@/redux/thunks/categoryThunks";

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
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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

  // Product state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0 });
  const [tags, setTags] = useState<string>(""); // comma separated
  const [images, setImages] = useState<string>(""); // comma separated URLs
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Find category object
    const selectedCategory = categories.find((c) => c._id === categoryId);
    if (!selectedCategory) return alert("Select a valid category");

    await dispatch(
      createProduct({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        price,
        discount,
        // finalPrice: price - (price * discount) / 100,
        stock,
        sku,
        category: { _id: selectedCategory._id, name: selectedCategory.name },
        // category: selectedCategory._id,
        brand,
        weight,
        dimensions,
        tags: tags.split(",").map((t) => t.trim()),
        isFeatured,
        isActive: true,
        images: images.split(",").map((url) => url.trim()),
      })
    );

    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Product">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          className="border p-2 rounded w-full"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Dimensions (L,W,H)"
          value={`${dimensions.length},${dimensions.width},${dimensions.height}`}
          onChange={(e) => {
            const [l, w, h] = e.target.value.split(",").map(Number);
            setDimensions({ length: l || 0, width: w || 0, height: h || 0 });
          }}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Images URLs (comma separated)"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured
        </label>
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Product
        </button>
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
  const [parent, setParent] = useState<string>(""); // parent category _id
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Find parent category object
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
      })
    );

    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Category">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Parent Category (optional)</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Save Category
        </button>
      </form>
    </Modal>
  );
};

export { Modal, ProductModal, CategoryModal };
