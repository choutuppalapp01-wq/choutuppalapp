'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Send,
  MessageSquare,
  FileText,
  Store,
  Video,
  Home,
  Check,
  X
} from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { PendingContentItem } from '@/lib/admin-data'

interface ModerationTableProps {
  initialItems: PendingContentItem[]
}

export function ModerationTable({ initialItems }: ModerationTableProps) {
  const [items, setItems] = React.useState<PendingContentItem[]>(initialItems)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [filterType, setFilterType] = React.useState<string>('ALL')
  const [filterStatus, setFilterStatus] = React.useState<string>('ALL')
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  // Preview Dialog State
  const [previewItem, setPreviewItem] = React.useState<PendingContentItem | null>(null)

  // Reject Reason Dialog State
  const [rejectingItem, setRejectingItem] = React.useState<PendingContentItem | null>(null)
  const [isBulkReject, setIsBulkReject] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState('')
  const [sendWhatsAppAlert, setSendWhatsAppAlert] = React.useState(true)

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filterType !== 'ALL' && item.type !== filterType) return false
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesTitle = item.title.toLowerCase().includes(q)
      const matchesAuthor = item.authorName.toLowerCase().includes(q)
      const matchesPhone = item.authorPhone.toLowerCase().includes(q)
      const matchesVillage = (item.village || '').toLowerCase().includes(q)
      if (!matchesTitle && !matchesAuthor && !matchesPhone && !matchesVillage) return false
    }
    return true
  })

  // Select all handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredItems.map((i) => i.id))
    } else {
      setSelectedIds([])
    }
  }

  // Toggle single selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Approve single item
  const handleApprove = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'APPROVED' as const } : item
      )
    )
    setSelectedIds((prev) => prev.filter((i) => i !== id))
    toast.success(`"${title.slice(0, 30)}..." Approved!`, {
      description: 'The content is now published live on Choutuppal Super App.',
    })
  }

  // Bulk Approve
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return
    setItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, status: 'APPROVED' as const }
          : item
      )
    )
    const count = selectedIds.length
    setSelectedIds([])
    toast.success(`Bulk Approved ${count} Submissions!`, {
      description: 'All selected items have been marked APPROVED and published.',
    })
  }

  // Open single reject dialog
  const openRejectModal = (item: PendingContentItem) => {
    setRejectingItem(item)
    setIsBulkReject(false)
    setRejectionReason('Incomplete contact details or unverified business address.')
  }

  // Open bulk reject dialog
  const openBulkRejectModal = () => {
    if (selectedIds.length === 0) return
    setIsBulkReject(true)
    setRejectingItem(null)
    setRejectionReason('Does not meet Choutuppal Super App community guidelines.')
  }

  // Confirm Rejection
  const confirmRejection = () => {
    if (isBulkReject) {
      setItems((prev) =>
        prev.map((item) =>
          selectedIds.includes(item.id)
            ? { ...item, status: 'REJECTED' as const, rejectionReason }
            : item
        )
      )
      const count = selectedIds.length
      setSelectedIds([])
      toast.error(`Rejected ${count} Submissions`, {
        description: sendWhatsAppAlert
          ? `WhatsApp & In-App notifications dispatched to ${count} authors.`
          : 'Items marked rejected.',
      })
    } else if (rejectingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === rejectingItem.id
            ? { ...item, status: 'REJECTED' as const, rejectionReason }
            : item
        )
      )
      setSelectedIds((prev) => prev.filter((i) => i !== rejectingItem.id))
      toast.error(`Submission Rejected`, {
        description: sendWhatsAppAlert
          ? `Notification dispatched to ${rejectingItem.authorPhone} with reason: "${rejectionReason}".`
          : `Item ${rejectingItem.id} marked rejected.`,
      })
    }
    setRejectingItem(null)
    setIsBulkReject(false)
  }

  const getTypeIcon = (type: PendingContentItem['type']) => {
    switch (type) {
      case 'LISTING':
        return <Store className="h-4 w-4 text-blue-600" />
      case 'NEWS':
        return <FileText className="h-4 w-4 text-emerald-600" />
      case 'SHORT':
        return <Video className="h-4 w-4 text-purple-600" />
      case 'REAL_ESTATE':
        return <Home className="h-4 w-4 text-amber-600" />
      default:
        return <Store className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            id="moderation-search-input"
            placeholder="Search by title, author, village, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 h-9 text-xs rounded-xl bg-slate-50 border-slate-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['ALL', 'LISTING', 'NEWS', 'SHORT', 'REAL_ESTATE'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === t
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'ALL'
                  ? 'All Types'
                  : t === 'LISTING'
                  ? 'Shops'
                  : t === 'REAL_ESTATE'
                  ? 'Plots'
                  : t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterStatus === s
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BULK ACTIONS BAR (Visible when items are selected) */}
      {selectedIds.length > 0 && (
        <div
          id="moderation-bulk-actions-bar"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 border border-blue-200 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              {selectedIds.length}
            </span>
            <span>Items Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              id="bulk-approve-btn"
              size="sm"
              onClick={handleBulkApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-8.5 gap-1.5 shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Bulk Approve ({selectedIds.length})</span>
            </Button>

            <Button
              id="bulk-reject-btn"
              size="sm"
              variant="outline"
              onClick={openBulkRejectModal}
              className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl h-8.5 gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              <span>Bulk Reject ({selectedIds.length})</span>
            </Button>
          </div>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <Table id="moderation-data-table">
          <TableHeader className="bg-slate-50/75 text-xs">
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={
                    filteredItems.length > 0 &&
                    selectedIds.length === filteredItems.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="font-bold text-slate-700">Submission &amp; Title</TableHead>
              <TableHead className="font-bold text-slate-700">Author / Submitter</TableHead>
              <TableHead className="font-bold text-slate-700">Type</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">Submitted</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100 text-xs">
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No submissions found</p>
                  <p className="text-[11px]">Try adjusting your search or filter parameters.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id)
                return (
                  <TableRow
                    key={item.id}
                    id={`moderation-row-${item.id}`}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(item.id)}
                        aria-label={`Select ${item.title}`}
                      />
                    </TableCell>

                    {/* Title & Preview */}
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-3">
                        {item.thumbnailUrl ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            {getTypeIcon(item.type)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.details || 'No details specified'}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Author / Submitter */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{item.authorName}</span>
                        <span className="text-[11px] text-slate-500">{item.authorPhone}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge variant="outline" className="text-[9px] font-semibold px-1 py-0 h-3.5">
                            {item.authorRole}
                          </Badge>
                          {item.village && (
                            <span className="text-[10px] text-slate-400">&bull; {item.village}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Type Badge */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        {getTypeIcon(item.type)}
                        <span>
                          {item.type === 'LISTING'
                            ? 'Shop Listing'
                            : item.type === 'NEWS'
                            ? 'Local News'
                            : item.type === 'SHORT'
                            ? 'Video Short'
                            : item.type === 'REAL_ESTATE'
                            ? 'Real Estate Plot'
                            : item.type}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {item.status === 'PENDING' && (
                        <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">
                          PENDING
                        </Badge>
                      )}
                      {item.status === 'APPROVED' && (
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                          APPROVED
                        </Badge>
                      )}
                      {item.status === 'REJECTED' && (
                        <Badge className="bg-rose-50 text-rose-800 border-rose-200 text-[10px] font-bold">
                          REJECTED
                        </Badge>
                      )}
                    </TableCell>

                    {/* Submitted At */}
                    <TableCell className="text-slate-500 whitespace-nowrap">
                      {item.submittedAt}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          id={`preview-item-${item.id}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => setPreviewItem(item)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {item.status === 'PENDING' && (
                          <>
                            <Button
                              id={`approve-item-${item.id}`}
                              size="sm"
                              className="h-7.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg px-2.5 gap-1"
                              onClick={() => handleApprove(item.id, item.title)}
                            >
                              <Check className="h-3 w-3" />
                              <span>Approve</span>
                            </Button>

                            <Button
                              id={`reject-item-${item.id}`}
                              size="sm"
                              variant="outline"
                              className="h-7.5 border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold rounded-lg px-2.5 gap-1"
                              onClick={() => openRejectModal(item)}
                            >
                              <X className="h-3 w-3" />
                              <span>Reject</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* SUBMISSION PREVIEW MODAL */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              {previewItem && getTypeIcon(previewItem.type)}
              <Badge variant="outline" className="text-xs font-bold">
                {previewItem?.type}
              </Badge>
              <Badge
                variant={
                  previewItem?.status === 'APPROVED'
                    ? 'default'
                    : previewItem?.status === 'REJECTED'
                    ? 'destructive'
                    : 'secondary'
                }
                className="text-[10px]"
              >
                {previewItem?.status}
              </Badge>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 leading-snug">
              {previewItem?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submitted by {previewItem?.authorName} ({previewItem?.authorPhone}) &bull; {previewItem?.village}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {previewItem?.thumbnailUrl && (
              <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={previewItem.thumbnailUrl}
                  alt={previewItem.title}
                  fill
                  sizes="400px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-700">Submission Description &amp; Details:</span>
              <p className="text-slate-600 leading-relaxed">
                {previewItem?.details || 'No extended text submitted with this record.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Author Role:</span>
                <span className="font-bold text-slate-800">{previewItem?.authorRole}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Village/Town:</span>
                <span className="font-bold text-slate-800">{previewItem?.village}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Submission Timestamp:</span>
                <span className="font-bold text-slate-800">{previewItem?.submittedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Contact Phone:</span>
                <span className="font-bold text-slate-800">{previewItem?.authorPhone}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewItem(null)}
              className="text-xs font-semibold rounded-xl"
            >
              Close
            </Button>
            {previewItem?.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl"
                  onClick={() => {
                    const item = previewItem
                    setPreviewItem(null)
                    openRejectModal(item)
                  }}
                >
                  Reject...
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  onClick={() => {
                    handleApprove(previewItem.id, previewItem.title)
                    setPreviewItem(null)
                  }}
                >
                  Approve Now
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT WITH REASON & NOTIFICATION DIALOG */}
      <Dialog
        open={!!rejectingItem || isBulkReject}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingItem(null)
            setIsBulkReject(false)
          }
        }}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-2">
              <XCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              {isBulkReject
                ? `Bulk Reject ${selectedIds.length} Submissions`
                : `Reject "${rejectingItem?.title.slice(0, 30)}..."`}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Provide a clear reason for the submitter. This will be recorded and optionally sent via WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Rejection Reason</label>
              <Textarea
                id="reject-reason-textarea"
                rows={3}
                placeholder="Explain why this submission was rejected (e.g. invalid photo, copyrighted video, incomplete phone number)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="text-xs rounded-xl border-slate-300"
              />
            </div>

            {/* Quick Reason Snippets */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Quick reasons:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Incomplete business address or phone.',
                  'Blurry/low-resolution photo.',
                  'Duplicate listing already exists.',
                  'Violates community guidelines.',
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setRejectionReason(reason)}
                    className="text-[10px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Send Notification Toggle */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
              <Checkbox
                id="notify-submitter-checkbox"
                checked={sendWhatsAppAlert}
                onCheckedChange={(c) => setSendWhatsAppAlert(!!c)}
              />
              <div className="text-xs">
                <label
                  htmlFor="notify-submitter-checkbox"
                  className="font-bold text-amber-900 block cursor-pointer"
                >
                  Send WhatsApp &amp; In-App Notification
                </label>
                <span className="text-[11px] text-amber-700">
                  Notify author with the rejection explanation immediately.
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectingItem(null)
                setIsBulkReject(false)
              }}
              className="text-xs font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              id="confirm-reject-btn"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              onClick={confirmRejection}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
