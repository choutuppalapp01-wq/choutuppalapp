import { prisma, safeDbQuery } from '@/lib/prisma'

export interface AdminStats {
  totalUsers: number
  usersTrend: number
  totalListings: number
  listingsTrend: number
  totalRevenue: number
  revenueTrend: number
  activeAds: number
  adsTrend: number
  affiliateEarnings: number
  pendingApprovalsCount: number
  pendingListingsCount: number
  pendingNewsCount: number
  pendingShortsCount: number
  pendingKycCount: number
}

export interface RevenueDataPoint {
  date: string
  subscriptions: number
  dailyAds: number
  featured: number
  total: number
}

export interface PendingContentItem {
  id: string
  title: string
  type: 'LISTING' | 'NEWS' | 'SHORT' | 'STORY' | 'REAL_ESTATE'
  authorName: string
  authorPhone: string
  authorRole: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: string
  details?: string
  thumbnailUrl?: string
  village?: string
  rejectionReason?: string
}

export interface AdminListingItem {
  id: string
  slug: string
  title: string
  category: string
  village: string
  ownerName: string
  ownerPhone: string
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED'
  isFeatured: boolean
  isPremium: boolean
  views: number
  whatsappClicks: number
  planTier: string
  expiresAt: string
  createdAt: string
}

export interface ClaimRequestItem {
  id: string
  listingId: string
  listingTitle: string
  claimantName: string
  claimantPhone: string
  claimantEmail?: string
  businessProofUrl?: string
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  submittedAt: string
  notes?: string
}

export interface AdminUserItem {
  id: string
  name: string
  email: string
  phone?: string
  role: 'USER' | 'AGENT' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
  village?: string
  planTier: string
  listingsCount: number
  isBanned: boolean
  createdAt: string
  lastActive: string
}

export interface AgentKycItem {
  id: string
  userId: string
  name: string
  phone: string
  agentCode: string
  village: string
  mandal: string
  idCardUrl: string
  addressProofUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  onboardedListings: number
  leadsGenerated: number
  commissionEarned: number
  submittedAt: string
}

export interface TransactionItem {
  id: string
  transactionId: string
  businessName: string
  userPhone: string
  amount: number
  planType: 'MONTHLY_LISTING' | 'DAILY_AD' | 'FEATURED_BADGE' | 'REAL_ESTATE'
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
  paymentGateway: 'RAZORPAY' | 'UPI'
  date: string
}

export interface SubscriptionItem {
  id: string
  businessName: string
  ownerPhone: string
  plan: 'BASIC_49' | 'PREMIUM_199'
  amount: number
  renewalDate: string
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRING'
  autoDebit: boolean
}

export interface ExpiringTrialItem {
  id: string
  businessName: string
  ownerName: string
  ownerPhone: string
  village: string
  startDate: string
  expiryDate: string
  daysRemaining: number
  whatsappReminderSent: boolean
}

export interface AdInventoryItem {
  id: string
  type: 'STORY_AD' | 'BANNER_HOME' | 'SHORTS_FEATURE'
  title: string
  ownerPhone: string
  amountPaid: number
  startedAt: string
  expiresAt: string
  hoursRemaining: number
  views: number
  clicks: number
  isActive: boolean
}

export interface VillageItem {
  id: string
  name: string
  teluguName: string
  pincode: string
  listingCount: number
  agentCount: number
  isActive: boolean
}

export interface PricingRule {
  monthlyListingFee: number
  dailyAdFee: number
  featuredListingFee: number
  freeTrialDays: number
  agentCommissionPercent: number
}

export interface AffiliateKeywordItem {
  id: string
  keyword: string
  targetUrl: string
  cloakedSlug: string
  clicks: number
  earningsEst: number
  category: string
  isActive: boolean
  lastUpdated: string
}

export interface BacklinkItem {
  id: string
  partnerSite: string
  partnerUrl: string
  ourTargetUrl: string
  anchorText: string
  status: 'ACTIVE' | 'PENDING' | 'BROKEN'
  lastChecked: string
  daScore: number
}

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 2845,
  usersTrend: 14.8,
  totalListings: 428,
  listingsTrend: 9.2,
  totalRevenue: 148250,
  revenueTrend: 22.4,
  activeAds: 34,
  adsTrend: 5.1,
  affiliateEarnings: 12450,
  pendingApprovalsCount: 14,
  pendingListingsCount: 5,
  pendingNewsCount: 3,
  pendingShortsCount: 4,
  pendingKycCount: 2,
}

