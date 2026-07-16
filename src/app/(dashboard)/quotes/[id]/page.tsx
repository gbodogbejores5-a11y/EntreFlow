import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuoteDetail } from "@/components/quotes/quote-detail"

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("company_id, companies(*)")
    .eq("id", user.id)
    .single()

  const company = Array.isArray(profile?.companies)
    ? profile?.companies[0]
    : profile?.companies

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(*), quote_items(*)")
    .eq("id", id)
    .eq("company_id", profile?.company_id)
    .single()

  if (!quote) redirect("/quotes")

  return <QuoteDetail quote={quote} company={company || null} />
}
