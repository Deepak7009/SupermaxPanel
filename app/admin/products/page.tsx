"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/thunks/productThunks";
import { fetchCategories } from "@/redux/thunks/categoryThunks";
import ProductModal from "@/components/modals/ProductModal";
import CategoryModal from "@/components/modals/CategoryModal";
import { Product } from "@/redux/slices/productSlice";
import { Card } from "@/components/ui/card";
import Table, { Column } from "@/components/common/Table";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import { EyeIcon } from "lucide-react";
import ProductViewModal from "@/components/modals/ProductViewModal";
import Pagination from "@/components/common/Pagination";

type SortConfig = {
  key: keyof Product;
  direction: "asc" | "desc";
};

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, total, page, limit } = useSelector(
    (state: RootState) => state.product
  );
  const { categories } = useSelector((state: RootState) => state.category);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Fetch data from backend
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        category: categoryFilter || undefined,
        page: currentPage,
        limit: limit,
      })
    );
  }, [dispatch, search, categoryFilter, currentPage, limit]);

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

  const columns: Column<Product>[] = [
    { key: "_id", label: "#" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "finalPrice", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "actions" as keyof Product, label: "Actions" }, // ✅ type assertion
  ];

  const handleView = (product: Product) => {
    setViewProduct(product);
    setIsOpenModal(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Produts</h1>
      </div>
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
              ...categories.map((cat) => ({ label: cat.name, value: cat._id })),
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
      <ProductViewModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        product={viewProduct}
      />
      <Card className="p-4 rounded-xl">
        {/* Table */}
        <Table
          columns={columns}
          data={products}
          onSort={handleSort}
          sortConfig={sortConfig}
          renderCell={(product, key, index) => {
            switch (key) {
              case "_id":
                return (
                  <span className="font-medium">
                    {index + 1 + (currentPage - 1) * limit}
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
                const value = product[key] ?? "";
                return typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                  ? value
                  : "";
            }
          }}
        />

        {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            onPageChange={(page) => setCurrentPage(page)}
          />
      </Card>
    </div>
  );
};

export default ProductsPage;