export const MOCK_REVENUE_CHART: RevenueDataPoint[] = [
  { date: 'Aug 12', subscriptions: 1800, dailyAds: 693, featured: 796, total: 3289 },
  { date: 'Aug 15', subscriptions: 2450, dailyAds: 891, featured: 995, total: 4336 },
  { date: 'Aug 18', subscriptions: 3100, dailyAds: 1089, featured: 1194, total: 5383 },
  { date: 'Aug 21', subscriptions: 2900, dailyAds: 1287, featured: 1393, total: 5580 },
  { date: 'Aug 24', subscriptions: 3800, dailyAds: 1485, featured: 1592, total: 6877 },
  { date: 'Aug 27', subscriptions: 4200, dailyAds: 1782, featured: 1990, total: 7972 },
  { date: 'Aug 30', subscriptions: 4900, dailyAds: 2079, featured: 2189, total: 9168 },
  { date: 'Sep 02', subscriptions: 5300, dailyAds: 2376, featured: 2587, total: 10263 },
  { date: 'Sep 05', subscriptions: 5800, dailyAds: 2673, featured: 2985, total: 11458 },
  { date: 'Sep 08', subscriptions: 6200, dailyAds: 2970, featured: 3383, total: 12553 },
  { date: 'Sep 10', subscriptions: 7100, dailyAds: 3366, featured: 3980, total: 14446 },
]

export const MOCK_PENDING_CONTENT: PendingContentItem[] = [
  {
    id: 'pend_1',
    title: 'Sri Balaji Modern Kirana & General Stores',
    type: 'LISTING',
    authorName: 'Balaji K.',
    authorPhone: '+91 98480 12345',
    authorRole: 'BUSINESS_OWNER',
    status: 'PENDING',
    submittedAt: 'Today at 09:30 AM',
    village: 'Choutuppal Town',
    details: 'Grocery & wholesale store near Bus Station Road. Includes GST details & 6 inventory photos.',
    thumbnailUrl: 'https://picsum.photos/seed/shop101/200/200',
  },
  {
    id: 'pend_2',
    title: 'New Flyover Construction Near Panthangi Toll Plaza Begins Next Week',
    type: 'NEWS',
    authorName: 'Ramesh Goud (Agent)',
    authorPhone: '+91 99887 65432',
    authorRole: 'AGENT',
    status: 'PENDING',
    submittedAt: 'Today at 08:15 AM',
    village: 'Panthangi',
    details: 'NH-65 expansion update: NHAI officials confirm 4-lane flyover to ease bottleneck.',
    thumbnailUrl: 'https://picsum.photos/seed/news102/200/200',
  },
  {
    id: 'pend_3',
    title: 'Festival Handloom Sarees Exhibition Video Reel',
    type: 'SHORT',
    authorName: 'Padma Silks',
    authorPhone: '+91 94401 22334',
    authorRole: 'BUSINESS_OWNER',
    status: 'PENDING',
    submittedAt: 'Yesterday at 06:45 PM',
    village: 'Koyyalagudem',
    details: '30-second reel showing special Pochampally Ikat sarees with festive 20% discount offer.',
    thumbnailUrl: 'https://picsum.photos/seed/reel103/200/200',
  },
  {
    id: 'pend_4',
    title: '200 Sq. Yards Commercial Open Plot on Hyderabad Highway',
    type: 'REAL_ESTATE',
    authorName: 'Venkatesh Real Estates',
    authorPhone: '+91 91234 56780',
    authorRole: 'AGENT',
    status: 'PENDING',
    submittedAt: 'Yesterday at 04:20 PM',
    village: 'Lingojiguda',
    details: 'DTCP approved venture with 40ft blacktop roads. Asking ₹18,000/sq.yd negotiable.',
    thumbnailUrl: 'https://picsum.photos/seed/plot104/200/200',
  },
  {
    id: 'pend_5',
    title: 'Sai Ram Multi-Speciality Dental Clinic',
    type: 'LISTING',
    authorName: 'Dr. S. Reddy',
    authorPhone: '+91 96180 99887',
    authorRole: 'USER',
    status: 'PENDING',
    submittedAt: 'Sep 08, 2026',
    village: 'Choutuppal Town',
    details: 'Clinic with digital X-Ray and root canal facility on Shivalayam Street.',
    thumbnailUrl: 'https://picsum.photos/seed/clinic105/200/200',
  },
]

