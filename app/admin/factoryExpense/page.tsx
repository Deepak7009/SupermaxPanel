"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchFactoryExpenses } from "@/redux/thunks/factoryExpenseThunks";
import { setPage } from "@/redux/slices/factoryExpenseSlice";
import { useRouter } from "next/navigation";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Table, { Column } from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

import AddFactoryExpenseModal from "@/components/modals/AddFactoryExpenseModal";
import { FactoryExpense } from "@/redux/types/factoryExpense";

type ExpenseTableRow = FactoryExpense & { actions: string };
type ExpenseStatus = "pending" | "approved" | "rejected";

// Month options
const months = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
  value: String(i + 1),
}));

const FactoryExpensePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { expenses, page, total, limit, loading } = useSelector(
    (state: RootState) => state.factoryExpense
  );

  const totalPages = Math.ceil(total / limit);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ExpenseStatus>("all");
  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [addOpen, setAddOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ExpenseTableRow;
    direction: "asc" | "desc";
  } | null>(null);

  // Fetch expenses from backend
  useEffect(() => {
    dispatch(
      fetchFactoryExpenses({
        page,
        limit,
        search,
        status: status === "all" ? undefined : status,
        month,
        year,
      })
    );
  }, [dispatch, page, limit, search, status, month, year]);

  const handleSort = (key: keyof ExpenseTableRow) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  // Calculate totals for current page
  const totalPaidAmount = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPendingAmount = expenses
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalMonthExpense = totalPaidAmount + totalPendingAmount;

  // Status filter options
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  // Year filter options (last 10 years)
  const years = Array.from({ length: 10 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: String(y), value: String(y) };
  });

  const columns: Column<ExpenseTableRow>[] = [
    { key: "_id", label: "#" },
    { key: "name", label: "Expense Name" },
    { key: "amount", label: "Amount" },
    { key: "quantity", label: "Quantity" },
    { key: "shopName", label: "Shop" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const displayedExpenses: ExpenseTableRow[] = expenses.map((e) => ({
    ...e,
    actions: "view",
  }));

  const statusColors: Record<ExpenseStatus, string> = {
    pending:
      "bg-[color:var(--color-status-pending-bg)] text-[color:var(--color-status-pending-text)] border-[color:var(--color-status-pending-border)]",
    approved:
      "bg-[color:var(--color-status-delivered-bg)] text-[color:var(--color-status-delivered-text)] border-[color:var(--color-status-delivered-border)]",
    rejected:
      "bg-[color:var(--color-status-cancelled-bg)] text-[color:var(--color-status-cancelled-text)] border-[color:var(--color-status-cancelled-border)]",
  };

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Factory Expenses</h1>
      </div>

      <AddFactoryExpenseModal isOpen={addOpen} setIsOpen={setAddOpen} />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Search expense..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            dispatch(setPage(1));
          }}
        />
        <Select
          value={status}
          onChange={(value) => setStatus(value as "all" | ExpenseStatus)}
          options={statusOptions}
          placeholder="Select status"
        />
        <Select
          value={month}
          onChange={(value) => setMonth(value)}
          options={months}
          placeholder="Select month"
        />
        <Select
          value={year}
          onChange={(value) => setYear(value)}
          options={years}
          placeholder="Select year"
        />
        <Button onClick={() => setAddOpen(true)}>Add Factory Expense</Button>
      </div>

      {/* Totals cards */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Card className="p-4 flex-1">
          <h2 className="text-sm text-gray-500">Total Paid Amount</h2>
          <p className="text-xl font-bold">₹ {totalPaidAmount}</p>
        </Card>
        <Card className="p-4 flex-1">
          <h2 className="text-sm text-gray-500">Total Pending Amount</h2>
          <p className="text-xl font-bold">₹ {totalPendingAmount}</p>
        </Card>
        <Card className="p-4 flex-1">
          <h2 className="text-sm text-gray-500">Total Month Expense</h2>
          <p className="text-xl font-bold">₹ {totalMonthExpense}</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-4 rounded-xl">
        <Table<ExpenseTableRow>
          columns={columns}
          data={displayedExpenses}
          loading={loading}
          onSort={handleSort}
          sortConfig={sortConfig}
          renderCell={(expense, key, index) => {
            switch (key) {
              case "_id":
                return index + 1 + (page - 1) * limit;
              case "amount":
                return `₹ ${expense.amount}`;
              case "status":
                return (
                  <span
                    className={`px-2 py-1 rounded-md border text-sm capitalize ${
                      statusColors[expense.status]
                    }`}
                  >
                    {expense.status}
                  </span>
                );
              case "actions":
                return (
                  <Button
                    onClick={() =>
                      router.push(`/admin/factoryExpense/${expense._id}`)
                    }
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                );
              default:
                return expense[key] ? String(expense[key]) : "";
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

export default FactoryExpensePage;