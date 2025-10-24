"use client";

import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createProduct } from "@/redux/thunks/productThunks";
import DialogModal from "@/components/common/DialogModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ProductModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ProductModal = ({ isOpen, setIsOpen }: ProductModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

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
  const [tags, setTags] = useState<string>("");
  const [images, setImages] = useState<string>("");
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
        price,
        discount,
        stock,
        sku,
        category: { _id: selectedCategory._id, name: selectedCategory.name },
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
    <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Product">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select onValueChange={setCategoryId} value={categoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        <Input type="number" placeholder="Discount (%)" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        <Input type="number" placeholder="Stock Quantity" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
        <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
        <Input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <Input placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Input
          placeholder="Dimensions L,W,H"
          value={`${dimensions.length},${dimensions.width},${dimensions.height}`}
          onChange={(e) => {
            const [l, w, h] = e.target.value.split(",").map(Number);
            setDimensions({ length: l || 0, width: w || 0, height: h || 0 });
          }}
        />
        <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <Input placeholder="Images URLs (comma separated)" value={images} onChange={(e) => setImages(e.target.value)} />
        <div className="flex items-center gap-2">
          <Checkbox checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(Boolean(checked))} />
          Featured
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Save Product
        </Button>
      </form>
    </DialogModal>
  );
};

export default ProductModal;