export const MOCK_ADMIN_LISTINGS: AdminListingItem[] = [
  {
    id: 'list_1',
    slug: 'sri-krishna-sweets-bakery',
    title: 'Sri Krishna Sweets & Bakery',
    category: 'Food & Dining',
    village: 'Choutuppal Town',
    ownerName: 'Vamshi Krishna',
    ownerPhone: '+91 98490 11223',
    status: 'ACTIVE',
    isFeatured: true,
    isPremium: true,
    views: 1420,
    whatsappClicks: 188,
    planTier: 'PREMIUM_199',
    expiresAt: '2026-12-31',
    createdAt: '2026-01-15',
  },
  {
    id: 'list_2',
    slug: 'kondur-fertilizers-pesticides',
    title: 'Kondur Kisan Agro Center',
    category: 'Agriculture',
    village: 'Chinna Kondur',
    ownerName: 'Mallaiah G.',
    ownerPhone: '+91 94402 33445',
    status: 'ACTIVE',
    isFeatured: false,
    isPremium: false,
    views: 890,
    whatsappClicks: 94,
    planTier: 'BASIC_49',
    expiresAt: '2026-10-15',
    createdAt: '2026-02-10',
  },
  {
    id: 'list_3',
    slug: 'sai-deep-automobiles-hero-spares',
    title: 'Sai Deep Hero Spares & Service',
    category: 'Automobiles',
    village: 'Choutuppal Town',
    ownerName: 'Deepak Rao',
    ownerPhone: '+91 91000 88776',
    status: 'ACTIVE',
    isFeatured: true,
    isPremium: false,
    views: 1120,
    whatsappClicks: 142,
    planTier: 'BASIC_49',
    expiresAt: '2026-09-28',
    createdAt: '2026-03-01',
  },
  {
    id: 'list_4',
    slug: 'tirumala-readymades-cloth-store',
    title: 'Tirumala Readymade & Textiles',
    category: 'Retail & Fashion',
    village: 'Allapur',
    ownerName: 'Suresh Kumar',
    ownerPhone: '+91 95022 44556',
    status: 'PENDING',
    isFeatured: false,
    isPremium: false,
    views: 60,
    whatsappClicks: 4,
    planTier: 'FREE_TRIAL',
    expiresAt: '2026-11-20',
    createdAt: '2026-09-08',
  },
  {
    id: 'list_5',
    slug: 'laxmi-narasimha-hardware-paints',
    title: 'Laxmi Narasimha Hardware & Asian Paints',
    category: 'Hardware & Construction',
    village: 'Dandumalkapur',
    ownerName: 'N. Srinivas',
    ownerPhone: '+91 98855 22110',
    status: 'EXPIRED',
    isFeatured: false,
    isPremium: false,
    views: 640,
    whatsappClicks: 52,
    planTier: 'BASIC_49',
    expiresAt: '2026-09-01',
    createdAt: '2026-02-20',
  },
]

export const MOCK_CLAIM_REQUESTS: ClaimRequestItem[] = [
  {
    id: 'claim_1',
    listingId: 'list_3',
    listingTitle: 'Sai Deep Hero Spares & Service',
    claimantName: 'Deepak Rao',
    claimantPhone: '+91 91000 88776',
    claimantEmail: 'saideep.spares@gmail.com',
    businessProofUrl: 'https://picsum.photos/seed/trade-license/600/400',
    status: 'PENDING',
    submittedAt: 'Today, 10:15 AM',
    notes: 'Uploaded Shop & Establishment license copy with matching phone number.',
  },
  {
    id: 'claim_2',
    listingId: 'list_5',
    listingTitle: 'Laxmi Narasimha Hardware & Asian Paints',
    claimantName: 'Narsing Rao',
    claimantPhone: '+91 98855 22110',
    claimantEmail: 'ln.hardware@yahoo.com',
    businessProofUrl: 'https://picsum.photos/seed/gst-cert/600/400',
    status: 'PENDING',
    submittedAt: 'Yesterday, 03:40 PM',
    notes: 'Owner requests ownership transfer to activate ₹49 renewal package.',
  },
]

