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
        bg-[var(--primary)] 
        text-[var(--primary-foreground)] 
        hover:bg-[var(--primary)]/90 
        transition-colors 
        ${className}
      `}
    >
      {children}
    </UIButton>
  );
};

export default Button;
