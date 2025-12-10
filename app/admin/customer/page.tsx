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
import { Eye } from "lucide-react";
import { Customer } from "@/redux/types/customer";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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
    { key: "email", label: "Email" },
    { key: "orders", label: "Orders" },
    { key: "actions" as keyof Customer, label: "Actions" }, // type assertion
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
        <div className="flex flex-col items-center mt-0 gap-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} | Total Customers: {total}
          </span>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => dispatch(setPage(Math.max(page - 1, 1)))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => dispatch(setPage(i + 1))}
                    className={
                      page === i + 1
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
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
                    dispatch(setPage(Math.min(page + 1, totalPages)))
                  }
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
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
