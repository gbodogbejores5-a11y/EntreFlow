"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Share2, FileText, User, Calculator, CheckCircle2, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface QuoteItem { id: string; product_name: string; quantity: number; unit_price: number; total_price: number }
interface Client { id: string; full_name: string; phone: string | null; email: string | null; city: string | null; address: string | null }
interface Quote { id: string; quote_number: string; status: string; subtotal: number; total: number; created_at: string; clients: Client | null; quote_items: QuoteItem[] }
interface Company { company_name: string; logo_url: string | null; phone: string | null; email: string | null; address: string | null; city: string | null }
interface Props { quote: Quote; company: Company | null }

const statusMeta: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; next: string[] }> = {
  draft: { label: "Brouillon", color: "#8A99C2", bg: "rgba(59,130,246,0.1)", icon: <FileText className="h-4 w-4" />, next: ["sent"] },
  sent: { label: "Envoyé", color: "#FBBF24", bg: "rgba(245,158,11,0.12)", icon: <Send className="h-4 w-4" />, next: ["paid", "draft"] },
  paid: { label: "Payé", color: "#34D399", bg: "rgba(16,185,129,0.12)", icon: <CheckCircle2 className="h-4 w-4" />, next: [] },
}

export function QuoteDetail({ quote, company }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(quote.status)
  const [changing, setChanging] = useState(false)
  const meta = statusMeta[status] || statusMeta.draft

  const updateStatus = async (newStatus: string) => {
    if (newStatus === status) return
    setChanging(true)
    const supabase = createClient()
    const { error } = await supabase.from("quotes").update({ status: newStatus }).eq("id", quote.id)
    if (error) { toast.error(error.message); setChanging(false); return }
    setStatus(newStatus); toast.success(`Statut mis à jour : ${statusMeta[newStatus].label}`)
    setChanging(false); router.refresh()
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    const pw = doc.internal.pageSize.getWidth()
    doc.setFontSize(22); doc.setTextColor(10); doc.text(company?.company_name || "Entreprise", 14, 22)
    doc.setFontSize(9); doc.setTextColor(130)
    let yInfo = 30
    if (company?.address) { doc.text(company.address, 14, yInfo); yInfo += 6 }
    if (company?.city) { doc.text(company.city, 14, yInfo); yInfo += 6 }
    if (company?.phone) { doc.text(`Tel: ${company.phone}`, 14, yInfo); yInfo += 6 }
    if (company?.email) { doc.text(`Email: ${company.email}`, 14, yInfo) }
    doc.setFontSize(28); doc.setTextColor(37, 99, 235); doc.text("DEVIS", pw - 14, 22, { align: "right" })
    doc.setFontSize(12); doc.setTextColor(10); doc.text(quote.quote_number, pw - 14, 30, { align: "right" })
    doc.setTextColor(130); doc.setFontSize(9); doc.text(`Date: ${formatDate(quote.created_at)}`, pw - 14, 36, { align: "right" })
    if (quote.clients) {
      doc.setFontSize(10); doc.setTextColor(10); doc.text("Client", 14, yInfo + 14)
      doc.setFontSize(9); doc.setTextColor(130)
      let y = yInfo + 20
      doc.text(quote.clients.full_name, 14, y); y += 5
      if (quote.clients.email) { doc.text(quote.clients.email, 14, y); y += 5 }
      if (quote.clients.phone) { doc.text(quote.clients.phone, 14, y); y += 5 }
      if (quote.clients.city) { doc.text(quote.clients.city, 14, y) }
    }
    autoTable(doc, {
      startY: Math.max(96, yInfo + 30),
      head: [["Produit", "Quantité", "Prix unit.", "Total"]],
      body: quote.quote_items.map(item => [item.product_name, item.quantity.toString(), formatCurrency(item.unit_price), formatCurrency(item.total_price)]),
      foot: [["", "", "Sous-total", formatCurrency(quote.subtotal)], ["", "", "Total", formatCurrency(quote.total)]],
      theme: "grid", headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 9 }, footStyles: { fillColor: [245, 245, 250], fontSize: 9 }, styles: { fontSize: 8.5 },
    })
    doc.save(`devis-${quote.quote_number}.pdf`); toast.success("PDF téléchargé")
  }

  const shareWhatsApp = () => {
    if (!quote.clients?.phone) { toast.error("Ce client n'a pas de numéro de téléphone"); return }
    const phone = quote.clients.phone.replace(/[^0-9]/g, "")
    const msg = encodeURIComponent(`Bonjour ${quote.clients.full_name},\n\nVeuillez trouver ci-joint votre devis ${quote.quote_number} d'un montant de ${formatCurrency(quote.total)}.\n\nCordialement,\n${company?.company_name || "L'équipe"}`)
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/quotes" className="p-2 rounded-xl hover:bg-[rgba(59,130,246,0.1)] transition-colors text-[#8A99C2]"><ArrowLeft className="h-5 w-5" /></Link>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-[Syne]">{quote.quote_number}</h1>
                <Badge variant={status === "paid" ? "success" : status === "sent" ? "warning" : "outline"} className="ml-1">
                  {meta.label}
                </Badge>
              </div>
              <p className="text-sm text-[#8A99C2] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Créé le {formatDate(quote.created_at)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={shareWhatsApp}><Share2 className="h-4 w-4 mr-1.5" />WhatsApp</Button>
          <Button variant="ghost" size="sm" onClick={generatePDF}><Download className="h-4 w-4 mr-1.5" />PDF</Button>
          <div className="relative">
          <Select
            value={status}
            onChange={e => updateStatus(e.target.value)}
            className="w-36"
            disabled={changing}
            options={[
              { value: "draft", label: "📄 Brouillon" },
              { value: "sent", label: "📤 Envoyé" },
              { value: "paid", label: "✅ Payé" },
            ]}
          />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="h-4 w-4 text-[#60A5FA]" />
                <h3 className="font-semibold font-[Syne]">Articles</h3>
                <div className="flex-1 h-px bg-[rgba(59,130,246,0.1)]" />
                <span className="text-xs text-[#6B7BA8]">{quote.quote_items.length} article{quote.quote_items.length > 1 ? "s" : ""}</span>
              </div>
              <div className="space-y-2">
                {quote.quote_items.map((item, i) => (
                  <div key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[rgba(59,130,246,0.08)] bg-[rgba(5,10,26,0.3)] p-4 hover:bg-[rgba(59,130,246,0.04)] transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-xs text-[#6B7BA8] mt-0.5">{item.quantity} x {formatCurrency(item.unit_price)}</p>
                    </div>
                    <p className="font-bold text-right">{formatCurrency(item.total_price)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-[#60A5FA]" />
                <h3 className="font-semibold font-[Syne]">Client</h3>
              </div>
              {quote.clients ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-sm font-bold text-white">
                      {quote.clients.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{quote.clients.full_name}</p>
                      {quote.clients.city && <p className="text-xs text-[#6B7BA8]">{quote.clients.city}</p>}
                    </div>
                  </div>
                  {quote.clients.email && (
                    <p className="text-sm text-[#8A99C2] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
                      {quote.clients.email}
                    </p>
                  )}
                  {quote.clients.phone && (
                    <p className="text-sm text-[#8A99C2] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                      {quote.clients.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6B7BA8]">Client supprimé</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-4 w-4 text-[#60A5FA]" />
                <h3 className="font-semibold font-[Syne]">Récapitulatif</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A99C2]">Sous-total</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-[rgba(59,130,246,0.15)] pt-3">
                  <span>Total TTC</span>
                  <span className="text-[#60A5FA]">{formatCurrency(quote.total)}</span>
                </div>
                <div className="pt-3 border-t border-[rgba(59,130,246,0.1)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A99C2]">Statut</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: meta.bg, color: meta.color }}>
                      {meta.icon}
                      {meta.label}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {meta.next.map(ns => {
              const nm = statusMeta[ns]
              return (
                <Button key={ns} variant={ns === "paid" ? "primary" : "ghost"} size="sm" className="flex-1"
                  onClick={() => updateStatus(ns)} loading={changing}
                >
                  {nm.icon}
                  Marquer {nm.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
