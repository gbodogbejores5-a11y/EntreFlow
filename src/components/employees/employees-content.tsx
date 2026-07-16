"use client"

import { useState } from "react"
import { Plus, Edit3, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Employee { id: string; full_name: string; poste: string | null; phone: string | null; email: string | null; whatsapp: string | null; salaire: number | null }
interface Props { employees: Employee[]; companyId: string }

export function EmployeesContent({ employees: initialEmployees, companyId }: Props) {
  const router = useRouter()
  const [employees, setEmployees] = useState(initialEmployees)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState({ full_name: "", poste: "", phone: "", email: "", whatsapp: "", salaire: "" })
  const [saving, setSaving] = useState(false)

  const openNew = () => { setEditing(null); setForm({ full_name: "", poste: "", phone: "", email: "", whatsapp: "", salaire: "" }); setModalOpen(true) }
  const openEdit = (e: Employee) => { setEditing(e); setForm({ full_name: e.full_name, poste: e.poste || "", phone: e.phone || "", email: e.email || "", whatsapp: e.whatsapp || "", salaire: e.salaire ? String(e.salaire) : "" }); setModalOpen(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const supabase = createClient()
    const data = { full_name: form.full_name, poste: form.poste || null, phone: form.phone || null, email: form.email || null, whatsapp: form.whatsapp || null, salaire: Number(form.salaire) || 0 }
    if (editing) {
      const { error } = await supabase.from("employees").update(data).eq("id", editing.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success("Employé modifié")
    } else {
      const { error } = await supabase.from("employees").insert({ ...data, company_id: companyId })
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success("Employé créé")
    }
    setSaving(false); setModalOpen(false); router.refresh()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("employees").delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    setEmployees(employees.filter(e => e.id !== id)); toast.success("Employé supprimé")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-[Syne]">Employés</h1>
            <p className="text-sm text-[#8A99C2]">{employees.length} employé{employees.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" />Nouvel employé</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((emp, i) => (
          <Card key={emp.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] flex items-center justify-center text-white font-bold">
                    {emp.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold font-[Syne]">{emp.full_name}</h3>
                    {emp.poste && <p className="text-xs text-[#6B7BA8]">{emp.poste}</p>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg hover:bg-[rgba(59,130,246,0.1)] text-[#6B7BA8] hover:text-[#60A5FA] transition-all"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => { if (confirm("Supprimer ?")) handleDelete(emp.id) }} className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#6B7BA8] hover:text-[#F87171] transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              <div className="space-y-1">
                {emp.phone && <p className="text-xs text-[#8A99C2]">📞 {emp.phone}</p>}
                {emp.email && <p className="text-xs text-[#8A99C2]">✉ {emp.email}</p>}
                {emp.whatsapp && <p className="text-xs text-[#8A99C2]">💬 {emp.whatsapp}</p>}
                {emp.salaire && <p className="text-xs text-[#8A99C2]">💰 {Number(emp.salaire).toLocaleString('fr-FR')} F</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-[rgba(59,130,246,0.08)] flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-10 w-10 text-[#6B7BA8]" />
          </div>
          <p className="text-[#8A99C2] font-medium">Aucun employé</p>
          <p className="text-sm text-[#6B7BA8] mt-1">Ajoutez votre premier employé</p>
          <Button onClick={openNew} className="mt-4"><Plus className="h-4 w-4" />Ajouter un employé</Button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'employé" : "Nouvel employé"} description="Informations de l'employé">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nom complet *" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
          <Input label="Poste" value={form.poste} onChange={e => setForm({ ...form, poste: e.target.value })} placeholder="Vendeur, Caissier..." />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Téléphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="WhatsApp" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
            <Input label="Salaire (F CFA)" type="number" min="0" value={form.salaire} onChange={e => setForm({ ...form, salaire: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-3 border-t border-[rgba(59,130,246,0.1)]">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? "Enregistrer" : "Créer"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
