import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "success" | "warning"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const variants = {
  primary: "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_rgba(37,99,235,0.3)]",
  ghost: "bg-transparent border border-[rgba(59,130,246,0.15)] text-[#F1F5FF] hover:border-[#3B82F6] hover:bg-[rgba(59,130,246,0.08)] hover:-translate-y-0.5 active:translate-y-0",
  danger: "bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_28px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0",
  success: "bg-gradient-to-r from-[#059669] to-[#10B981] text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_28px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0",
  warning: "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-[0_4px_14px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0",
}

const sizes = {
  sm: "px-4 py-1.5 text-xs rounded-full gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-full gap-2",
  lg: "px-8 py-3.5 text-base rounded-full gap-2.5",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#050A1A] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
export { Button }
