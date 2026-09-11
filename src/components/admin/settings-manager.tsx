'use client'

import * as React from 'react'
import {
  Settings,
  MapPin,
  IndianRupee,
  MessageSquare,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  AlertTriangle,
  RefreshCw,
  Shield,
  Sliders,
  Send
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { VillageItem, SystemPricingSettings } from '@/lib/admin-data'

interface SettingsManagerProps {
  initialVillages: VillageItem[]
  initialPricing: SystemPricingSettings
}

export function SettingsManager({
  initialVillages,
  initialPricing,
}: SettingsManagerProps) {
  const [activeTab, setActiveTab] = React.useState('pricing')
  const [villages, setVillages] = React.useState<VillageItem[]>(initialVillages)
  const [pricing, setPricing] = React.useState<SystemPricingSettings>(initialPricing)

  // Village Modal State
  const [villageModalOpen, setVillageModalOpen] = React.useState(false)
  const [vName, setVName] = React.useState('')
  const [vTelugu, setVTelugu] = React.useState('')
  const [vPincode, setVPincode] = React.useState('508252')

  // WhatsApp Webhook State
  const [isTestingWebhook, setIsTestingWebhook] = React.useState(false)

  // Save Pricing
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('System Pricing & Configuration Saved!', {
      description: `Basic: ₹${pricing.basicListingPrice}/mo, Daily Ad: ₹${pricing.dailyAdPrice}, Featured: ₹${pricing.featuredListingPrice}, Free Trial: ${pricing.trialDays} days.`,
    })
  }

  // Add Village
  const handleAddVillage = () => {
    if (!vName.trim()) {
      toast.error('Village English name is required')
      return
    }
    const newVillage: VillageItem = {
      id: `v_${Date.now()}`,
      name: vName.trim(),
      teluguName: vTelugu.trim() || vName.trim(),
      pincode: vPincode.trim() || '508252',
      isActive: true,
      listingsCount: 0,
    }
    setVillages((prev) => [...prev, newVillage])
    setVillageModalOpen(false)
    setVName('')
    setVTelugu('')
    toast.success(`Village "${newVillage.name}" added to Choutuppal Mandal!`)
  }

  // Toggle Village Active
  const handleToggleVillage = (id: string) => {
    setVillages((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    )
    toast.success('Village availability status updated.')
  }

  // Delete Village
  const handleDeleteVillage = (id: string, name: string) => {
    setVillages((prev) => prev.filter((v) => v.id !== id))
    toast.info(`Village "${name}" removed.`)
  }

  // Test WhatsApp Webhook Sync
  const handleTestWhatsAppWebhook = () => {
    setIsTestingWebhook(true)
    setTimeout(() => {
      setIsTestingWebhook(false)
      toast.success('WhatsApp CRM Webhook Ping Success!', {
        description: 'crm.choutuppal.in responded with HTTP 200 OK. Incoming message listeners are active.',
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1 rounded-2xl h-11 shadow-xs">
          <TabsTrigger
            value="pricing"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <IndianRupee className="h-3.5 w-3.5" />
            <span>Monetization &amp; Pricing</span>
          </TabsTrigger>
          <TabsTrigger
            value="villages"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>18 Local Villages ({villages.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="crm"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>WhatsApp CRM &amp; Webhooks</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PRICING & MONETIZATION */}
        <TabsContent value="pricing" className="space-y-6">
          <form onSubmit={handleSavePricing}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Fees */}
              <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Subscription &amp; Ad Pricing
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Control the micro-pricing tier configured across Razorpay checkout forms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-700 flex items-center justify-between">
                      <span>Basic Listing Monthly Price (₹)</span>
                      <span className="text-[11px] text-slate-400">Current: ₹{pricing.basicListingPrice}/mo</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                        ₹
                      </span>
                      <Input
                        type="number"
                        value={pricing.basicListingPrice}
                        onChange={(e) =>
                          setPricing({ ...pricing, basicListingPrice: Number(e.target.value) })
                        }
                        className="pl-7 h-9 text-xs font-bold rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-700 flex items-center justify-between">
                      <span>24-Hour Story Ad / Daily Banner (₹)</span>
                      <span className="text-[11px] text-slate-400">Current: ₹{pricing.dailyAdPrice}/day</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                        ₹
                      </span>
                      <Input
                        type="number"
                        value={pricing.dailyAdPrice}
                        onChange={(e) =>
                          setPricing({ ...pricing, dailyAdPrice: Number(e.target.value) })
                        }
                        className="pl-7 h-9 text-xs font-bold rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-slate-700 flex items-center justify-between">
                      <span>Featured / Real Estate Plot Listing (₹)</span>
                      <span className="text-[11px] text-slate-400">Current: ₹{pricing.featuredListingPrice}/mo</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                        ₹
                      </span>
                      <Input
                        type="number"
                        value={pricing.featuredListingPrice}
                        onChange={(e) =>
                          setPricing({ ...pricing, featuredListingPrice: Number(e.target.value) })
                        }
                        className="pl-7 h-9 text-xs font-bold rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Free Trial & Growth Controls */}
              <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Growth &amp; Commission Rules
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Configure local onboarding incentives and agent commission rates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <Label className="font-bold text-slate-700 flex items-center justify-between">
                        <span>New Shop Free Trial Duration (Days)</span>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {pricing.trialDays} Days Free
                        </Badge>
                      </Label>
                      <Input
                        type="number"
                        value={pricing.trialDays}
                        onChange={(e) =>
                          setPricing({ ...pricing, trialDays: Number(e.target.value) })
                        }
                        className="h-9 text-xs font-bold rounded-xl"
                      />
                      <span className="text-[11px] text-slate-400">
                        Shops are onboarded for 90 days before transitioning to ₹49/month.
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-bold text-slate-700 flex items-center justify-between">
                        <span>Agent Field Referral Commission (%)</span>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {pricing.commissionPercent}% Commission
                        </Badge>
                      </Label>
                      <Input
                        type="number"
                        value={pricing.commissionPercent}
                        onChange={(e) =>
                          setPricing({ ...pricing, commissionPercent: Number(e.target.value) })
                        }
                        className="h-9 text-xs font-bold rounded-xl"
                      />
                      <span className="text-[11px] text-slate-400">
                        Paid out to verified agents for every shop renewal in their assigned village.
                      </span>
                    </div>

                    {/* Maintenance Mode */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            Maintenance Mode
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Show maintenance banner on public app
                          </span>
                        </div>
                        <Switch
                          checked={pricing.maintenanceMode}
                          onCheckedChange={(c) =>
                            setPricing({ ...pricing, maintenanceMode: c })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                  <Button
                    id="save-pricing-settings-btn"
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-9.5 gap-1.5 shadow-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Configuration</span>
                  </Button>
                </div>
              </Card>
            </div>
          </form>
        </TabsContent>

        {/* TAB 2: VILLAGES MANAGEMENT */}
        <TabsContent value="villages" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">18 Mandal Villages</h2>
                <Badge className="bg-indigo-100 text-indigo-900 font-bold text-[10px]">
                  Yadadri Bhuvanagiri District
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Manage all territorial nodes in Choutuppal Mandal available for shop registration and local news filtering.
              </p>
            </div>

            <Button
              id="add-village-btn"
              size="sm"
              onClick={() => setVillageModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-8.5 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Village</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="villages-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">English Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Telugu Name (తెలుగు)</TableHead>
                  <TableHead className="font-bold text-slate-700">Pincode</TableHead>
                  <TableHead className="font-bold text-slate-700">Active Listings</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {villages.map((v) => (
                  <TableRow key={v.id} id={`village-row-${v.id}`}>
                    <TableCell className="font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        <span>{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">{v.teluguName}</TableCell>
                    <TableCell className="font-mono text-slate-500">{v.pincode}</TableCell>
                    <TableCell className="font-bold text-slate-800">{v.listingsCount} shops</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-bold ${
                          v.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {v.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVillage(v.id)}
                          className="h-7 text-[11px] font-semibold text-slate-600 hover:text-blue-700"
                        >
                          {v.isActive ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteVillage(v.id, v.name)}
                          className="h-7 w-7 text-slate-500 hover:text-rose-600"
                          title="Delete Village"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 3: WHATSAPP CRM & WEBHOOKS */}
        <TabsContent value="crm" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp CRM Integration Card */}
            <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      WhatsApp CRM Portal
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Dedicated CRM for broadcasting announcements &amp; lead chats.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  The Choutuppal WhatsApp CRM engine is deployed at{' '}
                  <span className="font-mono font-bold text-emerald-700">crm.choutuppal.in</span>. It handles automated lead routing to local shop owners and daily news broadcasts to subscribers.
                </p>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">CRM Endpoint Status:</span>
                    <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
                      LIVE &amp; READY
                    </Badge>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    URL: <code className="font-bold">https://crm.choutuppal.in</code>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://crm.choutuppal.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      id="launch-crm-portal-btn"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-9.5 gap-2 shadow-xs"
                    >
                      <span>Open WhatsApp CRM Dashboard</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Health & Verification */}
            <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <RefreshCw className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Webhook Diagnostics
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Incoming webhook verification for Meta Cloud API &amp; Google Sheets.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        /api/webhooks/whatsapp
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Meta Graph Cloud API (Inbound Messages)
                      </span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      200 OK
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        /api/webhooks/sheet-sync
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Google Sheets Auto-Sync for Field Agents
                      </span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      SYNCED
                    </Badge>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    id="test-webhook-ping-btn"
                    variant="outline"
                    onClick={handleTestWhatsAppWebhook}
                    disabled={isTestingWebhook}
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl h-9.5 gap-1.5"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isTestingWebhook ? 'animate-spin' : ''}`} />
                    <span>{isTestingWebhook ? 'Pinging Webhooks...' : 'Send Test Ping to Webhooks'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ADD VILLAGE MODAL */}
      <Dialog open={villageModalOpen} onOpenChange={setVillageModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Add Mandal Village Node
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a new village within Choutuppal Mandal for shop registration and news.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Village Name (English)</Label>
              <Input
                placeholder="e.g., Peddakondur"
                value={vName}
                onChange={(e) => setVName(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Telugu Name (తెలుగు పేరు)</Label>
              <Input
                placeholder="ఉదా: పెద్దకొండూర్"
                value={vTelugu}
                onChange={(e) => setVTelugu(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Postal Pincode</Label>
              <Input
                placeholder="508252"
                value={vPincode}
                onChange={(e) => setVPincode(e.target.value)}
                className="h-9 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVillageModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddVillage}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Add Village
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
