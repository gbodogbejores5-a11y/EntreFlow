import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[#F1F5FF] flex items-center gap-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7BA8]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "flex h-11 w-full rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.8)] px-4 py-2 text-sm text-white placeholder-[#6B7BA8] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:border-[rgba(59,130,246,0.25)]",
              icon && "pl-10",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="text-xs text-[#6B7BA8]">{hint}</p>}
        {error && <p className="text-xs text-[#EF4444] flex items-center gap-1"><span>⚠</span> {error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"
export { Input }