export const MOCK_ADMIN_USERS: AdminUserItem[] = [
  {
    id: 'usr_admin',
    name: 'Super Administrator',
    email: 'admin@choutuppal.in',
    phone: '+91 90000 00001',
    role: 'SUPER_ADMIN',
    village: 'Choutuppal Town',
    planTier: 'PREMIUM',
    listingsCount: 0,
    isBanned: false,
    createdAt: '2026-01-01',
    lastActive: 'Just now',
  },
  {
    id: 'usr_agent_ramesh',
    name: 'Ramesh Goud',
    email: 'ramesh.agent@choutuppal.in',
    phone: '+91 99887 65432',
    role: 'AGENT',
    village: 'Panthangi',
    planTier: 'PREMIUM',
    listingsCount: 38,
    isBanned: false,
    createdAt: '2026-01-12',
    lastActive: '12 mins ago',
  },
  {
    id: 'usr_vamshi',
    name: 'Vamshi Krishna',
    email: 'vamshi.sweets@gmail.com',
    phone: '+91 98490 11223',
    role: 'USER',
    village: 'Choutuppal Town',
    planTier: 'PREMIUM',
    listingsCount: 2,
    isBanned: false,
    createdAt: '2026-01-15',
    lastActive: '1 hour ago',
  },
  {
    id: 'usr_mallaiah',
    name: 'Mallaiah G.',
    email: 'mallaiah.agro@gmail.com',
    phone: '+91 94402 33445',
    role: 'USER',
    village: 'Chinna Kondur',
    planTier: 'FREE',
    listingsCount: 1,
    isBanned: false,
    createdAt: '2026-02-10',
    lastActive: '3 hours ago',
  },
  {
    id: 'usr_spammer',
    name: 'Quick Money Ads',
    email: 'spam99@tempmail.com',
    phone: '+91 91111 22222',
    role: 'USER',
    village: 'Allapur',
    planTier: 'FREE',
    listingsCount: 0,
    isBanned: true,
    createdAt: '2026-08-25',
    lastActive: '10 days ago',
  },
]

export const MOCK_AGENT_KYC: AgentKycItem[] = [
  {
    id: 'kyc_1',
    userId: 'usr_agent_ramesh',
    name: 'Ramesh Goud',
    phone: '+91 99887 65432',
    agentCode: 'CHP-AGT-01',
    village: 'Panthangi',
    mandal: 'Choutuppal',
    idCardUrl: 'https://picsum.photos/seed/aadhaar-ramesh/500/320',
    addressProofUrl: 'https://picsum.photos/seed/voter-ramesh/500/320',
    status: 'APPROVED',
    onboardedListings: 38,
    leadsGenerated: 142,
    commissionEarned: 7600,
    submittedAt: '2026-01-12',
  },
  {
    id: 'kyc_2',
    userId: 'usr_agent_shiva',
    name: 'Shiva Shankar',
    phone: '+91 97001 23456',
    agentCode: 'CHP-AGT-02',
    village: 'Koyyalagudem',
    mandal: 'Choutuppal',
    idCardUrl: 'https://picsum.photos/seed/aadhaar-shiva/500/320',
    addressProofUrl: 'https://picsum.photos/seed/voter-shiva/500/320',
    status: 'PENDING',
    onboardedListings: 12,
    leadsGenerated: 34,
    commissionEarned: 2400,
    submittedAt: 'Yesterday, 11:00 AM',
  },
]

export const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx_1',
    transactionId: 'pay_Pz9284KnmL1',
    businessName: 'Sri Krishna Sweets & Bakery',
    userPhone: '+91 98490 11223',
    amount: 199,
    planType: 'FEATURED_BADGE',
    status: 'SUCCESS',
    paymentGateway: 'RAZORPAY',
    date: '2026-09-10 08:30 AM',
  },
  {
    id: 'tx_2',
    transactionId: 'pay_Pz9273QwpX2',
    businessName: 'Padma Silks Handlooms',
    userPhone: '+91 94401 22334',
    amount: 99,
    planType: 'DAILY_AD',
    status: 'SUCCESS',
    paymentGateway: 'RAZORPAY',
    date: '2026-09-09 06:15 PM',
  },
  {
    id: 'tx_3',
    transactionId: 'pay_Pz9251AbcR3',
    businessName: 'Sai Deep Hero Spares',
    userPhone: '+91 91000 88776',
    amount: 49,
    planType: 'MONTHLY_LISTING',
    status: 'SUCCESS',
    paymentGateway: 'RAZORPAY',
    date: '2026-09-09 02:45 PM',
  },
  {
    id: 'tx_4',
    transactionId: 'pay_Pz9230VbnT4',
    businessName: 'Venkatesh Real Estates',
    userPhone: '+91 91234 56780',
    amount: 199,
    planType: 'REAL_ESTATE',
    status: 'SUCCESS',
    paymentGateway: 'RAZORPAY',
    date: '2026-09-08 11:20 AM',
  },
  {
    id: 'tx_5',
    transactionId: 'pay_Pz9219ErrF5',
    businessName: 'Kondur Kisan Agro Center',
    userPhone: '+91 94402 33445',
    amount: 49,
    planType: 'MONTHLY_LISTING',
    status: 'FAILED',
    paymentGateway: 'RAZORPAY',
    date: '2026-09-08 09:10 AM',
  },
]

