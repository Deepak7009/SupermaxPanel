"use client";

import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { ChevronDown, X } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggle = (optValue: string) => {
    onChange(
      value.includes(optValue)
        ? value.filter((v) => v !== optValue)
        : [...value, optValue],
    );
  };

  const remove = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedLabels = options.filter((o) => value.includes(o.value));

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((p) => !p)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((p) => !p)}
        className={`
          min-h-10 w-full flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-md
          border border-[var(--border)] bg-[var(--muted)] cursor-pointer
          text-sm text-[var(--foreground)]
          focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
          transition-colors
        `}
      >
        {selectedLabels.length === 0 && (
          <span className="text-[var(--muted-foreground)]">{placeholder}</span>
        )}

        {selectedLabels.map((opt) => (
          <span
            key={opt.value}
            className="flex items-center gap-1 bg-[var(--background)] border border-[var(--border)] rounded px-2 py-0.5 text-xs font-medium"
          >
            {opt.label}
            <button
              type="button"
              onClick={(e) => remove(opt.value, e)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label={`Remove ${opt.label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <ChevronDown
          className={`ml-auto w-4 h-4 shrink-0 text-[var(--muted-foreground)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] shadow-lg">
          {/* Search inside dropdown */}
          <div className="p-2 border-b border-[var(--border)]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full max-w-full text-sm"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
                No options found
              </li>
            )}
            {filtered.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(opt.value)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-[var(--muted)] transition-colors"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(opt.value)}
                    id={`ms-${opt.value}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`ms-${opt.value}`}
                    className="cursor-pointer select-none text-[var(--foreground)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {opt.label}
                  </label>
                </li>
              );
            })}
          </ul>

          {/* Footer: count + clear */}
          {value.length > 0 && (
            <div className="border-t border-[var(--border)] px-3 py-1.5 flex items-center justify-between">
              <span className="text-xs text-[var(--muted-foreground)]">
                {value.length} selected
              </span>
              <Button
                onClick={() => onChange([])}
                className="text-xs px-2 py-0.5 h-auto bg-transparent hover:bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] shadow-none"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
