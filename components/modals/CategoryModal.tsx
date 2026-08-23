"use client";

import { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";

import { createCategory, updateCategory, fetchCategories } from "@/redux/thunks/categoryThunks";

import { Category } from "@/redux/types/category";

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

  // Ensure all categories are loaded for the parent dropdown
  useEffect(() => {
    dispatch(fetchCategories({ limit: 500 }));
  }, [dispatch]);

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
  }, [category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parentCategory = parent
      ? categories.find((c) => c._id === parent)
      : null;

    const payload = {
      name,
      // Recompute slug from current name on every save
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      // The API accepts either a plain ObjectId string or {_id,name}.
      // We cast here to satisfy the Category type while sending only the id.
      parent: (parentCategory ? parentCategory._id : null) as Category["parent"],
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

        <Button type="submit" className="bg-[var(--btn-success-bg)] hover:bg-[var(--btn-success-hover-bg)]">
          {category ? "Update Category" : "Save Category"}
        </Button>
      </form>
    </DialogModal>
  );
};

export default CategoryModal;
