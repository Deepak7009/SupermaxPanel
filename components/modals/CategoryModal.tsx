"use client";

import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";

import { createCategory, updateCategory } from "@/redux/thunks/categoryThunks";

import { Category } from "@/redux/slices/categorySlice";

import DialogModal from "@/components/common/DialogModal";
import Select from "@/components/common/Select";
import { Checkbox } from "@/components/ui/checkbox";
import FloatingInput from "../common/FloatingInput";
import { Textarea } from "../ui/textarea";
import Button from "../common/Button";

interface CategoryModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  category?: Category | null;
}

const CategoryModal = ({ isOpen, setIsOpen, category }: CategoryModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { categories } = useSelector((state: RootState) => state.category);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setParent(category.parent?._id || "");
      setIsActive(category.isActive);
    } else {
      setName("");
      setDescription("");
      setParent("");
      setIsActive(true);
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parentCategory = parent
      ? categories.find((c) => c._id === parent)
      : null;

    const payload = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      parent: parentCategory
        ? {
            _id: parentCategory._id,
            name: parentCategory.name,
          }
        : null,
      isActive,
    };

    if (category?._id) {
      await dispatch(
        updateCategory({
          id: category._id,
          data: payload,
        }),
      );
    } else {
      await dispatch(createCategory(payload));
    }

    setName("");
    setDescription("");
    setParent("");
    setIsActive(true);

    setIsOpen(false);
  };

  const parentOptions = categories
    .filter((cat) => cat._id !== category?._id)
    .map((cat) => ({
      label: cat.name,
      value: cat._id,
    }));

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={category ? "Edit Category" : "Add Category"}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FloatingInput
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />

        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          value={parent}
          onChange={setParent}
          options={parentOptions}
          placeholder="Select Parent Category (optional)"
          className="w-full"
        />

        <div className="flex items-center gap-2">
          <Checkbox
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(Boolean(checked))}
          />
          <span>Active</span>
        </div>

        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          {category ? "Update Category" : "Save Category"}
        </Button>
      </form>
    </DialogModal>
  );
};

export default CategoryModal;