export const MOCK_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'sub_1',
    businessName: 'Sri Krishna Sweets & Bakery',
    ownerPhone: '+91 98490 11223',
    plan: 'PREMIUM_199',
    amount: 199,
    renewalDate: '2026-10-10',
    status: 'ACTIVE',
    autoDebit: true,
  },
  {
    id: 'sub_2',
    businessName: 'Sai Deep Hero Spares & Service',
    ownerPhone: '+91 91000 88776',
    plan: 'BASIC_49',
    amount: 49,
    renewalDate: '2026-09-28',
    status: 'EXPIRING',
    autoDebit: false,
  },
  {
    id: 'sub_3',
    businessName: 'Kondur Kisan Agro Center',
    ownerPhone: '+91 94402 33445',
    plan: 'BASIC_49',
    amount: 49,
    renewalDate: '2026-10-15',
    status: 'ACTIVE',
    autoDebit: true,
  },
]

export const MOCK_EXPIRING_TRIALS: ExpiringTrialItem[] = [
  {
    id: 'trial_1',
    businessName: 'Tirumala Readymades',
    ownerName: 'Suresh Kumar',
    ownerPhone: '+91 95022 44556',
    village: 'Allapur',
    startDate: '2026-06-15',
    expiryDate: '2026-09-15',
    daysRemaining: 5,
    whatsappReminderSent: true,
  },
  {
    id: 'trial_2',
    businessName: 'Koyyalagudem Tea & Tiffin Point',
    ownerName: 'K. Balu',
    ownerPhone: '+91 97003 44556',
    village: 'Koyyalagudem',
    startDate: '2026-06-18',
    expiryDate: '2026-09-18',
    daysRemaining: 8,
    whatsappReminderSent: false,
  },
  {
    id: 'trial_3',
    businessName: 'Nellore Vari Family Dhaba',
    ownerName: 'P. Ravinder',
    ownerPhone: '+91 98850 11229',
    village: 'Panthangi',
    startDate: '2026-06-20',
    expiryDate: '2026-09-20',
    daysRemaining: 10,
    whatsappReminderSent: false,
  },
]

export const MOCK_AD_INVENTORY: AdInventoryItem[] = [
  {
    id: 'ad_1',
    type: 'STORY_AD',
    title: 'Padma Silks Festive Flash Sale',
    ownerPhone: '+91 94401 22334',
    amountPaid: 99,
    startedAt: 'Today, 08:00 AM',
    expiresAt: 'Tomorrow, 08:00 AM',
    hoursRemaining: 16,
    views: 340,
    clicks: 42,
    isActive: true,
  },
  {
    id: 'ad_2',
    type: 'BANNER_HOME',
    title: 'Sri Balaji Kirana Mega Grocery Discount',
    ownerPhone: '+91 98480 12345',
    amountPaid: 99,
    startedAt: 'Yesterday, 07:00 PM',
    expiresAt: 'Today, 07:00 PM',
    hoursRemaining: 3,
    views: 980,
    clicks: 114,
    isActive: true,
  },
]

