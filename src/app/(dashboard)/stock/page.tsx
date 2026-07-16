import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StockContent } from "@/components/stock/stock-content"

export default async function StockPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("company_id", profile?.company_id)
    .order("created_at", { ascending: false })

  return <StockContent products={products || []} companyId={profile?.company_id || ""} />
}
