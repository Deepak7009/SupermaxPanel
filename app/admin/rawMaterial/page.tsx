"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchRawMaterials } from "@/redux/thunks/rawMaterialThunks";
import { setPage } from "@/redux/slices/rawMaterialSlice";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Table, { Column } from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

import { RawMaterial } from "@/redux/types/rawMaterial";
import AddRawMaterialModal from "@/components/modals/AddRawMaterialModal";
import RawMaterialViewModal from "@/components/modals/RawMaterialViewModal";

type MaterialRow = RawMaterial & { actions: string };
type MaterialStatus = "pending" | "paid";

// Month options
const months = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
  value: String(i + 1),
}));

const RawMaterialPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { materials, page, total, limit, loading, totalAmount, pendingAmount, paidAmount } = useSelector(
    (state: RootState) => state.rawMaterial,
  );

  const totalPages = Math.ceil(total / limit);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | MaterialStatus>("all");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false); // ✅ ADD THIS
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(
    null,
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof MaterialRow;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    dispatch(
      fetchRawMaterials({
        page,
        limit,
        search,
        status: status === "all" ? undefined : status,
        month,
        year,
      }),
    );
  }, [dispatch, page, limit, search, status, month, year]);

  const handleSort = (key: keyof MaterialRow) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: String(y), value: String(y) };
  });

  const columns: Column<MaterialRow>[] = [
    { key: "_id", label: "#" },
    { key: "materialName", label: "Material Name" },
    { key: "shopName", label: "Shop Name" },
    { key: "buyerName", label: "Buyer Name" },
    { key: "quantity", label: "Quantity" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const displayedMaterials: MaterialRow[] = materials.map((m) => ({
    ...m,
    actions: "view",
  }));

  const statusColors: Record<MaterialStatus, string> = {
    pending:
      "bg-[color:var(--color-status-pending-bg)] text-[color:var(--color-status-pending-text)] border-[color:var(--color-status-pending-border)]",
    paid: "bg-[color:var(--color-status-delivered-bg)] text-[color:var(--color-status-delivered-text)] border-[color:var(--color-status-delivered-border)]",
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Raw Materials</h1>
      </div>

      <AddRawMaterialModal isOpen={addOpen} setIsOpen={setAddOpen} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="Search material..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            dispatch(setPage(1));
          }}
        />

        <Select
          value={status}
          onChange={(value) => setStatus(value as "all" | MaterialStatus)}
          options={statusOptions}
          placeholder="Select status"
        />

        <Select
          value={String(month)}
          onChange={(value) => setMonth(Number(value))}
          options={months}
          placeholder="Select month"
        />

        <Select
          value={String(year)}
          onChange={(value) => setYear(Number(value))}
          options={years}
          placeholder="Select year"
        />

        <Button onClick={() => setAddOpen(true)}>Add Raw Material</Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Card className="p-4">
          <h2 className="text-sm text-[var(--muted-foreground)]">Total Paid Amount</h2>
          <p className="text-xl font-bold">₹ {paidAmount}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-sm text-[var(--muted-foreground)]">Total Pending Amount</h2>
          <p className="text-xl font-bold">₹ {pendingAmount}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-sm text-[var(--muted-foreground)]">Total Month Expense</h2>
          <p className="text-xl font-bold">₹ {totalAmount}</p>
        </Card>
      </div>

      {/* Table */}

      <Card className="p-4 rounded-xl">
        <Table<MaterialRow>
          columns={columns}
          data={displayedMaterials}
          loading={loading}
          onSort={handleSort}
          sortConfig={sortConfig}
          renderCell={(material, key, index) => {
            switch (key) {
              case "_id":
                return index + 1 + (page - 1) * limit;

              case "amount":
                return `₹ ${material.amount}`;

              case "status":
                return (
                  <span
                    className={`px-2 py-1 rounded-md border text-sm capitalize ${
                      statusColors[material.status]
                    }`}
                  >
                    {material.status}
                  </span>
                );

              case "actions":
                return (
                  <Button
                    onClick={() => {
                      setSelectedMaterial(material);
                      setViewOpen(true);
                    }}
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                );

              default:
                return material[key] ? String(material[key]) : "";
            }
          }}
        />
        <RawMaterialViewModal
          isOpen={viewOpen}
          setIsOpen={setViewOpen}
          material={selectedMaterial}
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

export default RawMaterialPage;