export const MOCK_VILLAGES: VillageItem[] = [
  { id: 'v_1', name: 'Choutuppal Town', teluguName: 'చౌటుప్పల్ టౌన్', pincode: '508252', listingCount: 164, agentCount: 4, isActive: true },
  { id: 'v_2', name: 'Allapur', teluguName: 'అల్లాపూర్', pincode: '508252', listingCount: 22, agentCount: 1, isActive: true },
  { id: 'v_3', name: 'Chinna Kondur', teluguName: 'చిన్న కొండూరు', pincode: '508252', listingCount: 19, agentCount: 1, isActive: true },
  { id: 'v_4', name: 'Panthangi', teluguName: 'పంతంగి', pincode: '508252', listingCount: 34, agentCount: 2, isActive: true },
  { id: 'v_5', name: 'Nelapatla', teluguName: 'నేలపట్ల', pincode: '508252', listingCount: 15, agentCount: 1, isActive: true },
  { id: 'v_6', name: 'Gundlagudem', teluguName: 'గుండ్లగూడెం', pincode: '508252', listingCount: 18, agentCount: 1, isActive: true },
  { id: 'v_7', name: 'Thallasingaram', teluguName: 'తాళ్లసింగారం', pincode: '508252', listingCount: 16, agentCount: 1, isActive: true },
  { id: 'v_8', name: 'Swamulavari Lingotam', teluguName: 'స్వాములవారి లింగోటం', pincode: '508252', listingCount: 14, agentCount: 1, isActive: true },
  { id: 'v_9', name: 'Koyyalagudem', teluguName: 'కొయ్యలగూడెం', pincode: '508252', listingCount: 28, agentCount: 2, isActive: true },
  { id: 'v_10', name: 'Jaikesaram', teluguName: 'జైకేసారం', pincode: '508252', listingCount: 12, agentCount: 1, isActive: true },
  { id: 'v_11', name: 'Dandumalkapur', teluguName: 'దండుమల్కాపూర్', pincode: '508252', listingCount: 26, agentCount: 2, isActive: true },
  { id: 'v_12', name: 'Malkapur', teluguName: 'మల్కాపూర్', pincode: '508252', listingCount: 14, agentCount: 1, isActive: true },
  { id: 'v_13', name: 'Lakkaram', teluguName: 'లక్కారం', pincode: '508252', listingCount: 17, agentCount: 1, isActive: true },
  { id: 'v_14', name: 'Peepalpahad', teluguName: 'పీపల్ పహాడ్', pincode: '508252', listingCount: 11, agentCount: 1, isActive: true },
  { id: 'v_15', name: 'Lingojiguda', teluguName: 'లింగోజిగూడ', pincode: '508252', listingCount: 20, agentCount: 1, isActive: true },
  { id: 'v_16', name: 'Aregudem', teluguName: 'ఆరెగూడెం', pincode: '508252', listingCount: 8, agentCount: 1, isActive: true },
  { id: 'v_17', name: 'Gokaram', teluguName: 'గోకారం', pincode: '508252', listingCount: 9, agentCount: 1, isActive: true },
  { id: 'v_18', name: 'Tadicherla', teluguName: 'తాడిచర్ల', pincode: '508252', listingCount: 7, agentCount: 1, isActive: true },
]

export const MOCK_PRICING: PricingRule = {
  monthlyListingFee: 49,
  dailyAdFee: 99,
  featuredListingFee: 199,
  freeTrialDays: 90,
  agentCommissionPercent: 20,
}

export const MOCK_AFFILIATES: AffiliateKeywordItem[] = [
  {
    id: 'aff_1',
    keyword: 'Amazon Great Indian Festival',
    targetUrl: 'https://www.amazon.in?tag=choutuppal-21',
    cloakedSlug: 'amazon-sale',
    clicks: 1420,
    earningsEst: 4260,
    category: 'E-Commerce',
    isActive: true,
    lastUpdated: '2026-09-08',
  },
  {
    id: 'aff_2',
    keyword: 'Redmi Note 5G',
    targetUrl: 'https://www.amazon.in/s?k=redmi+note+5g&tag=choutuppal-21',
    cloakedSlug: 'redmi-mobile',
    clicks: 890,
    earningsEst: 2670,
    category: 'Mobiles',
    isActive: true,
    lastUpdated: '2026-09-06',
  },
  {
    id: 'aff_3',
    keyword: 'Mahindra Tractor Spares',
    targetUrl: 'https://www.flipkart.com/search?q=tractor+spares&affid=choutuppal',
    cloakedSlug: 'tractor-parts',
    clicks: 640,
    earningsEst: 3200,
    category: 'Agriculture',
    isActive: true,
    lastUpdated: '2026-09-04',
  },
  {
    id: 'aff_4',
    keyword: 'Solar Water Heater & Panels',
    targetUrl: 'https://amzn.to/choutuppal-solar',
    cloakedSlug: 'solar-energy',
    clicks: 430,
    earningsEst: 2320,
    category: 'Home & Energy',
    isActive: true,
    lastUpdated: '2026-09-01',
  },
]

