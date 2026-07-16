export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050A1A] p-4">
      {children}
    </div>
  )
}
