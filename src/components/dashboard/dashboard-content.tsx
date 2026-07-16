"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText, Users, Package, TrendingUp, AlertTriangle, ArrowUpRight, Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Quote } from "@/types"

type Kpi = {
  label: string
  value: string
  icon: typeof FileText
  change: string
  color: string
  txt: string
  gradient: string
  barWidth: number
}

export function DashboardContent({ companyId }: { companyId: string }) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])
  const [clientsCount, setClientsCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [quotesCount, setQuotesCount] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()

      const [quotesRes, lowRes, clientsRes, productsRes] = await Promise.all([
        supabase.from("quotes").select("*").eq("company_id", companyId).order("created_at", { ascending: false }).limit(50),
        supabase.from("products").select("*").eq("company_id", companyId).lt("quantity", 100),
        supabase.from("clients").select("*", { count: "exact", head: true }).eq("company_id", companyId),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("company_id", companyId),
      ])

      const allQuotes = quotesRes.data || []
      setQuotes(allQuotes)

      const paid = allQuotes.filter(item => item.status === "paid")
      setQuotesCount(allQuotes.length)
      setMonthlyRevenue(
        paid
          .filter(item => {
            const d = new Date(item.created_at)
            const n = new Date()
            return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
          })
          .reduce((sum, item) => sum + Number(item.total || 0), 0),
      )
      setTotalRevenue(paid.reduce((sum, item) => sum + Number(item.total || 0), 0))
      setLowStock(lowRes.data || [])
      setClientsCount(clientsRes.count || 0)
      setProductsCount(productsRes.count || 0)
    }

    load()
  }, [companyId])

  const paidQuotes = useMemo(() => quotes.filter(q => q.status === "paid").length, [quotes])
  const paidRate = quotesCount > 0 ? Math.round((paidQuotes / quotesCount) * 100) : 0

  const kpis: Kpi[] = [
    { label: "Devis du mois", value: String(quotesCount), icon: FileText, change: "+2", color: "rgba(59,130,246,0.12)", txt: "#60A5FA", gradient: "from-[#2563EB] to-[#3B82F6]", barWidth: 25 },
    { label: "Clients actifs", value: String(clientsCount), icon: Users, change: "+1", color: "rgba(139,92,246,0.12)", txt: "#A78BFA", gradient: "from-[#7C3AED] to-[#8B5CF6]", barWidth: 50 },
    { label: "Produits suivis", value: String(productsCount), icon: Package, change: "✓", color: "rgba(16,185,129,0.12)", txt: "#34D399", gradient: "from-[#059669] to-[#10B981]", barWidth: 75 },
    { label: "Taux de paiement", value: `${paidRate}%`, icon: TrendingUp, change: "+5%", color: "rgba(245,158,11,0.12)", txt: "#FBBF24", gradient: "from-[#D97706] to-[#F59E0B]", barWidth: 25 },
    { label: "Revenu mensuel", value: `${monthlyRevenue.toLocaleString("fr-FR")} F`, icon: TrendingUp, change: "", color: "rgba(6,182,212,0.12)", txt: "#22D3EE", gradient: "from-[#0891B2] to-[#06B6D4]", barWidth: 25 },
    { label: "Revenu total", value: `${totalRevenue.toLocaleString("fr-FR")} F`, icon: Clock, change: "", color: "rgba(236,72,153,0.12)", txt: "#F472B6", gradient: "from-[#DB2777] to-[#EC4899]", barWidth: 100 },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-lg">👋</div>
            <div>
              <h1 className="text-2xl font-bold font-[Syne]">Tableau de bord</h1>
              <p className="text-sm text-[#8A99C2]">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
        <Link href="/quotes/new">
          <Button className="animate-float">
            <FileText className="h-4 w-4" />
            Nouveau devis
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {kpis.map((kpi, i) => (
          <Card key={kpi.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#8A99C2] font-medium">{kpi.label}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: kpi.color, color: kpi.txt }}>
                  <kpi.icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold font-[Syne]">{kpi.value}</p>
                {kpi.change ? (
                  <span className="text-xs font-medium text-[#34D399] flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" />
                    {kpi.change}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[rgba(59,130,246,0.08)] overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${kpi.gradient} transition-all duration-1000`} style={{ width: `${kpi.barWidth}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Derniers devis</CardTitle>
            <Link href="/quotes">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[#60A5FA]" />
                </div>
                <p className="text-[#8A99C2] font-medium">Aucun devis pour le moment</p>
                <p className="text-sm text-[#6B7BA8] mt-1">Créez votre premier devis en quelques clics</p>
                <Link href="/quotes/new"><Button size="sm" className="mt-4">Créer un devis</Button></Link>
              </div>
            ) : (
              <div className="space-y-2">
                {quotes.slice(0, 8).map((quote: any, i) => (
                  <Link key={quote.id} href={`/quotes/${quote.id}`}
                    className="group flex items-center justify-between rounded-xl border border-[rgba(59,130,246,0.08)] bg-[rgba(5,10,26,0.3)] p-4 hover:bg-[rgba(59,130,246,0.06)] hover:border-[rgba(59,130,246,0.2)] transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        quote.status === "paid" ? "bg-[rgba(16,185,129,0.15)] text-[#34D399]" :
                        quote.status === "sent" ? "bg-[rgba(245,158,11,0.15)] text-[#FBBF24]" :
                        "bg-[rgba(59,130,246,0.1)] text-[#60A5FA]"
                      }`}>
                        {String(quote.quote_number || "#").slice(-3)}
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-[#60A5FA] transition-colors">{quote.quote_number}</p>
                        <p className="text-xs text-[#6B7BA8] flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {formatDate(quote.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(quote.total)}</p>
                      <Badge
                        variant={quote.status === "paid" ? "success" : quote.status === "sent" ? "warning" : "outline"}
                        className="mt-1"
                      >
                        {quote.status === "draft" ? "Brouillon" : quote.status === "sent" ? "Envoyé" : "Payé"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alertes stock</CardTitle>
            <Link href="/stock">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.1)] flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-[#34D399]" />
                </div>
                <p className="text-[#8A99C2] font-medium">Tous les stocks sont suffisants</p>
                <p className="text-sm text-[#6B7BA8] mt-1">Aucune alerte à signaler</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStock.map((product, i) => {
                  const pct = Math.max(0, Math.min(100, ((product.quantity || 0) / (product.low_stock_threshold || 1)) * 100))
                  return (
                    <div key={product.id}
                      className="flex items-center justify-between rounded-xl border border-[rgba(245,158,11,0.15)] bg-[rgba(245,158,11,0.06)] p-4 animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-[#FBBF24]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-2 rounded-full bg-[rgba(245,158,11,0.1)] overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-[#FBBF24] shrink-0">
                              {product.quantity}/{product.low_stock_threshold}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href="/stock" className="ml-4">
                        <Button variant="ghost" size="sm">Réapro.</Button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
