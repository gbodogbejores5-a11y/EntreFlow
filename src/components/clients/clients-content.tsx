"use client"

import { useState } from "react"
import { Search, Plus, Phone, Mail, MapPin, Trash2, Edit3, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Client { id: string; full_name: string; phone: string | null; email: string | null; city: string | null; address: string | null }
interface Props { clients: Client[]; companyId: string }

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
const colors = ["from-[#2563EB] to-[#3B82F6]", "from-[#7C3AED] to-[#8B5CF6]", "from-[#059669] to-[#10B981]", "from-[#D97706] to-[#F59E0B]", "from-[#DC2626] to-[#EF4444]", "from-[#0891B2] to-[#06B6D4]"]

export function ClientsContent({ clients: initialClients, companyId }: Props) {
  const router = useRouter()
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", city: "", address: "" })
  const [saving, setSaving] = useState(false)

  const filtered = clients.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  )

  const openNew = () => { setEditing(null); setForm({ full_name: "", phone: "", email: "", city: "", address: "" }); setModalOpen(true) }
  const openEdit = (client: Client) => { setEditing(client); setForm({ full_name: client.full_name, phone: client.phone || "", email: client.email || "", city: client.city || "", address: client.address || "" }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const supabase = createClient()
    if (editing) {
      const { error } = await supabase.from("clients").update(form).eq("id", editing.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success("Client modifié")
    } else {
      const { error } = await supabase.from("clients").insert({ ...form, company_id: companyId })
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success("Client créé")
    }
    setSaving(false); setModalOpen(false); router.refresh()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("clients").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setClients(clients.filter(c => c.id !== id)); toast.success("Client supprimé")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-[Syne]">Clients</h1>
            <p className="text-sm text-[#8A99C2]">{clients.length} client{clients.length > 1 ? "s" : ""} enregistré{clients.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" />Nouveau client</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7BA8]" />
        <input
          className="flex h-11 w-full rounded-xl border border-[rgba(59,130,246,0.15)] bg-[rgba(5,10,26,0.8)] pl-10 pr-4 py-2 text-sm text-white placeholder-[#6B7BA8] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
          placeholder="Rechercher un client par nom, email ou ville..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7BA8] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((client, i) => (
          <Card key={client.id} className="animate-fade-in-up group" style={{ animationDelay: `${i * 0.05}s` }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {initials(client.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold font-[Syne] truncate">{client.full_name}</h3>
                      {client.city && <Badge variant="outline" className="mt-1">{client.city}</Badge>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(client)} className="p-1.5 rounded-lg hover:bg-[rgba(59,130,246,0.1)] text-[#6B7BA8] hover:text-[#60A5FA] transition-all"><Edit3 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => { if (confirm("Supprimer ce client ?")) handleDelete(client.id) }} className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#6B7BA8] hover:text-[#F87171] transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {client.email && <p className="text-xs text-[#8A99C2] flex items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{client.email}</span></p>}
                    {client.phone && <p className="text-xs text-[#8A99C2] flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /><span>{client.phone}</span></p>}
                    {client.address && <p className="text-xs text-[#8A99C2] flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{client.address}</span></p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-[rgba(59,130,246,0.08)] flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-[#6B7BA8]" />
          </div>
          <p className="text-[#8A99C2] font-medium">{search ? "Aucun client trouvé" : "Aucun client pour le moment"}</p>
          <p className="text-sm text-[#6B7BA8] mt-1">{search ? "Essayez un autre terme de recherche" : "Ajoutez votre premier client"}</p>
          {!search && <Button onClick={openNew} className="mt-4"><Plus className="h-4 w-4" />Ajouter un client</Button>}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le client" : "Nouveau client"} description="Les informations de votre client">
        <form onSubmit={handleSave} className="space-y-4">
          <Input id="full_name" label="Nom complet" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input id="phone" label="Téléphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input id="email" label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="city" label="Ville" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <Input id="address" label="Adresse" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-3 border-t border-[rgba(59,130,246,0.1)]">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? "Enregistrer" : "Créer le client"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
