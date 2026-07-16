"use client"

import { useState } from "react"
import { FileText, Plus, Search, ArrowUpRight, Clock, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Quote { id: string; quote_number: string; status: string; total: number; created_at: string; clients: { full_name: string } | null }
interface Props { quotes: Quote[] }

const statusConfig: Record<string, { label: string; variant: "outline" | "warning" | "success"; icon: string }> = {
  draft: { label: "Brouillon", variant: "outline", icon: "📄" },
  sent: { label: "Envoyé", variant: "warning", icon: "📤" },
  paid: { label: "Payé", variant: "success", icon: "✅" },
}

export function QuotesList({ quotes: initialQuotes }: Props) {
  const [search, setSearch] = useState("")
  const filtered = initialQuotes.filter(q =>
    q.quote_number.toLowerCase().includes(search.toLowerCase()) ||
    (q.clients?.full_name || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-[Syne]">Devis</h1>
            <p className="text-sm text-[#8A99C2]">{initialQuotes.length} devis • {initialQuotes.filter(q => q.status === "paid").length} payés</p>
          </div>
        </div>
        <Link href="/quotes/new">
          <Button><Plus className="h-4 w-4" />Nouveau devis</Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7BA8]" />
        <input
          className="flex h-11 w-full rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.8)] pl-10 pr-4 py-2 text-sm text-white placeholder-[#6B7BA8] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
          placeholder="Rechercher un devis par numéro ou client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7BA8] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filtered.map((quote, i) => {
          const config = statusConfig[quote.status] || statusConfig.draft
          return (
            <Link key={quote.id} href={`/quotes/${quote.id}`}
              className="group block animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Card className="hover:shadow-[0_4px_24px_rgba(59,130,246,0.12)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-200 cursor-pointer border-[rgba(59,130,246,0.08)]">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                        quote.status === "paid" ? "bg-[rgba(16,185,129,0.12)]" :
                        quote.status === "sent" ? "bg-[rgba(245,158,11,0.12)]" :
                        "bg-[rgba(59,130,246,0.1)]"
                      }`}>
                        {config.icon}
                      </div>
                      <div>
                        <p className="font-semibold font-[Syne] group-hover:text-[#60A5FA] transition-colors">{quote.quote_number}</p>
                        <p className="text-sm text-[#6B7BA8] flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(quote.created_at)}
                        </p>
                        {quote.clients && <p className="text-sm text-[#8A99C2] mt-0.5">{quote.clients.full_name}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <p className="font-bold text-lg font-[Syne]">{formatCurrency(quote.total)}</p>
                        <Badge variant={config.variant} className="mt-1">{config.label}</Badge>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#6B7BA8] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-[rgba(59,130,246,0.08)] flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-[#6B7BA8]" />
          </div>
          <p className="text-[#8A99C2] font-medium">{search ? "Aucun devis trouvé" : "Aucun devis pour le moment"}</p>
          <p className="text-sm text-[#6B7BA8] mt-1">{search ? "Essayez un autre terme" : "Créez votre premier devis en quelques clics"}</p>
          {!search && <Link href="/quotes/new"><Button className="mt-4"><Plus className="h-4 w-4" />Créer un devis</Button></Link>}
        </div>
      )}
    </div>
  )
}
