"use client";

import React from "react";

// Rename shadcn/ui Pagination → ShadPagination
import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col items-center mt-4 gap-2">
      {totalItems !== undefined && (
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} | Total Items: {totalItems}
        </span>
      )}

      <ShadPagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => onPageChange(index + 1)}
                className={
                  currentPage === index + 1
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                }
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </ShadPagination>
    </div>
  );
};

export default Pagination;
