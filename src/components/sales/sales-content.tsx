"use client"

import { useState } from "react"
import { Plus, Trash2, ArrowLeft, User, Package, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Client { id: string; full_name: string; phone: string | null; email: string | null }
interface Product { id: string; name: string; unit_price: number; quantity: number }
interface Quote { id: string; total: number; status: string; created_at: string; clients: Client | null }
interface Props { sales: Quote[]; companyId: string; clients: Client[]; products: Product[] }

interface SaleItem { productId: string; productName: string; quantity: number; unitPrice: number }

export function SalesContent({ sales, companyId, clients, products }: Props) {
  const router = useRouter()
  const [clientId, setClientId] = useState("")
  const [items, setItems] = useState<SaleItem[]>([{ productId: "", productName: "", quantity: 1, unitPrice: 0 }])
  const [saving, setSaving] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const addItem = () => setItems([...items, { productId: "", productName: "", quantity: 1, unitPrice: 0 }])
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))
  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    const newItems = [...items]
    newItems[index] = { productId, productName: product?.name || "", quantity: 1, unitPrice: product?.unit_price || 0 }
    setItems(newItems)
  }
  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    const newItems = [...items]; (newItems[index] as any)[field] = value; setItems(newItems)
  }

  const handleSave = async () => {
    if (items.length === 0 || !items[0].productName) { toast.error("Ajoutez au moins un article"); return }
    setSaving(true)
    const supabase = createClient()
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const { data: sale, error } = await supabase.from("quotes").insert({ company_id: companyId, client_id: clientId || null, status: "paid", total: totalAmount }).select().single()
    if (error) { toast.error(error.message); setSaving(false); return }
    const saleItems = items.map(item => ({ quote_id: sale.id, product_name: item.productName, quantity: item.quantity, unit_price: item.unitPrice, total_price: item.quantity * item.unitPrice }))
    const { error: itemsError } = await supabase.from("quote_items").insert(saleItems)
    if (itemsError) { toast.error(itemsError.message); setSaving(false); return }
    toast.success("Vente enregistrée"); setSaving(false); setItems([{ productId: "", productName: "", quantity: 1, unitPrice: 0 }]); setClientId("")
  }

  const filteredSales = sales.filter(s => {
    const d = new Date(s.created_at)
    if (dateFrom && d < new Date(dateFrom)) return false
    if (dateTo && d > new Date(dateTo)) return false
    return true
  })

  const totalRevenue = filteredSales.filter(s => s.status === "paid").reduce((sum, s) => sum + (s.total || 0), 0)
  const salesCount = filteredSales.length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-xl hover:bg-[rgba(59,130,246,0.1)] transition-colors text-[#8A99C2]"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold font-[Syne]">Ventes & Factures</h1>
          <p className="text-sm text-[#8A99C2]">Enregistrez vos ventes avec ou sans client</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-[#8A99C2]">Revenu filtré</div>
            <div className="text-2xl font-bold font-[Syne]">{totalRevenue.toLocaleString('fr-FR')} F</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-[#8A99C2]">Ventes</div>
            <div className="text-2xl font-bold font-[Syne]">{salesCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-[#60A5FA]" />
            <h3 className="text-sm font-semibold font-[Syne] uppercase tracking-wider text-[#8A99C2]">Client</h3>
            <div className="flex-1 h-px bg-[rgba(59,130,246,0.1)]" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Client (optionnel)" options={[{ value: "", label: "Vente sans client" }, ...clients.map(c => ({ value: c.id, label: c.full_name }))]} value={clientId} onChange={e => setClientId(e.target.value)} />
            <Input label="Email client (pour facture)" type="email" placeholder="client@email.com" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-[#60A5FA]" />
              <h3 className="text-sm font-semibold font-[Syne] uppercase tracking-wider text-[#8A99C2]">Articles</h3>
              <div className="flex-1 h-px bg-[rgba(59,130,246,0.1)]" />
              <Button type="button" variant="ghost" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.4)] p-4 mb-3">
                <div className="flex-1 space-y-3">
                  <Select options={products.map(p => ({ value: p.id, label: `${p.name} — ${formatCurrency(p.unit_price)}/u` }))} placeholder="Sélectionner un produit..." value={item.productId} onChange={e => handleProductSelect(index, e.target.value)} />
                  <div className="flex gap-3 items-end">
                    <div className="w-24">
                      <Input label="Qté" type="number" min="1" value={item.quantity} onChange={e => updateItem(index, "quantity", Number(e.target.value))} />
                    </div>
                    <div className="flex-1">
                      <Input label="Prix unitaire" type="number" min="0" value={item.unitPrice} onChange={e => updateItem(index, "unitPrice", Number(e.target.value))} />
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-semibold text-[#60A5FA]">{formatCurrency(item.quantity * item.unitPrice)}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem(index)} className="p-1.5 mt-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#6B7BA8] hover:text-[#F87171] transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-[#8A99C2]">Total</span>
            <strong className="text-xl font-bold text-[#60A5FA] font-[Syne]">{formatCurrency(total)}</strong>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => {}}>Annuler</Button>
            <Button type="button" className="flex-[2]" onClick={handleSave} loading={saving}>Enregistrer la vente</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold font-[Syne] uppercase tracking-wider text-[#8A99C2]">Historique</h3>
            <div className="flex items-center gap-2">
              <Input label="Du" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto" />
              <Input label="Au" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredSales.map((sale, i) => (
              <div key={sale.id} className="flex items-center justify-between p-4 rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.4)] animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <div>
                  <p className="font-medium">{sale.clients?.full_name || "Client occasionnel"}</p>
                  <p className="text-xs text-[#6B7BA8]">{formatDate(sale.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#60A5FA]">{formatCurrency(sale.total)}</p>
                  <Badge className={`${sale.status === "paid" ? "bg-[rgba(16,185,129,0.15)] text-[#34D399]" : "bg-[rgba(59,130,246,0.15)] text-[#60A5FA]"}`}>{sale.status}</Badge>
                </div>
              </div>
            ))}
            {filteredSales.length === 0 && <p className="text-center text-[#8A99C2] py-8">Aucune vente trouvée</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
