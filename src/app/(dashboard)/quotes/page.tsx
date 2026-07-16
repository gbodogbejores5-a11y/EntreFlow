import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuotesList } from "@/components/quotes/quotes-list"

export default async function QuotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single()

  const { data: quotes } = await supabase
    .from("quotes")
    .select("*, clients(full_name)")
    .eq("company_id", profile?.company_id)
    .order("created_at", { ascending: false })

  return <QuotesList quotes={quotes || []} />
}
