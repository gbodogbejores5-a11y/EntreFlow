"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, User, Upload, Save, Phone, Mail, MapPin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Company { id: string; company_name: string; logo_url: string | null; phone: string | null; email: string | null; address: string | null; city: string | null }
interface UserProfile { id: string; full_name: string; email: string; role: string }
interface Props { company: Company | null; user: UserProfile | null }

export function SettingsContent({ company, user }: Props) {
  const router = useRouter()
  const [companyForm, setCompanyForm] = useState({ company_name: company?.company_name || "", phone: company?.phone || "", email: company?.email || "", address: company?.address || "", city: company?.city || "" })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"company" | "profile">("company")

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from("companies").update(companyForm).eq("id", company?.id)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success("Informations mises à jour"); setSaving(false); router.refresh()
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `logo-${company?.id}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from("logos").upload(fileName, file, { upsert: true })
    if (uploadError) { toast.error(uploadError.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from("logos").getPublicUrl(fileName)
    const { error: updateError } = await supabase.from("companies").update({ logo_url: urlData.publicUrl }).eq("id", company?.id)
    if (updateError) { toast.error(updateError.message); setUploading(false); return }
    toast.success("Logo mis à jour"); setUploading(false); router.refresh()
  }

  const tabs = [
    { id: "company" as const, label: "Entreprise", icon: Building2 },
    { id: "profile" as const, label: "Profil", icon: User },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-[Syne]">Paramètres</h1>
          <p className="text-sm text-[#8A99C2]">Gérez votre entreprise et votre profil</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.1)] w-fit">
        {tabs.map(tab => (
          <button key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#2563EB] text-white shadow-lg shadow-[rgba(37,99,235,0.3)]"
                : "text-[#8A99C2] hover:text-white hover:bg-[rgba(59,130,246,0.08)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "company" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-[#60A5FA]" /><CardTitle>Informations de l'entreprise</CardTitle></div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveCompany} className="space-y-6">
              <div className="flex items-center gap-6 p-4 rounded-xl bg-[rgba(59,130,246,0.03)] border border-[rgba(59,130,246,0.08)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(59,130,246,0.2)] bg-[rgba(5,10,26,0.6)] overflow-hidden group relative">
                  {company?.logo_url
                    ? <img src={company.logo_url} alt="Logo" className="h-full w-full object-cover" />
                    : <Building2 className="h-10 w-10 text-[#6B7BA8]" />
                  }
                </div>
                <div>
                  <label className="relative cursor-pointer inline-block">
                    <Button type="button" variant="ghost" size="sm" loading={uploading}><Upload className="h-4 w-4 mr-1.5" />Changer le logo</Button>
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                  </label>
                  <p className="text-xs text-[#6B7BA8] mt-1">PNG, JPG ou SVG. Taille max: 2 Mo.</p>
                </div>
              </div>

              <Input id="company_name" icon={<Building2 className="h-4 w-4" />} label="Nom de l'entreprise" value={companyForm.company_name} onChange={e => setCompanyForm({ ...companyForm, company_name: e.target.value })} required />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="phone" icon={<Phone className="h-4 w-4" />} label="Téléphone" value={companyForm.phone} onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })} />
                <Input id="email" icon={<Mail className="h-4 w-4" />} label="Email" type="email" value={companyForm.email} onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })} />
              </div>

              <Input id="address" icon={<MapPin className="h-4 w-4" />} label="Adresse" value={companyForm.address} onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })} />
              <Input id="city" icon={<Globe className="h-4 w-4" />} label="Ville" value={companyForm.city} onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })} />

              <div className="flex justify-end">
                <Button type="submit" loading={saving}><Save className="h-4 w-4 mr-2" />Enregistrer les modifications</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><User className="h-5 w-5 text-[#60A5FA]" /><CardTitle>Mon profil</CardTitle></div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(59,130,246,0.03)] border border-[rgba(59,130,246,0.08)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-lg font-bold text-white">
                {user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </div>
              <div>
                <p className="font-semibold">{user?.full_name || "Utilisateur"}</p>
                <p className="text-sm text-[#6B7BA8]">{user?.email}</p>
              </div>
            </div>
            <Input id="profile_name" icon={<User className="h-4 w-4" />} label="Nom complet" value={user?.full_name || ""} disabled />
            <Input id="profile_email" icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email || ""} disabled />
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(59,130,246,0.04)] border border-[rgba(59,130,246,0.08)]">
              <span className="text-sm text-[#8A99C2]">Rôle:</span>
              <span className="text-sm font-medium capitalize">{user?.role === "owner" ? "Propriétaire" : user?.role}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
