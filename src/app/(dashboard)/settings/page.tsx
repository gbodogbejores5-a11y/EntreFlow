import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsContent } from "@/components/dashboard/settings-content"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("*, companies(*)")
    .eq("id", user.id)
    .single()

  const company = Array.isArray(profile?.companies)
    ? profile?.companies?.[0]
    : profile?.companies

  return (
    <SettingsContent
      company={company || null}
      user={profile || null}
    />
  )
}
