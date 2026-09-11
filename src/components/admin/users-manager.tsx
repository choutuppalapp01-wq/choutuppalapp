'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserX,
  UserCheck,
  Eye,
  Check,
  X,
  LogIn,
  MapPin,
  FileCheck,
  Briefcase,
  AlertCircle
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { AdminUserItem, AgentKycItem } from '@/lib/admin-data'

interface UsersManagerProps {
  initialUsers: AdminUserItem[]
  initialKyc: AgentKycItem[]
}

export function UsersManager({ initialUsers, initialKyc }: UsersManagerProps) {
  const [activeTab, setActiveTab] = React.useState('users')
  const [users, setUsers] = React.useState<AdminUserItem[]>(initialUsers)
  const [kycList, setKycList] = React.useState<AgentKycItem[]>(initialKyc)

  // User filters
  const [searchQuery, setSearchQuery] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState('ALL')
  const [statusFilter, setStatusFilter] = React.useState('ALL')

  // KYC Preview
  const [previewKyc, setPreviewKyc] = React.useState<AgentKycItem | null>(null)

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesName = u.name.toLowerCase().includes(q)
      const matchesPhone = u.phone.toLowerCase().includes(q)
      const matchesVillage = (u.village || '').toLowerCase().includes(q)
      if (!matchesName && !matchesPhone && !matchesVillage) return false
    }
    return true
  })

  // Change Role
  const handleRoleChange = (userId: string, newRole: AdminUserItem['role']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    )
    toast.success(`User role updated to ${newRole}`)
  }

  // Toggle Ban / Unban
  const handleToggleBan = (user: AdminUserItem) => {
    const nextStatus = user.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    )
    if (nextStatus === 'BANNED') {
      toast.error(`User ${user.name} has been BANNED from Choutuppal Super App.`)
    } else {
      toast.success(`User ${user.name} has been UNBANNED.`)
    }
  }

  // Impersonate User
  const handleImpersonate = (user: AdminUserItem) => {
    toast.info(`Simulating impersonation session for ${user.name}...`, {
      description: `Switching context to ${user.phone} (${user.role}). You can revert back anytime from the admin bar.`,
    })
  }

  // Approve Agent KYC
  const handleApproveKyc = (item: AgentKycItem) => {
    setKycList((prev) =>
      prev.map((k) =>
        k.id === item.id ? { ...k, status: 'APPROVED' as const } : k
      )
    )
    // Promote user in Users table if matching phone
    setUsers((prev) =>
      prev.map((u) =>
        u.phone === item.phone ? { ...u, role: 'AGENT' as const } : u
      )
    )
    setPreviewKyc(null)
    toast.success(`Agent KYC Approved for ${item.name}!`, {
      description: `User role upgraded to AGENT. Field onboarding & 20% commission rights unlocked.`,
    })
  }

  // Reject Agent KYC
  const handleRejectKyc = (item: AgentKycItem) => {
    setKycList((prev) =>
      prev.map((k) =>
        k.id === item.id ? { ...k, status: 'REJECTED' as const } : k
      )
    )
    setPreviewKyc(null)
    toast.error(`Agent KYC Rejected for ${item.name}`, {
      description: 'Document does not match government records or was blurry.',
    })
  }

  return (
    <div className="space-y-6">
      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1 rounded-2xl h-11 shadow-xs">
          <TabsTrigger
            value="users"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            <span>All Users ({users.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="kyc"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Agent KYC Applications ({kycList.filter((k) => k.status === 'PENDING').length} Pending)</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ALL USERS */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                id="users-search-input"
                placeholder="Search user name, phone, village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 h-9 text-xs rounded-xl bg-slate-50 border-slate-200"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Role filter */}
              <select
                id="users-filter-role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Roles</option>
                <option value="USER">Citizen / User</option>
                <option value="BUSINESS">Shop Owner</option>
                <option value="AGENT">Village Agent</option>
                <option value="ADMIN">Administrator</option>
              </select>

              {/* Status filter */}
              <select
                id="users-filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BANNED">Banned</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="users-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">User Profile</TableHead>
                  <TableHead className="font-bold text-slate-700">Phone &amp; Location</TableHead>
                  <TableHead className="font-bold text-slate-700">Role</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="font-bold text-slate-700">Activity Stats</TableHead>
                  <TableHead className="font-bold text-slate-700">Joined Date</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} id={`user-row-${user.id}`}>
                    {/* User profile */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-800 font-bold text-xs">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{user.name}</p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {user.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Phone & Location */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{user.phone}</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{user.village || 'Choutuppal'}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role Dropdown */}
                    <TableCell>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as AdminUserItem['role'])
                        }
                        className={`h-7 px-2 rounded-lg border text-xs font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : user.role === 'AGENT'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : user.role === 'BUSINESS'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="USER">USER</option>
                        <option value="BUSINESS">BUSINESS</option>
                        <option value="AGENT">AGENT</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>

                    {/* Activity */}
                    <TableCell>
                      <div className="text-[11px] text-slate-600">
                        <span>{user.listingsCount} listings</span> &bull;{' '}
                        <span>{user.postsCount} news</span>
                      </div>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-slate-500 whitespace-nowrap">
                      {user.createdAt}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Impersonate */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleImpersonate(user)}
                          className="h-7 text-[11px] font-bold text-slate-600 hover:text-blue-700 gap-1 px-2"
                          title="Login as user"
                        >
                          <LogIn className="h-3 w-3" />
                          <span className="hidden sm:inline">Impersonate</span>
                        </Button>

                        {/* Ban / Unban */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleBan(user)}
                          className={`h-7 text-[11px] font-bold gap-1 px-2 ${
                            user.status === 'BANNED'
                              ? 'text-emerald-700 hover:bg-emerald-50'
                              : 'text-rose-700 hover:bg-rose-50'
                          }`}
                        >
                          {user.status === 'BANNED' ? (
                            <>
                              <UserCheck className="h-3 w-3" />
                              <span>Unban</span>
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3" />
                              <span>Ban</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 2: AGENT KYC APPLICATIONS */}
        <TabsContent value="kyc" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Agent Field Onboarding &amp; KYC</h2>
                <Badge className="bg-amber-100 text-amber-900 font-bold text-[10px]">
                  20% Referral Commission
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Review government identity proofs of local field representatives onboarding shops in Choutuppal villages.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="kyc-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Agent Candidate</TableHead>
                  <TableHead className="font-bold text-slate-700">Phone</TableHead>
                  <TableHead className="font-bold text-slate-700">Village Territory</TableHead>
                  <TableHead className="font-bold text-slate-700">Govt ID Proof</TableHead>
                  <TableHead className="font-bold text-slate-700">Applied Date</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-xs">
                {kycList.map((item) => (
                  <TableRow key={item.id} id={`kyc-row-${item.id}`}>
                    <TableCell className="font-bold text-slate-900">
                      {item.name}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {item.phone}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-700 font-semibold">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{item.village}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewKyc(item)}
                        className="h-7 text-[11px] font-semibold rounded-lg gap-1 border-slate-300"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect {item.documentType}</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-slate-500">{item.submittedAt}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-bold ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg h-7 px-2 gap-1"
                            onClick={() => handleApproveKyc(item)}
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve Agent</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold rounded-lg h-7 px-2 gap-1"
                            onClick={() => handleRejectKyc(item)}
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

      {/* KYC PREVIEW DIALOG */}
      <Dialog open={!!previewKyc} onOpenChange={(o) => !o && setPreviewKyc(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Agent KYC: {previewKyc?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Mobile: {previewKyc?.phone} &bull; Territory: {previewKyc?.village}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {previewKyc?.documentUrl && (
                <Image
                  src={previewKyc.documentUrl}
                  alt="Government ID Proof"
                  fill
                  sizes="400px"
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">ID Document Type:</span>
                <span className="font-bold text-slate-800">{previewKyc?.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate Full Name:</span>
                <span className="font-bold text-slate-800">{previewKyc?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Mandal Village:</span>
                <span className="font-bold text-slate-800">{previewKyc?.village}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewKyc(null)}
              className="text-xs rounded-xl"
            >
              Close
            </Button>
            {previewKyc?.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl"
                  onClick={() => handleRejectKyc(previewKyc)}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  onClick={() => handleApproveKyc(previewKyc)}
                >
                  Approve Agent
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
