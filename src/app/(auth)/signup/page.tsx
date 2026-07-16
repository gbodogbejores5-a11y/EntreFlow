"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { toast.error(authError.message); setLoading(false); return }
    if (!authData.user) { toast.error("Erreur lors de la création du compte"); setLoading(false); return }

    const { data: company, error: companyError } = await supabase
      .from("companies").insert({ company_name: companyName }).select().single()
    if (companyError) { toast.error("Erreur lors de la création de l'entreprise"); setLoading(false); return }

    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id, company_id: company.id, full_name: fullName, email, role: "owner",
    })
    if (userError) { toast.error("Erreur lors de la création du profil"); setLoading(false); return }

    toast.success("Compte créé avec succès !")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <svg viewBox="0 0 34 34" width="34" height="34" fill="none">
            <defs><linearGradient id="G1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#2563EB" /></linearGradient></defs>
            <path d="M6 24C6 24 11 19 17 21C23 23 28 15 28 10" stroke="url(#G1)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M6 17C6 17 11 12 17 14C23 16 28 8 28 3" stroke="url(#G1)" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".55" />
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#fff,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EntreFlow</span>
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Créer un compte</h1>
        <p className="text-sm text-[#8A99C2] mt-1">Commencez à gérer votre entreprise</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input id="fullName" label="Nom complet" placeholder="Jean Dupont" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <Input id="companyName" label="Nom de l'entreprise" placeholder="Ma Super Entreprise" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        <Input id="email" label="Email" type="email" placeholder="vous@entreprise.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input id="password" label="Mot de passe" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Button type="submit" loading={loading} className="w-full">Créer mon compte</Button>
      </form>

      <p className="text-center text-sm text-[#8A99C2]">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-[#60A5FA] font-medium hover:underline">Se connecter</Link>
      </p>
    </div>
  )
}
