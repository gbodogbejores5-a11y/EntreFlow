"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ChevronRight,
  LineChart,
  ShoppingCart,
  Users2,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: FileText, label: "Devis", href: "/quotes" },
  { icon: ShoppingCart, label: "Ventes", href: "/sales" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: Users2, label: "Employés", href: "/employees" },
  { icon: Package, label: "Stock", href: "/stock" },
  { icon: LineChart, label: "Analytiques", href: "/analytics" },
  { icon: Trash2, label: "Corbeille", href: "/trash" },
  { icon: Settings, label: "Paramètres", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <button
        className="fixed bottom-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(59,130,246,0.15)] bg-[#0A1030] shadow-md md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5 text-[#F1F5FF]" />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[rgba(59,130,246,0.15)] bg-[#050A1A] transition-transform duration-300 md:relative",
          collapsed ? "-translate-x-full md:translate-x-0 md:w-0 md:min-w-0 md:border-r-0 md:overflow-hidden" : "translate-x-0",
          "md:flex"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[rgba(59,130,246,0.15)] px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg viewBox="0 0 34 34" width="28" height="28" fill="none">
              <defs><linearGradient id="Gs" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#2563EB" /></linearGradient></defs>
              <path d="M6 24C6 24 11 19 17 21C23 23 28 15 28 10" stroke="url(#Gs)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M6 17C6 17 11 12 17 14C23 16 28 8 28 3" stroke="url(#Gs)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".55" />
            </svg>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, background: "linear-gradient(90deg,#fff,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} className="hidden md:inline">EntreFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-[rgba(59,130,246,0.1)] transition-colors text-[#8A99C2] hover:text-white hidden md:flex"
              aria-label="Ouvrir/fermer le menu"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg hover:bg-[rgba(59,130,246,0.1)] transition-colors md:hidden text-[#8A99C2]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-transparent text-[#60A5FA] border-r-2 border-[#3B82F6]"
                    : "text-[#8A99C2] hover:bg-[rgba(59,130,246,0.08)] hover:text-[#F1F5FF]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[rgba(59,130,246,0.15)] p-3">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8A99C2] hover:bg-[rgba(59,130,246,0.08)] hover:text-[#F1F5FF] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}
    </>
  )
}
