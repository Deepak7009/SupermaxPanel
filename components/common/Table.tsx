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
  loading?: boolean;
}

const Table = <T extends { _id: string }>({
  columns,
  data,
  renderCell,
  onSort,
  sortConfig,
  loading,
}: TableProps<T>) => {
  const getSortSymbol = (key: keyof T) => {
    if (sortConfig?.key === key)
      return sortConfig.direction === "asc" ? "▲" : "▼";
    return "";
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-sm">
      <ShadcnTable className="min-w-full divide-y divide-[var(--border)]">
        {/* Table Header */}
        <TableHeader>
          <TableRow className="bg-[var(--table-header-bg)] rounded-t-xl shadow-md">
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className="px-4 py-3 text-left text-[var(--table-header-text)] font-bold uppercase cursor-pointer select-none hover:bg-[var(--table-header-text)/10] transition-colors"
                onClick={() => onSort?.(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  <span className="text-sm">{getSortSymbol(col.key)}</span>
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody className="divide-y divide-[var(--border)]">
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-6 text-[var(--muted-foreground)]"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-6 text-[var(--muted-foreground)]"
              >
                No data found
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item._id}
                className={`transition-colors hover:bg-[var(--muted)] ${
                  index % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--popover)]"
                }`}
              >
                {columns.map((col) => {
                  const value = item[col.key];
                  return (
                    <TableCell
                      key={String(col.key)}
                      className="px-4 py-2 text-[var(--foreground)]"
                    >
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
            ))
          )}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};

export default Table;
