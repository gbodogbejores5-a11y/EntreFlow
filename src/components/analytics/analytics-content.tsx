"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Client } from "@/types"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Line, Pie } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

interface Quote { id: string; total: number; status: string; created_at: string; clients: Client | null }
interface Props { sales: Quote[] }

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#F472B6", "#22D3EE", "#FCD34D"]

export function AnalyticsContent({ sales }: Props) {
  const [view, setView] = useState<"chart" | "table">("chart")

  const paidSales = sales.filter(s => s.status === "paid")
  const totalRevenue = paidSales.reduce((sum, s) => sum + (s.total || 0), 0)

  // Évolution par mois (6 derniers mois)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }), amount: 0 }
  })
  paidSales.forEach(s => {
    const d = new Date(s.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const m = months.find(m => m.key === key)
    if (m) m.amount += Number(s.total || 0)
  })

  // Répartition par statut
  const statusMap: Record<string, number> = {}
  paidSales.forEach(s => { statusMap[s.status] = (statusMap[s.status] || 0) + 1 })
  const statusLabels = Object.keys(statusMap)
  const statusData = Object.values(statusMap)

  const lineData = {
    labels: months.map(m => m.label),
    datasets: [
      {
        label: "Revenus mensuels",
        data: months.map(m => m.amount),
        borderColor: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.08)",
        tension: 0.35,
        fill: true,
      },
    ],
  }

  const pieData = {
    labels: statusLabels.length ? statusLabels : ["Aucune donnée"],
    datasets: [
      {
        data: statusData.length ? statusData : [1],
        backgroundColor: COLORS,
        borderColor: "#050A1A",
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[Syne]">Analytiques</h1>
          <p className="text-sm text-[#8A99C2]">Visualisez vos performances</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("chart")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "chart" ? "bg-[#2563EB] text-white" : "bg-[rgba(59,130,246,0.06)] text-[#8A99C2]"}`}>Graphiques</button>
          <button onClick={() => setView("table")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "table" ? "bg-[#2563EB] text-white" : "bg-[rgba(59,130,246,0.06)] text-[#8A99C2]"}`}>Tableau</button>
        </div>
      </div>

      {view === "chart" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Évolution des ventes</CardTitle></CardHeader>
            <CardContent className="h-72">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#8A99C2", font: { family: "'DM Sans', sans-serif", size: 12 } } } }, scales: { x: { ticks: { color: "#8A99C2" }, grid: { color: "rgba(59,130,246,0.08)" } }, y: { ticks: { color: "#8A99C2" }, grid: { color: "rgba(59,130,246,0.08)" } } } }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Répartition des ventes</CardTitle></CardHeader>
            <CardContent className="h-72">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: "#8A99C2", font: { family: "'DM Sans', sans-serif", size: 12 }, padding: 16 } } } }} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle>Détail des ventes</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto tbl-wrap">
              <table className="tbl w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[rgba(59,130,246,0.15)]">
                    <th className="py-3 px-4 font-medium text-[#8A99C2]">Date</th>
                    <th className="py-3 px-4 font-medium text-[#8A99C2]">Client</th>
                    <th className="py-3 px-4 font-medium text-[#8A99C2]">Montant</th>
                    <th className="py-3 px-4 font-medium text-[#8A99C2]">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {paidSales.map(sale => (
                    <tr key={sale.id} className="border-b border-[rgba(59,130,246,0.06)] hover:bg-[rgba(59,130,246,0.04)]">
                      <td className="py-3 px-4">{formatDate(sale.created_at)}</td>
                      <td className="py-3 px-4">{(sale as any).clients?.full_name || 'Occasionnel'}</td>
                      <td className="py-3 px-4 font-medium text-[#60A5FA]">{formatCurrency(sale.total)}</td>
                      <td className="py-3 px-4"><span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[rgba(16,185,129,0.15)] text-[#34D399]">{sale.status}</span></td>
                    </tr>
                  ))}
                  {paidSales.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-[#8A99C2]">Aucune vente</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-[#8A99C2]">Revenu total</div>
            <div className="text-2xl font-bold font-[Syne]">{totalRevenue.toLocaleString('fr-FR')} F</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-[#8A99C2]">Ventes payées</div>
            <div className="text-2xl font-bold font-[Syne]">{paidSales.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
