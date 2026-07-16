import { forwardRef, type SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={id} className="text-sm font-medium text-[#F1F5FF]">{label}</label>}
        <select
          ref={ref}
          id={id}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.8)] px-4 py-2 text-sm text-white appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238A99C2%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all duration-200 hover:border-[rgba(59,130,246,0.25)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" className="bg-[#050A1A] text-[#6B7BA8]">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#050A1A] text-[#F1F5FF]">{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-[#EF4444]"><span>⚠</span> {error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"
export { Select }
