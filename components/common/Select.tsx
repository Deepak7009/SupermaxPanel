"use client";

import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string; // must NOT be empty string
}

interface CommonSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

const Select = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: CommonSelectProps) => {
  return (
    <UISelect value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`
          max-w-xs
          bg-[var(--muted)]
          text-[var(--foreground)]
          border border-[var(--border)]
          ${className}
        `}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      {/* DO NOT override hover styles here */}
      <SelectContent className="bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UISelect>
  );
};

export default Select;
