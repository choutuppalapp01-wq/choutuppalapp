'use client'

import * as React from 'react'
import {
  CreditCard,
  IndianRupee,
  Calendar,
  AlertTriangle,
  Clock,
  Radio,
  Send,
  Download,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Store,
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  RevenueTransactionItem,
  ActiveSubscriptionItem,
  ExpiringTrialItem,
  LiveAdItem,
} from '@/lib/admin-data'

interface RevenueManagerProps {
  initialTransactions: RevenueTransactionItem[]
  initialSubscriptions: ActiveSubscriptionItem[]
  initialTrials: ExpiringTrialItem[]
  initialAds: LiveAdItem[]
}

export function RevenueManager({
  initialTransactions,
  initialSubscriptions,
  initialTrials,
  initialAds,
}: RevenueManagerProps) {
  const [activeTab, setActiveTab] = React.useState('transactions')
  const [transactions, setTransactions] = React.useState<RevenueTransactionItem[]>(initialTransactions)
  const [subscriptions, setSubscriptions] = React.useState<ActiveSubscriptionItem[]>(initialSubscriptions)
  const [trials, setTrials] = React.useState<ExpiringTrialItem[]>(initialTrials)
  const [ads, setAds] = React.useState<LiveAdItem[]>(initialAds)

  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      t.shopName.toLowerCase().includes(q) ||
      t.paymentId.toLowerCase().includes(q) ||
      t.customerPhone.toLowerCase().includes(q)
    )
  })

  // Send WhatsApp renewal reminder
  const handleSendReminder = (trial: ExpiringTrialItem) => {
    setTrials((prev) =>
      prev.map((t) =>
        t.id === trial.id
          ? { ...t, reminderSent: true }
          : t
      )
    )
    toast.success(`WhatsApp Renewal Reminder Sent to ${trial.shopName}!`, {
      description: `Dispatched message to ${trial.ownerPhone}: "Your 90-day free trial on Choutuppal Super App ends in ${trial.daysRemaining} days. Continue for ₹49/month."`,
    })
  }

  // Cancel subscription
  const handleCancelSubscription = (sub: ActiveSubscriptionItem) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, autoRenew: false } : s))
    )
    toast.info(`Auto-renew cancelled for ${sub.shopName}.`)
  }

  // Calculate totals
  const totalRevenue = transactions
    .filter((t) => t.status === 'CAPTURED')
    .reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="space-y-6">
      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Captured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Razorpay Gateway Active
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Paid Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {subscriptions.length} Shops
            </div>
            <p className="text-xs text-blue-600 font-semibold mt-1">
              ₹49 / ₹199 monthly recurring
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Expiring Free Trials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600">
              {trials.length} Shops
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Ending 90-day free window
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Daily Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-indigo-600">
              {ads.length} Live
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              24-hour micro-billing (₹99)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1 rounded-2xl h-11 shadow-xs">
          <TabsTrigger
            value="transactions"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Razorpay Logs ({transactions.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Active Subscriptions ({subscriptions.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="trials"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Expiring 90d Trials ({trials.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="ads"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>24h Ad Inventory ({ads.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: RAZORPAY TRANSACTIONS */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search payment ID, shop name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 h-9 text-xs rounded-xl bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold">
                Razorpay Live Mode
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="transactions-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Payment ID</TableHead>
                  <TableHead className="font-bold text-slate-700">Shop / Customer</TableHead>
                  <TableHead className="font-bold text-slate-700">Plan / Purchase</TableHead>
                  <TableHead className="font-bold text-slate-700">Amount</TableHead>
                  <TableHead className="font-bold text-slate-700">Gateway Status</TableHead>
                  <TableHead className="font-bold text-slate-700">Timestamp</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Receipt</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} id={`tx-row-${tx.id}`}>
                    <TableCell className="font-mono font-bold text-blue-700">
                      {tx.paymentId}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{tx.shopName}</span>
                        <span className="text-[11px] text-slate-500">{tx.customerPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {tx.planType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-slate-900 text-sm">
                      ₹{tx.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-bold ${
                          tx.status === 'CAPTURED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 whitespace-nowrap">{tx.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info(`Receipt for ${tx.paymentId} downloaded.`)}
                        className="h-7 text-[11px] font-semibold text-slate-600 hover:text-blue-700 gap-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Invoice</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 2: ACTIVE SUBSCRIPTIONS */}
        <TabsContent value="subscriptions" className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="subscriptions-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Shop Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Plan</TableHead>
                  <TableHead className="font-bold text-slate-700">Monthly Rate</TableHead>
                  <TableHead className="font-bold text-slate-700">Started</TableHead>
                  <TableHead className="font-bold text-slate-700">Next Renewal</TableHead>
                  <TableHead className="font-bold text-slate-700">Auto Renew</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-bold text-slate-900">{sub.shopName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {sub.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600">₹{sub.amount}/mo</TableCell>
                    <TableCell className="text-slate-500">{sub.startedAt}</TableCell>
                    <TableCell className="font-semibold text-slate-800">{sub.nextRenewal}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-bold ${
                          sub.autoRenew
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sub.autoRenew ? 'ACTIVE' : 'OFF'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {sub.autoRenew && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelSubscription(sub)}
                          className="h-7 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 3: EXPIRING 90-DAY TRIALS */}
        <TabsContent value="trials" className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-900">
                  Automated 3-Month Free Trial Conversion
                </h3>
                <p className="text-[11px] text-amber-700">
                  New shops receive 90 days of free onboarding. Trigger 1-click WhatsApp alerts before conversion to ₹49/mo.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="trials-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Business Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Owner Contact</TableHead>
                  <TableHead className="font-bold text-slate-700">Village</TableHead>
                  <TableHead className="font-bold text-slate-700">Days Remaining</TableHead>
                  <TableHead className="font-bold text-slate-700">Trial Expiry</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Conversion Trigger</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {trials.map((trial) => (
                  <TableRow key={trial.id}>
                    <TableCell className="font-bold text-slate-900">{trial.shopName}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{trial.ownerPhone}</TableCell>
                    <TableCell className="text-slate-600">{trial.village}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          trial.daysRemaining <= 5
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {trial.daysRemaining} Days Left
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">{trial.expiryDate}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSendReminder(trial)}
                        disabled={trial.reminderSent}
                        className={`h-7.5 text-[11px] font-bold rounded-xl gap-1.5 shadow-xs ${
                          trial.reminderSent
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>{trial.reminderSent ? 'Reminder Sent' : 'Send WhatsApp (₹49)'}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 4: 24-HOUR ADS & STORIES INVENTORY */}
        <TabsContent value="ads" className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="ads-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Ad Campaign / Headline</TableHead>
                  <TableHead className="font-bold text-slate-700">Advertiser Shop</TableHead>
                  <TableHead className="font-bold text-slate-700">Format</TableHead>
                  <TableHead className="font-bold text-slate-700">Time Left</TableHead>
                  <TableHead className="font-bold text-slate-700">Impressions</TableHead>
                  <TableHead className="font-bold text-slate-700">WhatsApp Clicks</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Paid Fee</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-bold text-slate-900">{ad.title}</TableCell>
                    <TableCell className="text-slate-700 font-semibold">{ad.advertiser}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {ad.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-700 font-mono font-bold text-xs">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>{ad.hoursLeft}h remaining</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">{ad.impressions.toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-emerald-600">{ad.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-black text-slate-900">₹{ad.pricePaid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
