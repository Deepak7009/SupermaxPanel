"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/thunks/productThunks";
import { fetchCategories } from "@/redux/thunks/categoryThunks";
import ProductModal from "@/components/modals/ProductModal";
import CategoryModal from "@/components/modals/CategoryModal";
import { Product } from "@/redux/slices/productSlice";

import Table, { Column } from "@/components/common/Table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import { EyeIcon } from "lucide-react"; // ✅ optional icon
import ProductViewModal from "@/components/modals/ProductViewModal";

type SortConfig = {
  key: keyof Product;
  direction: "asc" | "desc";
};

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
  const { categories } = useSelector((state: RootState) => state.category);
  console.log("products ", products);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null); // ✅ view modal state
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
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
    { key: "actions", label: "Actions" }, // ✅ added actions column
  ];

  const handleView = (product: Product) => {
    setViewProduct(product);
    setIsOpenModal(true);
  };

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)]">
      {/* Filters and Actions */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={categoryFilter || "all"}
            onChange={(value) =>
              setCategoryFilter(value === "all" ? "" : value)
            }
            options={[
              { label: "All Categories", value: "all" },
              ...categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              })),
            ]}
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setAddProductOpen(true)}>Add Product</Button>
          <Button onClick={() => setAddCategoryOpen(true)}>Add Category</Button>
        </div>
      </div>

      {/* Modals */}
      <ProductModal isOpen={addProductOpen} setIsOpen={setAddProductOpen} />
      <CategoryModal isOpen={addCategoryOpen} setIsOpen={setAddCategoryOpen} />
      {/* {viewProduct && (
        <ProductViewModal
          isOpen={!!viewProduct}
          setIsOpen={() => setViewProduct(null)}
          product={viewProduct}
        />
      )} */}
      <ProductViewModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        product={viewProduct}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={displayedProducts}
        onSort={handleSort}
        sortConfig={sortConfig}
        renderCell={(product, key, index) => {
          switch (key) {
            case "_id":
              return (
                <span className="font-medium">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </span>
              );
            case "category":
              return product.category?.name || "N/A";
            case "finalPrice":
              return (
                <span className="font-semibold">${product.finalPrice}</span>
              );
            case "stock":
              return (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    product.stock > 10
                      ? "bg-success text-success-foreground"
                      : product.stock > 0
                      ? "bg-warning text-warning-foreground"
                      : "bg-error text-error-foreground"
                  }`}
                >
                  {product.stock} units
                </span>
              );
            case "actions":
              return (
                <div className="flex gap-2">
                  <Button onClick={() => handleView(product)}>
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                </div>
              );
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
                className={`
                  ${
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] cursor-pointer"
                  }
                `}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  className={`
                    ${
                      currentPage === i + 1
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
                        : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                    }
                  `}
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
                className={`
                  ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] cursor-pointer"
                  }
                `}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ProductsPage;
