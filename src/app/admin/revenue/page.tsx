import { CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  getRevenueTransactions,
  getActiveSubscriptions,
  getExpiringTrials,
  getLiveAds,
} from '@/lib/admin-data'
import { RevenueManager } from '@/components/admin/revenue-manager'

export const dynamic = 'force-dynamic'

export default async function AdminRevenuePage() {
  const transactions = await getRevenueTransactions()
  const subscriptions = await getActiveSubscriptions()
  const trials = await getExpiringTrials()
  const ads = await getLiveAds()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Revenue &amp; Subscriptions
            </h1>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold">
              ₹1.48L Collected
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Track Razorpay payments, ₹49/mo listing subscriptions, expiring 90-day free trials, and 24-hour ad micro-billing.
          </p>
        </div>
      </div>

      {/* Revenue Manager Tabs */}
      <RevenueManager
        initialTransactions={transactions}
        initialSubscriptions={subscriptions}
        initialTrials={trials}
        initialAds={ads}
      />
    </div>
  )
}
