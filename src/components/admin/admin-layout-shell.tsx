'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  Store,
  Users,
  CreditCard,
  Settings,
  ExternalLink,
  Search,
  Bell,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Radio,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { signOut } from 'next-auth/react'

interface AdminUserSession {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
  image?: string | null
}

interface AdminLayoutShellProps {
  children: React.ReactNode
  user: AdminUserSession
  pendingApprovalsCount?: number
}

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    aliases: ['/admin'],
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Moderation Queue',
    href: '/admin/moderation',
    aliases: [],
    icon: ShieldCheck,
    badge: '14 New',
    badgeVariant: 'destructive' as const,
  },
  {
    name: 'Content & CMS',
    href: '/admin/content',
    aliases: [],
    icon: FileText,
    badge: 'Affiliate',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'Directory & Listings',
    href: '/admin/listings',
    aliases: [],
    icon: Store,
    badge: '2 Claims',
    badgeVariant: 'outline' as const,
  },
  {
    name: 'Users & Agents',
    href: '/admin/users',
    aliases: [],
    icon: Users,
    badge: 'KYC',
    badgeVariant: 'outline' as const,
  },
  {
    name: 'Revenue & Plans',
    href: '/admin/revenue',
    aliases: [],
    icon: CreditCard,
    badge: '₹1.48L',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    aliases: [],
    icon: Settings,
    badge: '18 Villages',
    badgeVariant: 'outline' as const,
  },
]

export function AdminLayoutShell({
  children,
  user,
  pendingApprovalsCount = 14,
}: AdminLayoutShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (pathname === item.href) return true
    if (item.aliases.includes(pathname)) return true
    if (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) return true
    return false
  }

  // Handle global search jump
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const q = searchQuery.toLowerCase().trim()
    if (q.includes('list') || q.includes('shop')) {
      router.push(`/admin/listings?search=${encodeURIComponent(q)}`)
    } else if (q.includes('user') || q.includes('agent')) {
      router.push(`/admin/users?search=${encodeURIComponent(q)}`)
    } else if (q.includes('rev') || q.includes('pay')) {
      router.push('/admin/revenue')
    } else if (q.includes('mod') || q.includes('pend')) {
      router.push('/admin/moderation')
    } else {
      router.push(`/admin/content?search=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50/75 text-slate-900 font-sans antialiased">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Desktop First) */}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between border-b border-slate-100 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white shadow-md shadow-blue-500/15">
              <span className="font-black text-lg tracking-tight">CP</span>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Choutuppal
                </span>
                <Badge variant="secondary" className="text-[10px] font-bold px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
                  ADMIN
                </Badge>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                admin.choutuppal.in
              </span>
            </div>
          </Link>
          <button
            id="close-mobile-sidebar"
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tenant / Hub Quick Switcher Indicator */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Active Zone</span>
            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>Choutuppal Mandal (18 Villages)</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Control Center
          </div>

          {NAV_ITEMS.map((item) => {
            const active = isActive(item)
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                id={`admin-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant}
                    className={`text-[10px] px-1.5 py-0 h-4.5 font-bold ${
                      active
                        ? 'bg-white/20 text-white border-transparent'
                        : item.badgeVariant === 'destructive'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : ''
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Hubs
          </div>

          <a
            href="https://crm.choutuppal.in"
            target="_blank"
            rel="noopener noreferrer"
            id="admin-link-whatsapp-crm"
            className="flex items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span>WhatsApp CRM</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>

          <Link
            href="/"
            target="_blank"
            id="admin-link-view-site-sidebar"
            className="flex items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="h-4 w-4 text-slate-400" />
              <span>Live Public App</span>
            </div>
            <span className="text-[11px] text-slate-400">choutuppal.in</span>
          </Link>
        </div>

        {/* Sidebar Footer — System Status & Admin Profile */}
        <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/40">
          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-700">Cluster Status</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Healthy (v2.0)</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs uppercase shadow-inner">
                {user.name ? user.name.slice(0, 2) : 'AD'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {user.name || 'Super Admin'}
                </span>
                <span className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase">
                  {user.role || 'SUPER_ADMIN'}
                </span>
              </div>
            </div>
            <Button
              id="admin-logout-btn-sidebar"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* TOP HEADER */}
        <header
          id="admin-top-header"
          className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md"
        >
          <div className="flex items-center gap-4">
            <button
              id="open-mobile-sidebar"
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Info */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Admin</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="font-bold text-slate-900 capitalize">
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>

            {/* Quick Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block w-72 lg:w-84">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                id="admin-global-search"
                type="search"
                placeholder="Search shops, users, news, revenue... (Enter)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-3 text-xs rounded-xl bg-slate-100/70 border-slate-200 focus:bg-white transition-colors"
              />
            </form>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Pending Approvals Quick Pill */}
            <Link href="/admin/moderation">
              <Button
                id="header-pending-queue-btn"
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-1.5 h-8.5 rounded-xl border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100 text-xs font-semibold"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>{pendingApprovalsCount} Approvals Pending</span>
              </Button>
            </Link>

            {/* "View on Site" Primary Action */}
            <Link href="/" target="_blank">
              <Button
                id="header-view-on-site-btn"
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-8.5 rounded-xl border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                <span className="hidden sm:inline">View on Site</span>
                <span className="sm:hidden">Site</span>
              </Button>
            </Link>

            {/* WhatsApp CRM Shortcut */}
            <a href="https://crm.choutuppal.in" target="_blank" rel="noopener noreferrer">
              <Button
                id="header-whatsapp-crm-btn"
                size="sm"
                className="hidden lg:flex items-center gap-1.5 h-8.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp CRM</span>
              </Button>
            </a>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="admin-profile-menu-trigger"
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 focus:outline-hidden"
                >
                  <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white text-xs font-black shadow-xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user.name || 'Admin'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-tight">
                      {user.email || 'admin@choutuppal.in'}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-bold text-slate-900 leading-none">{user.name || 'Admin User'}</p>
                    <p className="text-[11px] text-slate-500 leading-none">{user.email || 'admin@choutuppal.in'}</p>
                    <div className="pt-1">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] font-bold">
                        {user.role || 'SUPER_ADMIN'}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="cursor-pointer text-xs font-medium">
                    <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-slate-400" />
                    Admin Overview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer text-xs font-medium">
                    <Settings className="mr-2 h-3.5 w-3.5 text-slate-400" />
                    System Settings &amp; Pricing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer text-xs font-medium">
                    <UserCheck className="mr-2 h-3.5 w-3.5 text-slate-400" />
                    User Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="cursor-pointer text-xs font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
