"use client";

import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createCategory } from "@/redux/thunks/categoryThunks";
import DialogModal from "@/components/common/DialogModal";
import Select from "@/components/common/Select";
import { Checkbox } from "@/components/ui/checkbox";
import FloatingInput from "../common/FloatingInput";
import { Textarea } from "../ui/textarea";
import Button from "../common/Button";

interface CategoryModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CategoryModal = ({ isOpen, setIsOpen }: CategoryModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parentCategory = parent ? categories.find((c) => c._id === parent) : null;

    await dispatch(
      createCategory({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description,
        parent: parentCategory ? { _id: parentCategory._id, name: parentCategory.name } : null,
        isActive,
      })
    );

    // Reset form
    setName("");
    setDescription("");
    setParent("");
    setIsActive(true);

    setIsOpen(false);
  };

  const parentOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  return (
    <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Category">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Name */}
        <FloatingInput
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />

        {/* Description */}
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Parent Category */}
        <Select
          value={parent}
          onChange={setParent}
          options={parentOptions}
          placeholder="Select Parent Category (optional)"
          className="w-full"
        />

        {/* Active Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(Boolean(checked))}
          />
          <span>Active</span>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Save Category
        </Button>
      </form>
    </DialogModal>
  );
};

export default CategoryModal;
