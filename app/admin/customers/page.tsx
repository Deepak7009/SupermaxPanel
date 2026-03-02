"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCustomersThunk } from "@/redux/thunks/customerThunks";
import { setPage } from "@/redux/slices/customerSlice";

import Table, { Column } from "@/components/common/Table";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Eye, Mail, Phone } from "lucide-react";
import { CustomerList } from "@/redux/types/customer";

type SortConfig = {
  key: keyof CustomerList;
  direction: "asc" | "desc";
};

const CustomerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { customers, total, page, limit } = useSelector(
    (state: RootState) => state.customers
  );

  const [search, setSearch] = useState("");
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

  const columns: Column<CustomerList>[] = [
    { key: "_id", label: "#" },
    { key: "name", label: "Name" },
    { key: "email", label: "Contact" },
    { key: "orders", label: "Orders" },
    { key: "actions" as keyof CustomerList, label: "Actions" },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Customers</h1>

      <Input
        className="w-72"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Card className="p-4 rounded-xl">
        <Table
          columns={columns}
          data={customers}
          renderCell={(customer, key, index) => {
            switch (key) {
              case "_id":
                return index + 1 + (page - 1) * limit;

              case "email":
                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      {customer.phone}
                    </div>
                  </div>
                );

              case "orders":
                return customer.orders.length;

              case "actions":
                return (
                  <Button
                    onClick={() =>
                      router.push(`/admin/customers/${customer._id}`)
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                );

              default:
                return customer[key];
            }
          }}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      </Card>
    </div>
  );
};

export default CustomerPage;
