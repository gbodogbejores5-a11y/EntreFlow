import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmployeesContent } from "@/components/employees/employees-content"

export default async function EmployeesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single()

  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .eq("company_id", profile?.company_id)
    .order("created_at", { ascending: false })

  return <EmployeesContent employees={employees || []} companyId={profile?.company_id || ""} />
}
