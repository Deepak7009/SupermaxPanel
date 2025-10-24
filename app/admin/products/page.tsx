"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/thunks/productThunks";
import { fetchCategories } from "@/redux/thunks/categoryThunks";
import ProductModal from "@/components/modals/ProductModal";
import CategoryModal from "@/components/modals/CategoryModal";
import { Product } from "@/redux/slices/productSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import Table, { Column } from "@/components/common/Table";

// type Product = {
//   _id: string;
//   name: string;
//   category?: { _id: string; name: string };
//   finalPrice: number;
//   stock: number;
// };

type SortConfig = {
  key: keyof Product;
  direction: "asc" | "desc";
};

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
  const { categories } = useSelector((state: RootState) => state.category);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter products
  let filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? p.category?._id === categoryFilter
      : true;
    return matchesName && matchesCategory;
  });

  // Sorting
  if (sortConfig) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const aValue =
        sortConfig.key === "category"
          ? a.category?.name || ""
          : a[sortConfig.key];
      const bValue =
        sortConfig.key === "category"
          ? b.category?.name || ""
          : b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: keyof Product) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: Column<Product>[] = [
    { key: "_id", label: "#" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "finalPrice", label: "Price" },
    { key: "stock", label: "Stock" },
  ];

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* Filters and Actions */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] placeholder-[var(--muted-foreground)]"
          />
          <select
            className="border p-2 rounded bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <Button
            className="bg-[var(--primary)] hover:bg-[var(--primary-foreground)]"
            onClick={() => setAddProductOpen(true)}
          >
            Add Product
          </Button>
          <Button
            className="bg-[var(--primary)] hover:bg-[var(--secondary-hover)]"
            onClick={() => setAddCategoryOpen(true)}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ProductModal isOpen={addProductOpen} setIsOpen={setAddProductOpen} />
      <CategoryModal isOpen={addCategoryOpen} setIsOpen={setAddCategoryOpen} />

      {/* Table */}
      <Table
        columns={columns}
        data={displayedProducts}
        onSort={handleSort}
        sortConfig={sortConfig}
        renderCell={(product, key, index) => {
          switch (key) {
            case "_id":
              return index + 1 + (currentPage - 1) * itemsPerPage;
            case "category":
              return product.category?.name || "N/A";
            case "finalPrice":
              return `${product.finalPrice}$`;
            default:
              const value = product[key];
              if (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
              ) {
                return value;
              }
              return "";
          }
        }}
      />

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    currentPage === i + 1
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : ""
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ProductsPage;
