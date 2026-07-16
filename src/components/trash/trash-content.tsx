"use client"

import { useState } from "react"
import { RotateCcw, Edit3, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"

interface Product { id: string; name: string; description: string | null; price: number; quantity: number; low_stock_threshold: number; category: string | null; deleted_at: string | null }
interface Props { products: Product[]; companyId: string }

export function TrashContent({ products: initialProducts, companyId }: Props) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: "", description: "", price: "", quantity: "", low_stock_threshold: "5", category: "Produits finis" })
  const [saving, setSaving] = useState(false)

  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, description: p.description || "", price: String(p.price), quantity: String(p.quantity), low_stock_threshold: String(p.low_stock_threshold), category: p.category || "Produits finis" }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const supabase = createClient()
    const data = { name: form.name, description: form.description || null, price: Number(form.price), quantity: Number(form.quantity), low_stock_threshold: Number(form.low_stock_threshold), category: form.category }
    if (editing) {
      const { error } = await supabase.from("products").update(data).eq("id", editing.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success("Produit modifié")
    }
    setSaving(false); setModalOpen(false); router.refresh()
  }

  const handleRestore = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("products").update({ deleted_at: null }).eq("id", id)
    if (error) { toast.error(error.message); return }
    setProducts(products.filter(p => p.id !== id)); toast.success("Produit restauré")
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Suppression définitive ? Cette action est irréversible.")) return
    const supabase = createClient()
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setProducts(products.filter(p => p.id !== id)); toast.success("Produit supprimé définitivement")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center">
          <Trash2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-[Syne]">Corbeille</h1>
          <p className="text-sm text-[#8A99C2]">{products.length} produit{products.length > 1 ? "s" : ""} supprimé{products.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Card key={product.id} className="animate-fade-in-up opacity-75" style={{ animationDelay: `${i * 0.04}s` }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold font-[Syne] truncate">{product.name}</h3>
                  {product.category && <p className="text-xs text-[#6B7BA8] mt-0.5">{product.category}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleRestore(product.id)} className="p-1.5 rounded-lg hover:bg-[rgba(16,185,129,0.1)] text-[#6B7BA8] hover:text-[#34D399] transition-all" title="Restaurer"><RotateCcw className="h-3.5 w-3.5" /></button>
                  <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-[rgba(59,130,246,0.1)] text-[#6B7BA8] hover:text-[#60A5FA] transition-all" title="Modifier"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handlePermanentDelete(product.id)} className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#6B7BA8] hover:text-[#F87171] transition-all" title="Supprimer définitivement"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {product.description && <p className="text-xs text-[#8A99C2] mb-3 line-clamp-1">{product.description}</p>}

              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold font-[Syne]">{formatCurrency(product.price)}</span>
                <span className="text-xs text-[#6B7BA8]">Qté: {product.quantity}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-[#EF4444]">
                <AlertTriangle className="h-3 w-3" />
                Supprimé le {product.deleted_at ? new Date(product.deleted_at).toLocaleDateString('fr-FR') : ""}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-[rgba(59,130,246,0.08)] flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-10 w-10 text-[#6B7BA8]" />
          </div>
          <p className="text-[#8A99C2] font-medium">Corbeille vide</p>
          <p className="text-sm text-[#6B7BA8] mt-1">Les produits supprimés apparaîtront ici</p>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le produit" : "Nouveau produit"} description="Détails du produit">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nom du produit" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prix unitaire (FCFA)" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#8A99C2] uppercase tracking-wider">Catégorie</label>
              <Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} options={[
                { value: "Matières premières", label: "Matières premières" },
                { value: "Emballages", label: "Emballages" },
                { value: "Produits finis", label: "Produits finis" },
                { value: "Fournitures", label: "Fournitures" },
                { value: "Autre", label: "Autre" },
              ]} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantité" type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            <Input label="Seuil d'alerte" type="number" min="0" value={form.low_stock_threshold} onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })} required />
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
