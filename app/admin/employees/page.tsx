"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchEmployees } from "@/redux/thunks/employeeThunk";
import Table, { Column } from "@/components/common/Table";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Employee } from "@/redux/types/employee";
import AddEmployeeModal from "@/components/modals/AddEmployeeModal";

const EmployeesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { employees, total, page, limit } = useSelector(
    (state: RootState) => state.employee
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
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Employees</h1>

      {/* Add Employee Button */}
      <div className="flex gap-3 mb-4">
        <Button onClick={() => setAddEmployeeOpen(true)}>Add Employee</Button>
      </div>

      {/* Search */}
      <Input
        className="w-72"
        placeholder="Search by name or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Employee Table */}
      <Card className="p-4 rounded-xl">
        <Table
          columns={columns}
          data={employees}
          renderCell={(employee, key, index) => {
            switch (key) {
              case "_id":
                return index + 1 + (page - 1) * limit;
              case "actions":
                return (
                  <Button
                    onClick={() =>
                      router.push(`/admin/employees/${employee._id}`)
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                );
              default:
                return String(employee[key] ?? "");
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

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={addEmployeeOpen}
        setIsOpen={setAddEmployeeOpen}
      />
    </div>
  );
};

export default EmployeesPage;
