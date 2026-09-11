import { Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getVillages, getSystemPricing } from '@/lib/admin-data'
import { SettingsManager } from '@/components/admin/settings-manager'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const villages = await getVillages()
  const pricing = await getSystemPricing()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              System Settings &amp; Pricing
            </h1>
            <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-xs font-bold">
              18 Villages Configured
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Control local village registry, dynamic micro-subscription rates, free trial windows, and WhatsApp CRM endpoints.
          </p>
        </div>
      </div>

      {/* Settings Manager Suite */}
      <SettingsManager
        initialVillages={villages}
        initialPricing={pricing}
      />
    </div>
  )
}
