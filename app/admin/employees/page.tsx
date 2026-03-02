"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchEmployees } from "@/redux/thunks/employeeThunk";
import { Employee } from "@/redux/types/employee";

import Table, { Column } from "@/components/common/Table";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import AddEmployeeModal from "@/components/modals/AddEmployeeModal";

const EmployeesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { employees, total, page, limit } = useSelector(
    (state: RootState) => state.employee,
  );

  const [search, setSearch] = useState("");
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    dispatch(fetchEmployees({ search, page, limit }));
  }, [search, page, limit, dispatch]);

  const columns: Column<Employee>[] = [
    { key: "_id", label: "#" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "advancePayment", label: "Advance" },
    { key: "paidPayment", label: "Paid" },
    { key: "actions" as keyof Employee, label: "Actions" },
  ];

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Employees</h1>
      </div>

      {/* Search Section */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddEmployeeOpen(true)}>Add Employee</Button>
      </div>

      {/* Table Section */}
      <Card className="p-4 rounded-xl">
        <Table<Employee>
          columns={columns}
          data={employees}
          renderCell={(employee, key, index) => {
            switch (key) {
              case "_id":
                return <span>{index + 1 + (page - 1) * limit}</span>;
              case "actions":
                return (
                  <Button
                    onClick={() =>
                      router.push(`/admin/employees/${employee._id}`)
                    }
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                );
              default:
                return employee[key] ? String(employee[key]) : "";
            }
          }}
        />

        {employees.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No employees found
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={(p) =>
            dispatch({ type: "employee/setPage", payload: p })
          }
        />
      </Card>

      {/* Modal */}
      <AddEmployeeModal
        isOpen={addEmployeeOpen}
        setIsOpen={setAddEmployeeOpen}
      />
    </div>
  );
};

export default EmployeesPage;
