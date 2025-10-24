import React, { ReactNode } from "react";
import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export type Column<T> = {
  key: keyof T;
  label: string;
};

interface TableProps<T extends { _id: string }> {
  columns: Column<T>[];
  data: T[];
  renderCell?: (item: T, key: keyof T, index: number) => ReactNode;
  onSort?: (key: keyof T) => void;
  sortConfig?: { key: keyof T; direction: "asc" | "desc" } | null;
}

const Table = <T extends { _id: string }>({
  columns,
  data,
  renderCell,
  onSort,
  sortConfig,
}: TableProps<T>) => {
  const getSortSymbol = (key: keyof T) => {
    if (sortConfig?.key === key) return sortConfig.direction === "asc" ? "▲" : "▼";
    return "";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <ShadcnTable className="min-w-full divide-y divide-[var(--border)]">
        <TableHeader className="bg-[var(--card)]">
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => onSort?.(col.key)}
              >
                {col.label} {getSortSymbol(col.key)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-[var(--border)]">
          {data.map((item, index) => (
            <TableRow
              key={item._id}
              className={`hover:bg-[var(--muted)] ${
                index % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--popover)]"
              }`}
            >
              {columns.map((col) => {
                const value = item[col.key];
                return (
                  <TableCell key={String(col.key)} className="px-4 py-2">
                    {renderCell
                      ? renderCell(item, col.key, index)
                      : typeof value === "string" ||
                        typeof value === "number" ||
                        typeof value === "boolean"
                      ? value
                      : null}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};

export default Table;
