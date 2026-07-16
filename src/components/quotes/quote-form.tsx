"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ArrowLeft, FileText, User, Package, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, generateQuoteNumber } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

interface Client { id: string; full_name: string; phone: string | null; email: string | null; city: string | null }
interface Product { id: string; name: string; unit_price: number; quantity: number }
interface Company { company_name: string; logo_url: string | null; phone: string | null; email: string | null; address: string | null; city: string | null }
interface Props { clients: Client[]; products: Product[]; companyId: string; company: Company | null }
interface LineItem { productId: string; productName: string; quantity: number; unitPrice: number }

export function QuoteForm({ clients, products, companyId }: Props) {
  const router = useRouter()
  const [clientId, setClientId] = useState("")
  const [items, setItems] = useState<LineItem[]>([{ productId: "", productName: "", quantity: 1, unitPrice: 0 }])
  const [saving, setSaving] = useState(false)
  const [newClient, setNewClient] = useState({ full_name: "", phone: "", email: "", city: "" })
  const [showNewClient, setShowNewClient] = useState(false)
  const [allClients, setAllClients] = useState(clients)

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const total = subtotal

  const addItem = () => setItems([...items, { productId: "", productName: "", quantity: 1, unitPrice: 0 }])
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    const newItems = [...items]
    newItems[index] = { productId, productName: product?.name || "", quantity: 1, unitPrice: product?.unit_price || 0 }
    setItems(newItems)
  }

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items]; (newItems[index] as any)[field] = value; setItems(newItems)
  }

  const handleCreateClient = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("clients").insert({ ...newClient, company_id: companyId }).select().single()
    if (error) { toast.error(error.message); return }
    setAllClients([...allClients, data]); setClientId(data.id); setShowNewClient(false)
    setNewClient({ full_name: "", phone: "", email: "", city: "" }); toast.success("Client créé")
  }

  const handleSave = async (status: "draft" | "sent") => {
    if (items.length === 0 || !items[0].productName) { toast.error("Ajoutez au moins un article"); return }
    setSaving(true)
    const supabase = createClient()
    const quoteNumber = generateQuoteNumber()

    const { data: quote, error: quoteError } = await supabase
      .from("quotes").insert({ company_id: companyId, client_id: clientId || null, quote_number: quoteNumber, status, subtotal, total }).select().single()
    if (quoteError) { toast.error(quoteError.message); setSaving(false); return }

    const quoteItems = items.map(item => ({ quote_id: quote.id, product_name: item.productName, quantity: item.quantity, unit_price: item.unitPrice, total_price: item.quantity * item.unitPrice }))
    const { error: itemsError } = await supabase.from("quote_items").insert(quoteItems)
    if (itemsError) { toast.error(itemsError.message); setSaving(false); return }

    toast.success("Devis créé avec succès"); router.push(`/quotes/${quote.id}`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/quotes" className="p-2 rounded-xl hover:bg-[rgba(59,130,246,0.1)] transition-colors text-[#8A99C2]"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-[Syne]">Nouveau devis</h1>
            <p className="text-sm text-[#8A99C2]">Créez un devis professionnel</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-[#60A5FA]" />
              <h3 className="text-sm font-semibold font-[Syne] uppercase tracking-wider text-[#8A99C2]">Client</h3>
              <div className="flex-1 h-px bg-[rgba(59,130,246,0.1)]" />
            </div>
            {showNewClient ? (
              <div className="space-y-3 rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.4)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nouveau client</span>
                  <button onClick={() => setShowNewClient(false)} className="text-xs text-[#6B7BA8] hover:text-white transition-colors">Annuler</button>
                </div>
                <Input placeholder="Nom complet" value={newClient.full_name} onChange={e => setNewClient({ ...newClient, full_name: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Téléphone" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
                  <Input placeholder="Email" type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
                </div>
                <Input placeholder="Ville" value={newClient.city} onChange={e => setNewClient({ ...newClient, city: e.target.value })} />
                <Button type="button" size="sm" onClick={handleCreateClient}>Créer le client</Button>
              </div>
            ) : (
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Select id="client" label="Sélectionner un client" options={allClients.map(c => ({ value: c.id, label: c.full_name }))} placeholder="Choisir un client..." value={clientId} onChange={e => setClientId(e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="sm" className="mb-0.5" onClick={() => setShowNewClient(true)} title="Nouveau client"><Plus className="h-4 w-4" /></Button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-[#60A5FA]" />
              <h3 className="text-sm font-semibold font-[Syne] uppercase tracking-wider text-[#8A99C2]">Articles</h3>
              <div className="flex-1 h-px bg-[rgba(59,130,246,0.1)]" />
              <Button type="button" variant="ghost" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-[rgba(59,130,246,0.15)]">
                <Package className="h-8 w-8 text-[#6B7BA8] mx-auto mb-2" />
                <p className="text-sm text-[#8A99C2]">Aucun article ajouté</p>
                <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={addItem}><Plus className="h-4 w-4 mr-1" />Ajouter un article</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.4)] p-4 group/item animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex-1 space-y-3">
                      <Select options={products.map(p => ({ value: p.id, label: `${p.name} — ${formatCurrency(p.unit_price)}/u` }))} placeholder="Sélectionner un produit..." value={item.productId} onChange={e => handleProductSelect(index, e.target.value)} />
                      <div className="flex gap-3 items-end">
                        <div className="w-24">
                          <Input id={`qty-${index}`} label="Qté" type="number" min="1" value={item.quantity} onChange={e => updateItem(index, "quantity", Number(e.target.value))} />
                        </div>
                        <div className="flex-1">
                          <Input id={`price-${index}`} label="Prix unitaire (FCFA)" type="number" min="0" step="0.01" value={item.unitPrice} onChange={e => updateItem(index, "unitPrice", Number(e.target.value))} />
                        </div>
                        <div className="pb-1">
                          <p className="text-sm font-semibold text-[#60A5FA]">{formatCurrency(item.quantity * item.unitPrice)}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(index)} className="p-1.5 mt-6 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#6B7BA8] hover:text-[#F87171] transition-all opacity-0 group-hover/item:opacity-100"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4 text-[#60A5FA]" />
              <h3 className="text-sm font-semibold font-[Syne] uppercase tracking-wider text-[#8A99C2]">Récapitulatif</h3>
              <div className="flex-1 h-px bg-[rgba(59,130,246,0.1)]" />
            </div>
            <div className="rounded-xl bg-[rgba(59,130,246,0.04)] border border-[rgba(59,130,246,0.1)] p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A99C2]">Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-[rgba(59,130,246,0.15)] pt-2">
                <span>Total TTC</span>
                <span className="text-[#60A5FA]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => handleSave("draft")} loading={saving}>Sauvegarder brouillon</Button>
            <Button type="button" className="flex-[2]" onClick={() => handleSave("sent")} loading={saving}>Créer & envoyer le devis</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
