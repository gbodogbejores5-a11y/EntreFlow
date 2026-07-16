import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SalesContent } from "@/components/sales/sales-content"

export default async function SalesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single()

  const { data: sales } = await supabase
    .from("quotes")
    .select("*, clients(full_name, phone, email)")
    .eq("company_id", profile?.company_id)
    .order("created_at", { ascending: false })

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("company_id", profile?.company_id)

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("company_id", profile?.company_id)

  return <SalesContent sales={sales || []} companyId={profile?.company_id || ""} clients={clients || []} products={products || []} />
}
