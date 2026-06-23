"use client";

import { useState } from "react";

import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";

import { Category } from "@/redux/slices/categorySlice";
import CategoryModal from "./CategoryModal";

interface CategoryViewModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  category: Category | null;
}

const CategoryViewModal = ({
  isOpen,
  setIsOpen,
  category,
}: CategoryViewModalProps) => {
  const [editOpen, setEditOpen] = useState(false);

  if (!category) return null;

  return (
    <>
      <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="View Category">
        <div className="grid grid-cols-2 gap-4 p-2">
          <Info label="Name" value={category.name || "N/A"} />
          <Info label="Slug" value={category.slug || "N/A"} />
          <Info label="Parent" value={category.parent?.name || "N/A"} />
          <Info
            label="Status"
            value={category.isActive ? "Active" : "Inactive"}
          />
          <Info
            label="Description"
            value={category.description || "N/A"}
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

      <CategoryModal
        isOpen={editOpen}
        setIsOpen={setEditOpen}
        category={category}
      />
    </>
  );
};

interface InfoProps {
  label: string;
  value: string;
  colSpan?: number;
}

const Info = ({ label, value, colSpan = 1 }: InfoProps) => (
  <div className={colSpan === 2 ? "col-span-2" : ""}>
    <span className="text-muted-foreground font-semibold text-sm">{label}</span>
    <p>{value}</p>
  </div>
);

export default CategoryViewModal;
