import Link from 'next/link'
import {
  Users,
  Store,
  CreditCard,
  Radio,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  ShoppingBag,
  Eye,
  FileCheck,
  Video
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getAdminStats,
  getRevenueChartData,
  getPendingContent,
  getAdminListings
} from '@/lib/admin-data'
import { DashboardRevenueChart } from '@/components/admin/dashboard-revenue-chart'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()
  const revenueData = await getRevenueChartData()
  const pendingItems = await getPendingContent()
  const listings = await getAdminListings()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Executive Dashboard
            </h1>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold">
              Live Choutuppal Node
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Real-time analytics, revenue subscriptions, and content moderation across 18 villages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/moderation">
            <Button
              id="dash-quick-moderation-btn"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs gap-1.5"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Review Approvals ({stats.pendingApprovalsCount})</span>
            </Button>
          </Link>
          <Link href="/admin/content">
            <Button
              id="dash-new-article-btn"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Write News/Blog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* STAT CARDS (4 Core + 1 Affiliate Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Users */}
        <Card id="stat-card-users" className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Users
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalUsers.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>+{stats.usersTrend}%</span>
              <span className="text-slate-400 font-normal ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Listings */}
        <Card id="stat-card-listings" className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Listings
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Store className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalListings.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>+{stats.listingsTrend}%</span>
              <span className="text-slate-400 font-normal ml-1">394 verified active</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card id="stat-card-revenue" className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>+{stats.revenueTrend}%</span>
              <span className="text-slate-400 font-normal ml-1">Subscriptions + Ads</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Ads & Stories */}
        <Card id="stat-card-active-ads" className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Ads (₹99)
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Radio className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.activeAds}
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-600 font-semibold">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>24h Auto-Expiring Live Ads</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REVENUE 30-DAY CHART & PENDING APPROVALS WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics (2 Columns) */}
        <Card id="admin-revenue-chart-card" className="lg:col-span-2 border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Revenue Breakdown (Last 30 Days)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tracking ₹49 basic listings, ₹99 daily ads/stories, and ₹199 featured badges.
                </CardDescription>
              </div>
              <Link href="/admin/revenue">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 hover:text-blue-700 p-0 h-auto">
                  <span>View All Transactions</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <DashboardRevenueChart data={revenueData} />
          </CardContent>
        </Card>

        {/* PENDING APPROVALS WIDGET (1 Column) */}
        <Card id="admin-pending-approvals-widget" className="border-slate-200/80 shadow-xs bg-white rounded-2xl flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-500" />
                <span>Pending Approvals</span>
              </CardTitle>
              <Badge variant="destructive" className="text-[11px] font-bold px-2 py-0.5">
                {stats.pendingApprovalsCount} Needs Action
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500">
              User &amp; Agent submitted content awaiting admin verification.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 flex-1">
            {/* Breakdown List */}
            <div className="space-y-2">
              <Link
                href="/admin/moderation?type=LISTING"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">New Business Listings</span>
                </div>
                <Badge variant="secondary" className="font-bold text-xs bg-blue-100 text-blue-800">
                  {stats.pendingListingsCount}
                </Badge>
              </Link>

              <Link
                href="/admin/moderation?type=NEWS"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">Local News Submissions</span>
                </div>
                <Badge variant="secondary" className="font-bold text-xs bg-emerald-100 text-emerald-800">
                  {stats.pendingNewsCount}
                </Badge>
              </Link>

              <Link
                href="/admin/moderation?type=SHORT"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Video className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-semibold text-slate-800">Reels &amp; Video Shorts</span>
                </div>
                <Badge variant="secondary" className="font-bold text-xs bg-purple-100 text-purple-800">
                  {stats.pendingShortsCount}
                </Badge>
              </Link>

              <Link
                href="/admin/users?tab=agents"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-slate-800">Agent KYC Verifications</span>
                </div>
                <Badge variant="secondary" className="font-bold text-xs bg-amber-100 text-amber-800">
                  {stats.pendingKycCount}
                </Badge>
              </Link>
            </div>
          </CardContent>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <Link href="/admin/moderation" className="w-full block">
              <Button
                id="widget-open-moderation-queue"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-9.5"
              >
                Open Moderation Queue
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* RECENT SUBMISSIONS & TOP PERFORMING CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pending Submissions Table Preview */}
        <Card id="admin-recent-submissions-card" className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Latest Content in Queue
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Items submitted in the last 24 hours.
              </CardDescription>
            </div>
            <Link href="/admin/moderation">
              <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl h-8">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                    {item.type === 'LISTING' ? 'SHOP' : item.type}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      By <span className="font-semibold text-slate-600">{item.authorName}</span> &bull; {item.village}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <Badge variant="outline" className="text-[10px] font-bold text-amber-600 border-amber-200 bg-amber-50">
                    PENDING
                  </Badge>
                  <span className="text-[10px] text-slate-400 mt-1">{item.submittedAt}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Business Listings in Choutuppal */}
        <Card id="admin-top-performing-card" className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Top Performing Listings
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Highest view counts &amp; WhatsApp click conversion.
              </CardDescription>
            </div>
            <Link href="/admin/listings">
              <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl h-8">
                Directory
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {listings.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.category} &bull; {item.village}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Eye className="h-3 w-3 text-slate-400" />
                      <span>{item.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <MessageSquare className="h-3 w-3" />
                      <span>{item.whatsappClicks} clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* QUICK SYSTEM SHORTCUTS & MONETIZATION BAR */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">Affiliate Engine &amp; Monetization Hub</span>
            <Badge className="bg-amber-400 text-slate-950 font-black text-[10px]">
              ₹12,450 Passive Revenue
            </Badge>
          </div>
          <p className="text-xs text-blue-200 max-w-2xl">
            Auto-keyword link insertion is active across all Choutuppal news articles. Amazon, Flipkart &amp; Agricultural equipment links are generating clicks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/content?tab=affiliate">
            <Button
              id="dash-manage-affiliates-btn"
              className="bg-white text-slate-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs"
            >
              Manage Affiliate Keywords
            </Button>
          </Link>
          <a
            href="https://crm.choutuppal.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              id="dash-launch-crm-btn"
              variant="outline"
              className="border-blue-400/50 text-white hover:bg-white/10 font-bold text-xs rounded-xl"
            >
              Open WhatsApp CRM
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
