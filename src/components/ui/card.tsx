import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(59,130,246,0.12)] bg-[rgba(10,16,48,0.85)] backdrop-blur-sm transition-all duration-300 hover:border-[rgba(59,130,246,0.25)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold font-[Syne] text-[#F1F5FF]", className)} {...props} />
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[#8A99C2]", className)} {...props} />
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
