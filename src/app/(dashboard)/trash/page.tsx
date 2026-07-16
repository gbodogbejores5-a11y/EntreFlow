import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TrashContent } from "@/components/trash/trash-content"

export default async function TrashPage() {
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
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false })

  return <TrashContent products={products || []} companyId={profile?.company_id || ""} />
}
