"use client";

import { useState } from "react";
import DialogModal from "@/components/common/DialogModal";
import ProductModal from "./ProductModal";
import { Product } from "@/redux/slices/productSlice";
import Button from "../common/Button";

interface ProductViewModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product | null;
}

const ProductViewModal = ({
  isOpen,
  setIsOpen,
  product,
}: ProductViewModalProps) => {
  const [editOpen, setEditOpen] = useState(false);

  if (!product) return null;

  const formatDimensions = (): string =>
    product.dimensions
      ? `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}`
      : "N/A";

  return (
    <>
      <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="View Product">
        <div className="grid grid-cols-2 gap-3 p-2 text-sm">
          <Info label="Name" value={product.name || "N/A"} />
          <Info label="Category" value={product.category?.name || "N/A"} />
          <Info label="Price" value={`$${product.finalPrice ?? 0}`} />
          <Info label="Stock" value={product.stock?.toString() ?? "0"} />
          <Info label="SKU" value={product.sku || "N/A"} />
          <Info label="Brand" value={product.brand || "N/A"} />
          <Info label="Weight" value={product.weight?.toString() || "N/A"} />
          <Info label="Dimensions" value={formatDimensions()} />
          <Info label="Tags" value={(product.tags ?? []).join(", ") || "N/A"} />
          <Info label="Featured" value={product.isFeatured ? "Yes" : "No"} />
          <Info
            label="Description"
            value={product.description || "N/A"}
            colSpan={2}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={() => {
              setIsOpen(false);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </DialogModal>

      {editOpen && product && (
        <ProductModal
          isOpen={editOpen}
          setIsOpen={setEditOpen}
          product={product}
        />
      )}
    </>
  );
};

// Reusable Info component for product fields
interface InfoProps {
  label: string;
  value: string;
  colSpan?: number;
}

const Info = ({ label, value, colSpan = 1 }: InfoProps) => (
  <div className={`flex flex-col ${colSpan > 1 ? `col-span-${colSpan}` : ""}`}>
    <span className="text-muted-foreground font-semibold text-sm">{label}</span>
    <span className="text-[15px]">{value}</span>
  </div>
);

export default ProductViewModal;
