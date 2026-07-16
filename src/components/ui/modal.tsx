"use client"

import { useEffect, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Modal({ open, onClose, title, description, children, className, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
      window.addEventListener("keydown", handler)
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler) }
    }
    document.body.style.overflow = ""
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "relative z-50 w-full animate-scale-in rounded-2xl border border-[rgba(59,130,246,0.15)] bg-[#0A1030] shadow-2xl max-h-[90vh] overflow-y-auto",
          size === "sm" && "max-w-sm",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-xl",
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-0 gap-4">
            <div>
              {title && <h2 className="text-lg font-semibold font-[Syne] text-[#F1F5FF]">{title}</h2>}
              {description && <p className="text-sm text-[#8A99C2] mt-1">{description}</p>}
            </div>
            <button onClick={onClose} className="shrink-0 p-1.5 rounded-xl hover:bg-[rgba(59,130,246,0.1)] transition-colors text-[#8A99C2] hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
