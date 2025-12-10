"use client";

import { Button as UIButton } from "@/components/ui/button";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <UIButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        bg-[var(--color-table-header-bg)] 
        text-[var(--color-table-header-text)] 
        hover:bg-[var(--color-table-header-bg)]/60 
        transition-colors 
        ${className}
      `}
    >
      {children}
    </UIButton>
  );
};

export default Button;
