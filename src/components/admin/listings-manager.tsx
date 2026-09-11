'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Store,
  Search,
  Filter,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit2,
  FileCheck,
  Phone,
  MapPin,
  Eye,
  MessageSquare,
  ShieldCheck,
  Check,
  X,
  Plus
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
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { AdminListingItem, ClaimRequestItem } from '@/lib/admin-data'

interface ListingsManagerProps {
  initialListings: AdminListingItem[]
  initialClaims: ClaimRequestItem[]
}

export function ListingsManager({
  initialListings,
  initialClaims,
}: ListingsManagerProps) {
  const [activeTab, setActiveTab] = React.useState('directory')
  const [listings, setListings] = React.useState<AdminListingItem[]>(initialListings)
  const [claims, setClaims] = React.useState<ClaimRequestItem[]>(initialClaims)

  // Filters for Directory
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedVillage, setSelectedVillage] = React.useState('ALL')
  const [selectedCategory, setSelectedCategory] = React.useState('ALL')

  // Claim Preview Dialog
  const [previewClaim, setPreviewClaim] = React.useState<ClaimRequestItem | null>(null)

  // Edit Listing Dialog
  const [editingListing, setEditingListing] = React.useState<AdminListingItem | null>(null)
  const [editTitle, setEditTitle] = React.useState('')
  const [editPhone, setEditPhone] = React.useState('')
  const [editVillage, setEditVillage] = React.useState('')
  const [editCategory, setEditCategory] = React.useState('')

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (selectedVillage !== 'ALL' && l.village !== selectedVillage) return false
    if (selectedCategory !== 'ALL' && l.category !== selectedCategory) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesTitle = l.title.toLowerCase().includes(q)
      const matchesOwner = l.ownerName.toLowerCase().includes(q)
      const matchesPhone = l.ownerPhone.toLowerCase().includes(q)
      if (!matchesTitle && !matchesOwner && !matchesPhone) return false
    }
    return true
  })

  // Toggle Featured status
  const handleToggleFeatured = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isFeatured: !l.isFeatured } : l))
    )
    toast.success('Listing featured status updated.')
  }

  // Toggle Verified status
  const handleToggleVerified = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isVerified: !l.isVerified } : l))
    )
    toast.success('Listing verification badge updated.')
  }

  // Delete listing
  const handleDeleteListing = (id: string, title: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
    toast.info(`Listing "${title}" removed from directory.`)
  }

  // Open Edit Listing
  const openEditModal = (item: AdminListingItem) => {
    setEditingListing(item)
    setEditTitle(item.title)
    setEditPhone(item.ownerPhone)
    setEditVillage(item.village)
    setEditCategory(item.category)
  }

  // Save Edit Listing
  const saveListingEdit = () => {
    if (!editingListing) return
    setListings((prev) =>
      prev.map((l) =>
        l.id === editingListing.id
          ? {
              ...l,
              title: editTitle,
              ownerPhone: editPhone,
              village: editVillage,
              category: editCategory,
            }
          : l
      )
    )
    toast.success('Listing details updated.')
    setEditingListing(null)
  }

  // Approve Claim Request
  const handleApproveClaim = (claim: ClaimRequestItem) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claim.id ? { ...c, status: 'APPROVED' as const } : c
      )
    )
    // Update the listing's owner in the listings list
    setListings((prev) =>
      prev.map((l) =>
        l.id === claim.listingId
          ? {
              ...l,
              ownerName: claim.claimerName,
              ownerPhone: claim.claimerPhone,
              isVerified: true,
            }
          : l
      )
    )
    setPreviewClaim(null)
    toast.success(`Claim Approved for "${claim.listingTitle}"!`, {
      description: `Ownership transferred to ${claim.claimerName} (${claim.claimerPhone}). Verification badge awarded.`,
    })
  }

  // Reject Claim Request
  const handleRejectClaim = (claimId: string, title: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId ? { ...c, status: 'REJECTED' as const } : c
      )
    )
    setPreviewClaim(null)
    toast.error(`Claim Rejected for "${title}"`, {
      description: 'The applicant has been notified of missing or invalid business proof.',
    })
  }

  // Extract unique villages & categories
  const villages = Array.from(new Set(listings.map((l) => l.village)))
  const categories = Array.from(new Set(listings.map((l) => l.category)))

  return (
    <div className="space-y-6">
      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1 rounded-2xl h-11 shadow-xs">
          <TabsTrigger
            value="directory"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <Store className="h-3.5 w-3.5" />
            <span>Business Listings ({listings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="claims"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Claim Requests ({claims.filter((c) => c.status === 'PENDING').length} Pending)</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ALL BUSINESS LISTINGS */}
        <TabsContent value="directory" className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                id="listings-search-input"
                placeholder="Search shop, owner, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 h-9 text-xs rounded-xl bg-slate-50 border-slate-200"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Village Filter */}
              <select
                id="listings-filter-village"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Villages ({villages.length})</option>
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                id="listings-filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Listings Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="listings-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Business / Shop Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Owner &amp; Contact</TableHead>
                  <TableHead className="font-bold text-slate-700">Village</TableHead>
                  <TableHead className="font-bold text-slate-700">Category</TableHead>
                  <TableHead className="font-bold text-slate-700">Plan</TableHead>
                  <TableHead className="font-bold text-slate-700 text-center">Featured</TableHead>
                  <TableHead className="font-bold text-slate-700 text-center">Verified</TableHead>
                  <TableHead className="font-bold text-slate-700">Engagement</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id} id={`listing-row-${listing.id}`}>
                    {/* Business Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          {listing.image ? (
                            <Image
                              src={listing.image}
                              alt={listing.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Store className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{listing.title}</p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /{listing.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Owner & Phone */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{listing.ownerName}</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {listing.ownerPhone}
                        </span>
                      </div>
                    </TableCell>

                    {/* Village */}
                    <TableCell>
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{listing.village}</span>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {listing.category}
                      </Badge>
                    </TableCell>

                    {/* Plan */}
                    <TableCell>
                      <Badge
                        variant={
                          listing.plan === 'FEATURED'
                            ? 'default'
                            : listing.plan === 'TRIAL'
                            ? 'outline'
                            : 'secondary'
                        }
                        className={`text-[10px] font-bold ${
                          listing.plan === 'FEATURED' ? 'bg-amber-600' : ''
                        }`}
                      >
                        {listing.plan}
                      </Badge>
                    </TableCell>

                    {/* Featured Toggle */}
                    <TableCell className="text-center">
                      <Switch
                        checked={listing.isFeatured}
                        onCheckedChange={() => handleToggleFeatured(listing.id)}
                      />
                    </TableCell>

                    {/* Verified Toggle */}
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleVerified(listing.id)}
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full transition-colors ${
                          listing.isVerified
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                        title={listing.isVerified ? 'Verified Listing' : 'Unverified Listing'}
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </button>
                    </TableCell>

                    {/* Engagement */}
                    <TableCell>
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-800">{listing.views}</span>{' '}
                        <span className="text-slate-400">views</span> &bull;{' '}
                        <span className="font-bold text-emerald-600">{listing.whatsappClicks}</span>{' WA'}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-blue-600"
                          onClick={() => openEditModal(listing)}
                          title="Edit Listing"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Link href={`/directory/${listing.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-blue-600"
                            title="View on site"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-rose-600"
                          onClick={() => handleDeleteListing(listing.id, listing.title)}
                          title="Delete"
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

        {/* TAB 2: CLAIM REQUESTS */}
        <TabsContent value="claims" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Shop Ownership Claims</h2>
                <Badge className="bg-amber-100 text-amber-900 font-bold text-[10px]">
                  Requires Verification
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Business owners requesting ownership of auto-generated or unclaimed shops in Choutuppal.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="claims-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Claimant Owner</TableHead>
                  <TableHead className="font-bold text-slate-700">Phone Number</TableHead>
                  <TableHead className="font-bold text-slate-700">Target Business Listing</TableHead>
                  <TableHead className="font-bold text-slate-700">Proof Document</TableHead>
                  <TableHead className="font-bold text-slate-700">Date Claimed</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {claims.map((claim) => (
                  <TableRow key={claim.id} id={`claim-row-${claim.id}`}>
                    <TableCell className="font-bold text-slate-900">
                      {claim.claimerName}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {claim.claimerPhone}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5 text-blue-600" />
                        <span className="font-bold text-slate-900">{claim.listingTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewClaim(claim)}
                        className="h-7 text-[11px] font-semibold rounded-lg gap-1 border-slate-300"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect Proof ({claim.proofType})</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-slate-500">{claim.submittedAt}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-bold ${
                          claim.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {claim.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg h-7 px-2 gap-1"
                            onClick={() => handleApproveClaim(claim)}
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold rounded-lg h-7 px-2 gap-1"
                            onClick={() => handleRejectClaim(claim.id, claim.listingTitle)}
                          >
                            <X className="h-3 w-3" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* CLAIM PROOF INSPECT DIALOG */}
      <Dialog open={!!previewClaim} onOpenChange={(o) => !o && setPreviewClaim(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Claim Verification: {previewClaim?.listingTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submitted by {previewClaim?.claimerName} ({previewClaim?.claimerPhone})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {previewClaim?.proofUrl && (
                <Image
                  src={previewClaim.proofUrl}
                  alt="Business Proof Document"
                  fill
                  sizes="400px"
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Proof Document Type:</span>
                <span className="font-bold text-slate-800">{previewClaim?.proofType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Claimant Full Name:</span>
                <span className="font-bold text-slate-800">{previewClaim?.claimerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Claimant Mobile:</span>
                <span className="font-bold text-slate-800">{previewClaim?.claimerPhone}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewClaim(null)}
              className="text-xs rounded-xl"
            >
              Close
            </Button>
            {previewClaim?.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl"
                  onClick={() => handleRejectClaim(previewClaim.id, previewClaim.listingTitle)}
                >
                  Reject Claim
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  onClick={() => handleApproveClaim(previewClaim)}
                >
                  Approve Ownership
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT LISTING DIALOG */}
      <Dialog open={!!editingListing} onOpenChange={(o) => !o && setEditingListing(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Edit Business Listing
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Modify basic metadata for this local shop in the directory.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Business Name</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Owner Contact Phone</label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="h-9 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Village Location</label>
                <Input
                  value={editVillage}
                  onChange={(e) => setEditVillage(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <Input
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingListing(null)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={saveListingEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
