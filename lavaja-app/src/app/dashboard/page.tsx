// src/app/dashboard/page.tsx
import { DashboardClient } from "components"

// Esta página é Server Component, mas renderiza um Client Component
export default function DashboardPage() {
  return <DashboardClient />
}