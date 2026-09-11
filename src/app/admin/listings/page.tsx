import { Store } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getAdminListings, getClaimRequests } from '@/lib/admin-data'
import { ListingsManager } from '@/components/admin/listings-manager'

export const dynamic = 'force-dynamic'

export default async function AdminListingsPage() {
  const listings = await getAdminListings()
  const claims = await getClaimRequests()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Directory &amp; Listings Hub
            </h1>
            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs font-bold">
              {listings.length} Registered Shops
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Control shop verification badges, featured placements, claim requests, and village categorization.
          </p>
        </div>
      </div>

      {/* Directory & Claims Suite */}
      <ListingsManager
        initialListings={listings}
        initialClaims={claims}
      />
    </div>
  )
}
