import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getAdminUsers, getAgentKycList } from '@/lib/admin-data'
import { UsersManager } from '@/components/admin/users-manager'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await getAdminUsers()
  const kycList = await getAgentKycList()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Users &amp; Agent Network
            </h1>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-bold">
              {users.length} Active Accounts
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Control user permissions, moderation bans, agent KYC onboarding, and field representative authorizations.
          </p>
        </div>
      </div>

      {/* Users and KYC Manager */}
      <UsersManager
        initialUsers={users}
        initialKyc={kycList}
      />
    </div>
  )
}
