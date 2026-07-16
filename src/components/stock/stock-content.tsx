"use client"

import { useState } from "react"
import { Search, Plus, Package, Edit3, Trash2, RotateCcw, AlertTriangle, TrendingUp, TrendingDown, X, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"

interface Product { id: string; name: string; description: string | null; price: number; quantity: number; low_stock_threshold: number; category: string | null; deleted_at?: string | null }
interface Props { products: Product[]; companyId: string }

const categories = ["Tous", "Matières premières", "Emballages", "Produits finis", "Fournitures", "Autre"]

export function StockContent({ products: initialProducts, companyId }: Props) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("Tous")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: "", description: "", price: "", quantity: "", low_stock_threshold: "5", category: "Produits finis" })
  const [saving, setSaving] = useState(false)

  const filtered = products.filter(p => {
    const match = p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase())
    const cat = catFilter === "Tous" || p.category === catFilter
    return match && cat && !p.deleted_at
  })

  const lowStock = filtered.filter(p => p.quantity <= p.low_stock_threshold)

  const openNew = () => { setEditing(null); setForm({ name: "", description: "", price: "", quantity: "", low_stock_threshold: "5", category: "Produits finis" }); setModalOpen(true) }
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, description: p.description || "", price: String(p.price), quantity: String(p.quantity), low_stock_threshold: String(p.low_stock_threshold), category: p.category || "Produits finis" }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const supabase = createClient()
    const data = { name: form.name, description: form.description || null, price: Number(form.price), quantity: Number(form.quantity), low_stock_threshold: Number(form.low_stock_threshold), category: form.category }
    if (editing) {
      const { error } = await supabase.from("products").update(data).eq("id", editing.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success("Produit modifié")
    } else {
      const { error } = await supabase.from("products").insert({ ...data, company_id: companyId }).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success("Produit créé")
    }
    setSaving(false); setModalOpen(false); router.refresh()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString() }).eq("id", id)
    if (error) { toast.error(error.message); return }
    setProducts(products.filter(p => p.id !== id)); toast.success("Produit déplacé dans la corbeille")
  }

  const handleRestore = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("products").update({ deleted_at: null }).eq("id", id)
    if (error) { toast.error(error.message); return }
    setProducts([...products, { ...products.find(p => p.id === id)!, deleted_at: null }]); toast.success("Produit restauré")
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Suppression définitive ?")) return
    const supabase = createClient()
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setProducts(products.filter(p => p.id !== id)); toast.success("Produit supprimé définitivement")
  }

  const stockLevel = (qty: number, threshold: number) => {
    if (qty <= 0) return { label: "Rupture", color: "bg-[rgba(239,68,68,0.15)] text-[#F87171]", bar: "from-[#DC2626] to-[#EF4444]", pct: 0 }
    if (qty <= threshold) return { label: "Faible", color: "bg-[rgba(245,158,11,0.15)] text-[#FBBF24]", bar: "from-[#F59E0B] to-[#FBBF24]", pct: Math.min(100, (qty / threshold) * 100) }
    if (qty <= threshold * 2) return { label: "Moyen", color: "bg-[rgba(59,130,246,0.15)] text-[#60A5FA]", bar: "from-[#2563EB] to-[#3B82F6]", pct: Math.min(100, (qty / (threshold * 3)) * 100) }
    return { label: "Élevé", color: "bg-[rgba(16,185,129,0.15)] text-[#34D399]", bar: "from-[#059669] to-[#10B981]", pct: 100 }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-[Syne]">Stock & Produits</h1>
            <p className="text-sm text-[#8A99C2]">{products.length} produit{products.length > 1 ? "s" : ""} • {lowStock.length} alerte{lowStock.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" />Nouveau produit</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7BA8]" />
          <input
            className="flex h-11 w-full rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.8)] pl-10 pr-4 py-2 text-sm text-white placeholder-[#6B7BA8] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7BA8] hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                catFilter === cat
                  ? "bg-[#2563EB] text-white shadow-lg shadow-[rgba(37,99,235,0.3)]"
                  : "bg-[rgba(59,130,246,0.06)] text-[#8A99C2] hover:bg-[rgba(59,130,246,0.12)] hover:text-white border border-[rgba(59,130,246,0.1)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, i) => {
          const level = stockLevel(product.quantity, product.low_stock_threshold)
          return (
            <Card key={product.id} className="animate-fade-in-up group" style={{ animationDelay: `${i * 0.04}s` }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold font-[Syne] truncate">{product.name}</h3>
                    {product.category && <p className="text-xs text-[#6B7BA8] mt-0.5">{product.category}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-[rgba(59,130,246,0.1)] text-[#6B7BA8] hover:text-[#60A5FA] transition-all"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm("Supprimer ce produit ?")) handleDelete(product.id) }} className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#6B7BA8] hover:text-[#F87171] transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                {product.description && <p className="text-xs text-[#8A99C2] mb-3 line-clamp-1">{product.description}</p>}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold font-[Syne]">{formatCurrency(product.price)}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${level.color}`}>
                    {level.label === "Rupture" ? <AlertTriangle className="h-3 w-3" /> : level.label === "Élevé" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {level.label}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-[#6B7BA8]">
                    <span>Stock</span>
                    <span className="font-semibold text-white">{product.quantity} unité{product.quantity > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[rgba(59,130,246,0.06)] overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${level.bar} transition-all duration-700`} style={{ width: `${level.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-[#6B7BA8] text-right">Seuil: {product.low_stock_threshold}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-[rgba(59,130,246,0.08)] flex items-center justify-center mx-auto mb-4">
            <Package className="h-10 w-10 text-[#6B7BA8]" />
          </div>
          <p className="text-[#8A99C2] font-medium">{search ? "Aucun produit trouvé" : "Aucun produit pour le moment"}</p>
          <p className="text-sm text-[#6B7BA8] mt-1">{search ? "Essayez un autre terme" : "Ajoutez votre premier produit"}</p>
          {!search && <Button onClick={openNew} className="mt-4"><Plus className="h-4 w-4" />Ajouter un produit</Button>}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le produit" : "Nouveau produit"} description="Détails du produit">
        <form onSubmit={handleSave} className="space-y-4">
          <Input id="name" label="Nom du produit" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input id="desc" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input id="price" label="Prix unitaire (FCFA)" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#8A99C2] uppercase tracking-wider">Catégorie</label>
              <Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                options={categories.filter(c => c !== "Tous").map(c => ({ value: c, label: c }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="qty" label="Quantité" type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            <Input id="threshold" label="Seuil d'alerte" type="number" min="0" value={form.low_stock_threshold} onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })} required />
          </div>
          <div className="flex gap-3 pt-3 border-t border-[rgba(59,130,246,0.1)]">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? "Enregistrer" : "Créer le produit"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
