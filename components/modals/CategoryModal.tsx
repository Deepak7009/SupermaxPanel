"use client";

import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createCategory } from "@/redux/thunks/categoryThunks";
import DialogModal from "@/components/common/DialogModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

    setIsOpen(false);
  };

  return (
    <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Category">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select onValueChange={setParent} value={parent}>
          <SelectTrigger>
            <SelectValue placeholder="Select Parent Category (optional)" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(Boolean(checked))} />
          Active
        </div>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Save Category
        </Button>
      </form>
    </DialogModal>
  );
};

export default CategoryModal;
