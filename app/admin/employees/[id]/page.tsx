"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

import { fetchEmployeeById } from "@/redux/thunks/employeeThunk";
import { fetchWorkEntries } from "@/redux/thunks/workThunk";

import { Card } from "@/components/ui/card";
import Table, { Column } from "@/components/common/Table";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";

import { Phone, Mail, Briefcase, Eye } from "lucide-react";
import AddWorkEntryModal from "@/components/modals/AddWorkEntryModal";
import { WorkEntry } from "@/redux/types/work";

const PAGE_SIZE = 5;

const EmployeeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentEmployee,
    loading: empLoading,
    error: empError,
  } = useSelector((state: RootState) => state.employee);
  const {
    entries,
    total,
    loading: workLoading,
    error: workError,
    page,
  } = useSelector((state: RootState) => state.work);

  const [search, setSearch] = useState("");
  const [addWorkOpen, setAddWorkOpen] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!id) return;
    dispatch(fetchEmployeeById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchWorkEntries({ employeeId: id, page, limit: PAGE_SIZE }));
  }, [id, dispatch, page]);

  if (empLoading || workLoading) return <div className="p-6">Loading...</div>;
  if (empError) return <div className="p-6 text-red-500">{empError}</div>;
  if (!currentEmployee) return <div className="p-6">Employee not found</div>;
  if (workError) return <div className="p-6 text-red-500">{workError}</div>;

  const columns: Column<WorkEntry>[] = [
    { key: "date", label: "Date" },
    { key: "quantity", label: "Quantity" },
    { key: "amount", label: "Amount" },
    { key: "actions" as keyof WorkEntry, label: "View" },
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* LEFT PROFILE */}
      <Card className="p-5 rounded-xl">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
            {currentEmployee.name[0]}
          </div>
          <h2 className="text-lg font-semibold">{currentEmployee.name}</h2>

          <div className="text-sm flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {currentEmployee.phone}
          </div>

          {currentEmployee.email && (
            <div className="text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {currentEmployee.email}
            </div>
          )}

          <div className="w-full mt-4 flex justify-between text-sm">
            <span>Total Work Entries</span>
            <span className="font-semibold">{total}</span>
          </div>

          <div className="w-full flex justify-between text-sm">
            <span>Advance</span>
            <span className="font-semibold">
              ₹ {currentEmployee.advancePayment ?? 0}
            </span>
          </div>

          <div className="w-full flex justify-between text-sm">
            <span>Joined</span>
            <span>
              {new Date(currentEmployee.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {/* WORK ENTRIES */}
      <Card className="lg:col-span-3 p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Work Entries</h3>
          </div>

          <Button onClick={() => setAddWorkOpen(true)}>Add Work Entry</Button>
        </div>

        <Input
          placeholder="Search work entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs mb-4"
        />

        <Table
          columns={columns}
          data={entries.filter(
            (e) =>
              e.date.toLowerCase().includes(search.toLowerCase()) ||
              String(e.amount ?? "").includes(search),
          )}
          renderCell={(entry, key) => {
            switch (key) {
              case "date":
                return new Date(entry.date).toLocaleDateString();
              case "amount":
                return `₹${entry.amount ?? 0}`;
              case "actions":
                return (
                  <Button className="p-2">
                    <Eye className="w-4 h-4" />
                  </Button>
                );
              default:
                return String(entry[key] ?? "");
            }
          }}
        />

        {entries.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No work entries found
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / PAGE_SIZE)}
          totalItems={total}
          onPageChange={(p) => dispatch({ type: "work/setPage", payload: p })}
        />
      </Card>

      {/* ADD WORK ENTRY MODAL */}
      <AddWorkEntryModal
        isOpen={addWorkOpen}
        setIsOpen={setAddWorkOpen}
        employee={currentEmployee}
      />
    </div>
  );
};

export default EmployeeDetailPage;
