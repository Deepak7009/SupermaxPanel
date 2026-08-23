"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";

import { fetchCategories } from "@/redux/thunks/categoryThunks";
import { Category } from "@/redux/types/category";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Table, { Column } from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import CategoryModal from "@/components/modals/CategoryModal";

import { Card } from "@/components/ui/card";
import { EyeIcon } from "lucide-react";
import CategoryViewModal from "@/components/modals/CategoryViewModal";

const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { categories, total, limit } = useSelector(
    (state: RootState) => state.category,
  );

  const [search, setSearch] = useState("");
  const [parentFilter, setParentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [parentOptions, setParentOptions] = useState<{ label: string; value: string }[]>([]);

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Load root-level categories once for the parent filter dropdown
  useEffect(() => {
    dispatch(fetchCategories({ parent: "root", limit: 500 })).then((action) => {
      if (fetchCategories.fulfilled.match(action)) {
        setParentOptions(
          action.payload.categories.map((c) => ({ label: c.name, value: c._id })),
        );
      }
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchCategories({
        search,
        parent: parentFilter || undefined,
        page: currentPage,
        limit: 10,
      }),
    );
  }, [dispatch, search, parentFilter, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, parentFilter]);

  const columns: Column<Category>[] = [
    {
      key: "_id",
      label: "#",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "parent",
      label: "Parent",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "actions" as keyof Category,
      label: "Actions",
    },
  ];

  const totalPages = Math.ceil(total / limit);
  const handleView = (category: Category) => {
    setViewCategory(category);
    setViewOpen(true);
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Categories</h1>
      </div>
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-4">
        <Input
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={parentFilter || "all"}
          onChange={(value) => setParentFilter(value === "all" ? "" : value)}
          options={[
            { label: "All Categories", value: "all" },
            { label: "Root (no parent)", value: "root" },
            ...parentOptions,
          ]}
        />
        <div className="sm:ml-auto">
          <Button onClick={() => setAddCategoryOpen(true)}>Add Category</Button>
        </div>
      </div>

      <CategoryModal isOpen={addCategoryOpen} setIsOpen={setAddCategoryOpen} />

      <CategoryViewModal
        isOpen={viewOpen}
        setIsOpen={setViewOpen}
        category={viewCategory}
      />

      <Card className="p-4 rounded-xl">
        <Table
          columns={columns}
          data={categories}
          renderCell={(category, key, index) => {
            switch (key) {
              case "_id":
                return <span>{index + 1 + (currentPage - 1) * limit}</span>;

              case "parent":
                return category.parent?.name || "-";

              case "description":
                return category.description || "-";

              case "actions":
                return (
                  <div className="flex gap-2">
                    <Button onClick={() => handleView(category)}>
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </div>
                );

              default:
                const value = category[key as keyof Category];

                return typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                  ? value
                  : "";
            }
          }}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};

export default CategoriesPage;
