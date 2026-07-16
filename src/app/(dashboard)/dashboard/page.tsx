import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default async function DashboardPage() {
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

  const companyId = company?.id || profile?.company_id
  if (!companyId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <h1 className="text-xl font-bold font-[Syne]">Configuration requise</h1>
            <p className="text-[#8A99C2] text-sm">Veuillez d&apos;abord configurer votre entreprise.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <DashboardContent companyId={companyId} />
}
