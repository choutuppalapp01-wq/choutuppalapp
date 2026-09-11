import { redirect } from 'next/navigation'
import { getCurrentUser, isAdminRole } from '@/lib/session'
import { AdminLayoutShell } from '@/components/admin/admin-layout-shell'
import { getAdminStats } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  // Strict RBAC: If logged in but not admin, kick back to user dashboard
  if (currentUser && !isAdminRole(currentUser.role)) {
    redirect('/dashboard?error=admin_required')
  }

  // If unauthenticated:
  // In production, strictly redirect to /login
  if (!currentUser && process.env.NODE_ENV === 'production') {
    redirect('/login?callbackUrl=/admin&reason=admin_required')
  }

  // For testing / AI Studio preview when not logged in, provide administrative session context
  const activeAdminUser = currentUser || {
    id: 'preview_super_admin',
    name: 'Choutuppal Super Admin',
    email: 'admin@choutuppal.in',
    role: 'ADMIN',
    image: null,
  }

  const stats = await getAdminStats()

  return (
    <AdminLayoutShell
      user={activeAdminUser}
      pendingApprovalsCount={stats.pendingApprovalsCount}
    >
      {children}
    </AdminLayoutShell>
  )
}
