import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline"
  pulse?: boolean
}

function Badge({ className, variant = "default", pulse, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-all",
        {
          "bg-[rgba(59,130,246,0.15)] text-[#60A5FA]": variant === "default",
          "bg-[rgba(16,185,129,0.15)] text-[#34D399]": variant === "success",
          "bg-[rgba(245,158,11,0.15)] text-[#FBBF24]": variant === "warning",
          "bg-[rgba(239,68,68,0.15)] text-[#F87171]": variant === "danger",
          "bg-[rgba(59,130,246,0.12)] text-[#93C5FD]": variant === "info",
          "bg-[rgba(139,92,246,0.15)] text-[#A78BFA]": variant === "purple",
          "border border-[rgba(59,130,246,0.15)] text-[#8A99C2]": variant === "outline",
        },
        pulse && "animate-pulse-glow",
        className
      )}
      {...props}
    />
  )
}
export { Badge }