export const MOCK_BACKLINKS: BacklinkItem[] = [
  {
    id: 'bl_1',
    partnerSite: 'Telangana Today Real Estate Guide',
    partnerUrl: 'https://telanganatoday.com/hyderabad-outskirts-growth',
    ourTargetUrl: 'https://choutuppal.in/explore',
    anchorText: 'Choutuppal Property Directory',
    status: 'ACTIVE',
    lastChecked: 'Today at 06:00 AM',
    daScore: 68,
  },
  {
    id: 'bl_2',
    partnerSite: 'Pochampally Handloom Tourism Portal',
    partnerUrl: 'https://pochampallytourism.org/crafts',
    ourTargetUrl: 'https://choutuppal.in/business/koyyalagudem-weavers',
    anchorText: 'Choutuppal Handloom Shops',
    status: 'ACTIVE',
    lastChecked: 'Yesterday',
    daScore: 45,
  },
  {
    id: 'bl_3',
    partnerSite: 'Yadadri Tourism & Info',
    partnerUrl: 'https://yadadritrip.in/nearby-towns',
    ourTargetUrl: 'https://choutuppal.in',
    anchorText: 'Choutuppal Super App',
    status: 'ACTIVE',
    lastChecked: '2 days ago',
    daScore: 52,
  },
]

/* -------------------------------------------------------------------------- */
/*                           DATA FETCHING HELPERS                            */
/* -------------------------------------------------------------------------- */

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [userCount, listingCount] = await safeDbQuery(async () => {
      const u = await prisma.user.count()
      const l = await prisma.listing.count()
      return [u, l]
    })
    return {
      ...MOCK_ADMIN_STATS,
      totalUsers: userCount || MOCK_ADMIN_STATS.totalUsers,
      totalListings: listingCount || MOCK_ADMIN_STATS.totalListings,
    }
  } catch {
    return MOCK_ADMIN_STATS
  }
}

export async function getPendingContent(): Promise<PendingContentItem[]> {
  return MOCK_PENDING_CONTENT
}

export async function getRevenueChartData(): Promise<RevenueDataPoint[]> {
  return MOCK_REVENUE_CHART
}

export async function getAdminListings(): Promise<AdminListingItem[]> {
  return MOCK_ADMIN_LISTINGS
}

export async function getClaimRequests(): Promise<ClaimRequestItem[]> {
  return MOCK_CLAIM_REQUESTS
}

export async function getAdminUsers(): Promise<AdminUserItem[]> {
  return MOCK_ADMIN_USERS
}

export async function getAdminAgents(): Promise<AgentKycItem[]> {
  return MOCK_AGENT_KYC
}

export async function getAdminTransactions(): Promise<TransactionItem[]> {
  return MOCK_TRANSACTIONS
}

export async function getAdminSubscriptions(): Promise<SubscriptionItem[]> {
  return MOCK_SUBSCRIPTIONS
}

export async function getAdminExpiringTrials(): Promise<ExpiringTrialItem[]> {
  return MOCK_EXPIRING_TRIALS
}

export async function getAdminAdInventory(): Promise<AdInventoryItem[]> {
  return MOCK_AD_INVENTORY
}

export async function getAdminVillages(): Promise<VillageItem[]> {
  return MOCK_VILLAGES
}

export async function getAdminPricing(): Promise<PricingRule> {
  return MOCK_PRICING
}

export async function getAdminAffiliates(): Promise<AffiliateKeywordItem[]> {
  return MOCK_AFFILIATES
}

export async function getAdminBacklinks(): Promise<BacklinkItem[]> {
  return MOCK_BACKLINKS
}

// Convenient aliases
export const getActiveSubscriptions = getAdminSubscriptions
export const getRevenueTransactions = getAdminTransactions
export const getExpiringTrials = getAdminExpiringTrials
export const getLiveAds = getAdminAdInventory
export const getAffiliateKeywords = getAdminAffiliates
export const getBacklinks = getAdminBacklinks
export const getAgentKycList = getAdminAgents
export const getVillages = getAdminVillages
export const getSystemPricing = getAdminPricing

// Convenient type aliases
export type RevenueTransactionItem = TransactionItem
export type ActiveSubscriptionItem = SubscriptionItem
export type LiveAdItem = AdInventoryItem
export type SystemPricingSettings = PricingRule
