"use client";

import React from "react";

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

const FloatingInput = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: FloatingInputProps) => {
  const id = label.toLowerCase().replace(/\s+/g, "_");
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="
          block w-full px-2.5 pt-4 pb-2.5
          text-sm text-heading
          bg-[var(--muted)]
          rounded-md
          border border-default-medium
          appearance-none
          peer
        "
      />
      <label
        htmlFor={id}
        className={`
          absolute left-1 z-10 px-2 text-sm text-body
          duration-300 transform scale-75 origin-[0]
          bg-[var(--muted)]
          pointer-events-none
          ${!hasValue ? "top-1/2 -translate-y-1/2 scale-100" : "top-2 -translate-y-4 scale-75"}
          peer-focus:top-2
          peer-focus:-translate-y-4
          peer-focus:scale-75
          peer-focus:text-fg-brand
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
