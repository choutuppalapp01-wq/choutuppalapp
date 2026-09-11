import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getAffiliateKeywords, getBacklinks } from '@/lib/admin-data'
import { ContentManager } from '@/components/admin/content-manager'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const affiliates = await getAffiliateKeywords()
  const backlinks = await getBacklinks()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Content &amp; CMS Suite
            </h1>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-bold">
              AI Co-Pilot + Affiliate Linker
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Publish bilingual news, manage directory categories, affiliate link cloaking, and regional partner backlinks.
          </p>
        </div>
      </div>

      {/* Content Manager Tabs & Tools */}
      <ContentManager
        initialAffiliates={affiliates}
        initialBacklinks={backlinks}
      />
    </div>
  )
}
