"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCustomersThunk } from "@/redux/thunks/customerThunks";
import { setPage } from "@/redux/slices/customerSlice";

import Table, { Column } from "@/components/common/Table";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Card } from "@/components/ui/card";
import { Eye, Mail, Phone } from "lucide-react";
import { Customer } from "@/redux/types/customer";
import Pagination from "@/components/common/Pagination";

type SortConfig = {
  key: keyof Customer;
  direction: "asc" | "desc";
};

const CustomerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, total, page, limit } = useSelector(
    (state: RootState) => state.customers
  );

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    dispatch(
      fetchCustomersThunk({
        search,
        page,
        limit,
        sortKey: sortConfig?.key,
        sortDirection: sortConfig?.direction,
      })
    );
  }, [search, page, limit, sortConfig, dispatch]);

  const handleSort = (key: keyof Customer) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const columns: Column<Customer>[] = [
    { key: "_id", label: "#" },
    { key: "name", label: "Name" },
    { key: "email", label: "Contact" }, // Email + Phone
    { key: "orders", label: "Orders" },
    { key: "actions" as keyof Customer, label: "Actions" },
  ];

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-xl font-semibold">Customers</h1>

      {/* Search */}
      <div className="w-72 mb-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="p-4 rounded-xl">
        {/* Table */}
        <Table
          columns={columns}
          data={customers}
          renderCell={(customer, key, index) => {
            switch (key) {
              case "_id":
                return index + 1 + (page - 1) * limit;

              case "email":
                return (
                  <div className="flex flex-col gap-1">
                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span>{customer.email}</span>
                    </div>

                    {/* Phone */}
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>
                );

              case "orders":
                return customer.orders.length;

              case "actions":
                return (
                  <Button
                    onClick={() => {
                      setSelected(customer);
                      setModalOpen(true);
                    }}
                    className="px-2 py-1"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                );

              default:
                return customer[key] ?? "";
            }
          }}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={(p) => {
            setCurrentPage(p);
            dispatch(setPage(p));
          }}
        />
      </Card>

      {/* Customer Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>

            <p>
              <b>Name:</b> {selected.name}
            </p>
            <p>
              <b>Email:</b> {selected.email}
            </p>
            <p>
              <b>Phone:</b> {selected.phone || "N/A"}
            </p>
            <p>
              <b>Total Orders:</b> {selected.orders.length}
            </p>

            <div className="mt-4 text-right">
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
