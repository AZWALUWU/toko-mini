import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg";

    const variants = {
      primary: "bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-sm",
      secondary: "bg-zinc-800 text-white hover:bg-zinc-900 active:bg-black",
      outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100",
      ghost: "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200",
      danger: "bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900",
    };

    const sizes = {
      default: "min-h-[44px] px-4 py-2.5 text-sm",
      sm: "min-h-[40px] px-3 py-2 text-xs",
      lg: "min-h-[48px] px-6 py-3 text-base",
      icon: "w-11 h-11 min-w-[44px] min-h-[44px] p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
