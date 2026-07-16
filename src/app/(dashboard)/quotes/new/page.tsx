import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuoteForm } from "@/components/quotes/quote-form"

export default async function NewQuotePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("company_id, companies(*)")
    .eq("id", user.id)
    .single()

  const company = Array.isArray(profile?.companies)
    ? profile?.companies?.[0]
    : profile?.companies

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("company_id", profile?.company_id)
    .order("full_name")

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("company_id", profile?.company_id)
    .order("name")

  return (
    <QuoteForm
      clients={clients || []}
      products={products || []}
      companyId={profile?.company_id || ""}
      company={company || null}
    />
  )
}
