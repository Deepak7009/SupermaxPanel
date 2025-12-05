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

const ProductViewModal = ({ isOpen, setIsOpen, product }: ProductViewModalProps) => {
  const [editOpen, setEditOpen] = useState(false);

  if (!product) return null;

  return (
    <>
      <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="View Product">
        <div className="flex flex-col gap-2">
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Category:</strong> {product.category?.name || "N/A"}</p>
          <p><strong>Price:</strong> ${product.finalPrice ?? 0}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Weight:</strong> {product.weight}</p>
          <p>
            <strong>Dimensions:</strong>{" "}
            {product.dimensions
              ? `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}`
              : "N/A"}
          </p>
          <p><strong>Tags:</strong> {(product.tags ?? []).join(", ")}</p>
          <p><strong>Featured:</strong> {product.isFeatured ? "Yes" : "No"}</p>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => { setIsOpen(false);setEditOpen(true);}} // ✅ just open edit modal
            >
              Edit
            </Button>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
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

export default ProductViewModal;
