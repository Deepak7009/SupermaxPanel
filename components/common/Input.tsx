"use client";

import { Input as UIInput } from "@/components/ui/input";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

const Input = ({
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
}: InputProps) => {
  return (
    <UIInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        max-w-xs
        bg-[var(--muted)]
        text-[var(--foreground)]
        border border-[var(--border)]
        placeholder-[var(--muted-foreground)]
        ${className}
      `}
    />
  );
};

export default Input;
