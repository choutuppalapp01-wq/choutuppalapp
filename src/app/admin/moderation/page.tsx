import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getPendingContent } from '@/lib/admin-data'
import { ModerationTable } from '@/components/admin/moderation-table'

export const dynamic = 'force-dynamic'

export default async function AdminModerationPage() {
  const pendingContent = await getPendingContent()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Moderation Queue
            </h1>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-bold">
              {pendingContent.filter((i) => i.status === 'PENDING').length} Pending
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Review, verify, approve, or reject user and agent submissions before they go live in Choutuppal.
          </p>
        </div>
      </div>

      {/* Moderation Table */}
      <ModerationTable initialItems={pendingContent} />
    </div>
  )
}
