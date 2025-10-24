"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { ProductModal, CategoryModal } from "@/components/Modal";
import { fetchProducts } from "@/redux/thunks/productThunks";
import { fetchCategories } from "@/redux/thunks/categoryThunks";

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setAddProductOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
        <button
          onClick={() => setAddCategoryOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Category
        </button>
      </div>

      <ProductModal isOpen={addProductOpen} setIsOpen={setAddProductOpen} />
      <CategoryModal isOpen={addCategoryOpen} setIsOpen={setAddCategoryOpen} />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Stock</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={product._id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.category?.name || "N/A"}</td>
                <td className="px-4 py-2">{product.finalPrice + "$"}</td>
                <td className="px-4 py-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
