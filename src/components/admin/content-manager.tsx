'use client'

import * as React from 'react'
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Layers,
  Link2,
  Search,
  CheckCircle2,
  Globe,
  Tag,
  Eye,
  Send,
  Save,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  TrendingUp
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { AffiliateKeywordItem, BacklinkItem } from '@/lib/admin-data'

interface CategoryItem {
  id: string
  name: string
  slug: string
  icon: string
  type: 'NEWS' | 'BUSINESS'
  count: number
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat_1', name: 'Local News & Politics', slug: 'local-news', icon: '📰', type: 'NEWS', count: 48 },
  { id: 'cat_2', name: 'Agriculture & Rythu Bazar', slug: 'agriculture', icon: '🌾', type: 'NEWS', count: 32 },
  { id: 'cat_3', name: 'Business & Economy', slug: 'business', icon: '💼', type: 'NEWS', count: 26 },
  { id: 'cat_4', name: 'Handlooms & Weaving', slug: 'handlooms', icon: '🧵', type: 'BUSINESS', count: 42 },
  { id: 'cat_5', name: 'Food & Restaurants', slug: 'food-dining', icon: '🍛', type: 'BUSINESS', count: 68 },
  { id: 'cat_6', name: 'Health & Hospitals', slug: 'health-medical', icon: '🏥', type: 'BUSINESS', count: 34 },
  { id: 'cat_7', name: 'Real Estate & Land', slug: 'real-estate', icon: '🏡', type: 'BUSINESS', count: 52 },
]

interface ContentManagerProps {
  initialAffiliates: AffiliateKeywordItem[]
  initialBacklinks: BacklinkItem[]
}

export function ContentManager({
  initialAffiliates,
  initialBacklinks,
}: ContentManagerProps) {
  const [activeTab, setActiveTab] = React.useState('editor')

  // News / Blog Editor Form State
  const [postTitle, setPostTitle] = React.useState('')
  const [postTeluguTitle, setPostTeluguTitle] = React.useState('')
  const [postSlug, setPostSlug] = React.useState('')
  const [postCategory, setPostCategory] = React.useState('Local News & Politics')
  const [postTags, setPostTags] = React.useState('Choutuppal, NH65, Local Update')
  const [postExcerpt, setPostExcerpt] = React.useState('')
  const [postContent, setPostContent] = React.useState('')
  const [postImage, setPostImage] = React.useState('')
  const [isAiGenerating, setIsAiGenerating] = React.useState(false)

  // Categories CRUD State
  const [categories, setCategories] = React.useState<CategoryItem[]>(INITIAL_CATEGORIES)
  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null)
  const [catName, setCatName] = React.useState('')
  const [catSlug, setCatSlug] = React.useState('')
  const [catIcon, setCatIcon] = React.useState('📌')
  const [catType, setCatType] = React.useState<'NEWS' | 'BUSINESS'>('NEWS')

  // Affiliate Keywords State
  const [affiliates, setAffiliates] = React.useState<AffiliateKeywordItem[]>(initialAffiliates)
  const [affiliateModalOpen, setAffiliateModalOpen] = React.useState(false)
  const [affKeyword, setAffKeyword] = React.useState('')
  const [affTargetUrl, setAffTargetUrl] = React.useState('')
  const [affSlug, setAffSlug] = React.useState('')
  const [affCategory, setAffCategory] = React.useState('E-Commerce')

  // Backlinks State
  const [backlinks, setBacklinks] = React.useState<BacklinkItem[]>(initialBacklinks)
  const [backlinkModalOpen, setBacklinkModalOpen] = React.useState(false)
  const [blPartner, setBlPartner] = React.useState('')
  const [blPartnerUrl, setBlPartnerUrl] = React.useState('')
  const [blTargetUrl, setBlTargetUrl] = React.useState('')
  const [blAnchor, setBlAnchor] = React.useState('')

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setPostTitle(val)
    if (!postSlug || postSlug === slugify(postTitle)) {
      setPostSlug(slugify(val))
    }
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Insert markdown helper in editor
  const insertFormatting = (syntax: string, placeholder = 'text') => {
    setPostContent((prev) => `${prev}\n${syntax.replace('%s', placeholder)}`)
  }

  // AI Co-Pilot prompt generator simulation
  const triggerAiCoPilot = () => {
    if (!postTitle.trim()) {
      toast.error('Please enter a headline first to let AI suggest content!')
      return
    }
    setIsAiGenerating(true)
    setTimeout(() => {
      setPostTeluguTitle(`చౌటుప్పల్ తాజా వార్త: ${postTitle}`)
      setPostExcerpt(
        `చౌటుప్పల్ పరిసర ప్రాంతాల్లో ${postTitle} పై అధికారిక వివరాలు వెల్లడయ్యాయి. ప్రజలకు మరియు రైతులకు ఉపయోగకరమైన పూర్తి సమాచారం.`
      )
      setPostContent(
        `## ముఖ్యమైన ముఖ్యాంశాలు (Key Highlights)\n\nచౌటుప్పల్ మున్సిపాలిటీ పరిధిలో ఈరోజు తాజా పరిణామాలు చోటుచేసుకున్నాయి.\n\n* స్థానిక అధికారులు మరియు నాయకులు సమావేశమై నిర్ణయాలు తీసుకున్నారు.\n* ప్రజలకు మెరుగైన సౌకర్యాలు కల్పించే దిశగా ప్రణాళికలు రూపొందించారు.\n\n### వివరాలు (Full Details)\n\nగ్రామీణ ప్రాంతాలైన పంతంగి, నేలపట్ల, కొయ్యలగూడెం మరియు చౌటుప్పల్ టౌన్ పరిధిలో ఈ ప్రాజెక్ట్ వేగంగా అమలు చేయబడుతుంది.\n\nమరిన్ని వివరాల కోసం చౌటుప్పల్ సూపర్ యాప్ ను అనుసరించండి.`
      )
      setIsAiGenerating(false)
      toast.success('AI Co-Pilot generated Telugu content & SEO summary!')
    }, 900)
  }

  // Save / Publish News
  const handlePublishNews = (isDraft: boolean) => {
    if (!postTitle.trim()) {
      toast.error('Headline is required.')
      return
    }
    toast.success(
      isDraft
        ? `Draft "${postTitle.slice(0, 25)}..." saved successfully!`
        : `News article published live to Choutuppal Super App!`
    )
    // Clear form
    setPostTitle('')
    setPostTeluguTitle('')
    setPostSlug('')
    setPostExcerpt('')
    setPostContent('')
  }

  // Categories Handlers
  const handleOpenCatModal = (cat?: CategoryItem) => {
    if (cat) {
      setEditingCategory(cat)
      setCatName(cat.name)
      setCatSlug(cat.slug)
      setCatIcon(cat.icon)
      setCatType(cat.type)
    } else {
      setEditingCategory(null)
      setCatName('')
      setCatSlug('')
      setCatIcon('📌')
      setCatType('NEWS')
    }
    setCategoryModalOpen(true)
  }

  const handleSaveCategory = () => {
    if (!catName.trim()) {
      toast.error('Category name is required')
      return
    }
    const slug = catSlug.trim() || slugify(catName)
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: catName, slug, icon: catIcon, type: catType }
            : c
        )
      )
      toast.success('Category updated successfully!')
    } else {
      const newCat: CategoryItem = {
        id: `cat_${Date.now()}`,
        name: catName,
        slug,
        icon: catIcon,
        type: catType,
        count: 0,
      }
      setCategories((prev) => [...prev, newCat])
      toast.success(`Category "${catName}" added!`)
    }
    setCategoryModalOpen(false)
  }

  const handleDeleteCategory = (id: string, name: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast.info(`Category "${name}" deleted.`)
  }

  // Affiliates Handlers
  const handleSaveAffiliate = () => {
    if (!affKeyword.trim() || !affTargetUrl.trim()) {
      toast.error('Keyword and Target URL are required.')
      return
    }
    const slug = affSlug.trim() || slugify(affKeyword)
    const newAff: AffiliateKeywordItem = {
      id: `aff_${Date.now()}`,
      keyword: affKeyword,
      targetUrl: affTargetUrl,
      cloakedSlug: slug,
      clicks: 0,
      earningsEst: 0,
      category: affCategory,
      isActive: true,
      lastUpdated: 'Just now',
    }
    setAffiliates((prev) => [newAff, ...prev])
    setAffiliateModalOpen(false)
    setAffKeyword('')
    setAffTargetUrl('')
    setAffSlug('')
    toast.success(`Affiliate keyword "${affKeyword}" added!`, {
      description: `Target cloaked URL: https://choutuppal.in/go/${slug}`,
    })
  }

  const toggleAffiliateActive = (id: string) => {
    setAffiliates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    )
    toast.success('Affiliate rule status updated.')
  }

  // Backlink Handlers
  const handleSaveBacklink = () => {
    if (!blPartner.trim() || !blPartnerUrl.trim()) {
      toast.error('Partner site and URL are required.')
      return
    }
    const newBl: BacklinkItem = {
      id: `bl_${Date.now()}`,
      partnerSite: blPartner,
      partnerUrl: blPartnerUrl,
      ourTargetUrl: blTargetUrl || 'https://choutuppal.in',
      anchorText: blAnchor || 'Choutuppal',
      status: 'ACTIVE',
      lastChecked: 'Just now',
      daScore: 40,
    }
    setBacklinks((prev) => [newBl, ...prev])
    setBacklinkModalOpen(false)
    setBlPartner('')
    setBlPartnerUrl('')
    setBlTargetUrl('')
    setBlAnchor('')
    toast.success(`Backlink for "${blPartner}" registered!`)
  }

  return (
    <div className="space-y-6">
      {/* TABS HEADER */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200/80 p-1 rounded-2xl h-11 shadow-xs">
          <TabsTrigger
            value="editor"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Rich Article Editor</span>
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Categories ({categories.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="affiliate"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Auto-Affiliate Keywords ({affiliates.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="backlinks"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>SEO &amp; Backlinks ({backlinks.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: RICH TEXT ARTICLE EDITOR */}
        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Canvas (2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-slate-200/80 rounded-2xl shadow-xs bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        Create News or Blog Post
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Publish local news, mandi rates, and business announcements to Choutuppal.
                      </CardDescription>
                    </div>
                    <Button
                      id="ai-copilot-suggest-btn"
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={triggerAiCoPilot}
                      disabled={isAiGenerating}
                      className="border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-xl gap-1.5"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{isAiGenerating ? 'Generating...' : 'AI Co-Pilot (Telugu)'}</span>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {/* English Headline */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-title" className="text-xs font-bold text-slate-700">
                      Article Headline (English / Main)
                    </Label>
                    <Input
                      id="post-title"
                      placeholder="e.g., NHAI Approves 4-Lane Flyover at Panthangi Junction"
                      value={postTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="text-sm font-semibold rounded-xl"
                    />
                  </div>

                  {/* Telugu Headline */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-telugu-title" className="text-xs font-bold text-slate-700">
                      Telugu Headline (తెలుగు శీర్షిక)
                    </Label>
                    <Input
                      id="post-telugu-title"
                      placeholder="ఉదా: పంతంగి వద్ద 4 లైన్ల ఫ్లైఓవర్ కు కేంద్రం ఆమోదం"
                      value={postTeluguTitle}
                      onChange={(e) => setPostTeluguTitle(e.target.value)}
                      className="text-sm rounded-xl font-medium"
                    />
                  </div>

                  {/* Excerpt / Summary */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-excerpt" className="text-xs font-bold text-slate-700">
                      Summary Excerpt (Meta Description)
                    </Label>
                    <Textarea
                      id="post-excerpt"
                      rows={2}
                      placeholder="A short 1-2 sentence overview for WhatsApp share cards and Google search snippets..."
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('**%s**', 'Bold Text')}
                      className="h-7 px-2 text-slate-700 font-bold"
                      title="Bold"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('*%s*', 'Italic Text')}
                      className="h-7 px-2 text-slate-700 italic"
                      title="Italic"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('## %s', 'Section Heading')}
                      className="h-7 px-2 text-slate-700 font-bold"
                      title="Heading 2"
                    >
                      <Heading2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('### %s', 'Subheading')}
                      className="h-7 px-2 text-slate-700 font-bold"
                      title="Heading 3"
                    >
                      <Heading3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('* %s', 'Bullet item')}
                      className="h-7 px-2 text-slate-700"
                      title="Bullet List"
                    >
                      <List className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('> %s', 'Important quote or notice')}
                      className="h-7 px-2 text-slate-700"
                      title="Quote Block"
                    >
                      <Quote className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('[%s](https://choutuppal.in)', 'Link Anchor')}
                      className="h-7 px-2 text-slate-700"
                      title="Hyperlink"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Content Area */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-content" className="text-xs font-bold text-slate-700">
                      Full Article Body (Markdown / Rich Format)
                    </Label>
                    <Textarea
                      id="post-content"
                      rows={10}
                      placeholder="Write the full report here. Auto-affiliate keywords will automatically link on the live site..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="font-mono text-xs rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Publishing Settings (1 Column) */}
            <div className="space-y-4">
              <Card className="border-slate-200/80 rounded-2xl shadow-xs bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Publishing Meta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 text-xs">
                  {/* Slug */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-slug" className="font-bold text-slate-700">
                      URL Slug
                    </Label>
                    <Input
                      id="post-slug"
                      value={postSlug}
                      onChange={(e) => setPostSlug(e.target.value)}
                      placeholder="url-friendly-slug"
                      className="h-8.5 rounded-xl text-xs"
                    />
                    <span className="text-[10px] text-slate-400">
                      choutuppal.in/news/{postSlug || 'slug'}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-category" className="font-bold text-slate-700">
                      Category
                    </Label>
                    <select
                      id="post-category"
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full h-8.5 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-tags" className="font-bold text-slate-700">
                      Tags (Comma separated)
                    </Label>
                    <Input
                      id="post-tags"
                      value={postTags}
                      onChange={(e) => setPostTags(e.target.value)}
                      placeholder="Choutuppal, Traffic, Highways"
                      className="h-8.5 rounded-xl text-xs"
                    />
                  </div>

                  {/* Featured Image URL */}
                  <div className="space-y-1.5">
                    <Label htmlFor="post-image" className="font-bold text-slate-700">
                      Cover Image URL
                    </Label>
                    <Input
                      id="post-image"
                      value={postImage}
                      onChange={(e) => setPostImage(e.target.value)}
                      placeholder="https://... or /uploads/..."
                      className="h-8.5 rounded-xl text-xs"
                    />
                  </div>

                  {/* Auto-Affiliate Notice */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-900 space-y-1">
                    <span className="font-bold block flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-blue-600" />
                      Auto-Affiliate Active
                    </span>
                    <p className="text-blue-700 leading-normal">
                      Keywords matching your affiliate rules (e.g. Amazon, Redmi, Tractors) will be automatically converted to cloaked commission links.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <Button
                      id="publish-article-live-btn"
                      type="button"
                      onClick={() => handlePublishNews(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-9.5 gap-1.5 shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Publish Live Now</span>
                    </Button>
                    <Button
                      id="save-article-draft-btn"
                      type="button"
                      variant="outline"
                      onClick={() => handlePublishNews(true)}
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl h-9 gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save as Draft</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: CATEGORIES MANAGER (CRUD) */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Taxonomy &amp; Categories</h2>
              <p className="text-xs text-slate-500">
                Manage business directory and local news categories shown on Choutuppal home &amp; filters.
              </p>
            </div>
            <Button
              id="add-category-btn"
              size="sm"
              onClick={() => handleOpenCatModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-8.5 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Category</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="categories-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="w-16 text-center">Icon</TableHead>
                  <TableHead className="font-bold text-slate-700">Category Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Slug</TableHead>
                  <TableHead className="font-bold text-slate-700">Section Type</TableHead>
                  <TableHead className="font-bold text-slate-700">Total Items</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs">
                {categories.map((cat) => (
                  <TableRow key={cat.id} id={`category-row-${cat.id}`}>
                    <TableCell className="text-center text-lg">{cat.icon}</TableCell>
                    <TableCell className="font-bold text-slate-900">{cat.name}</TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-500">{cat.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {cat.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">{cat.count} listings/posts</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-blue-600"
                          onClick={() => handleOpenCatModal(cat)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-rose-600"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
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

        {/* TAB 3: AUTO-AFFILIATE KEYWORDS & CLOAKED URLS */}
        <TabsContent value="affiliate" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Auto-Affiliate Link Engine</h2>
                <Badge className="bg-amber-100 text-amber-900 font-bold text-[10px]">
                  SEO Cloaking Enabled
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Keywords detected in any news article or blog post are automatically turned into cloaked affiliate links.
              </p>
            </div>
            <Button
              id="add-affiliate-rule-btn"
              size="sm"
              onClick={() => setAffiliateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-8.5 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Keyword Rule</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="affiliate-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Trigger Keyword</TableHead>
                  <TableHead className="font-bold text-slate-700">Cloaked Redirect Slug</TableHead>
                  <TableHead className="font-bold text-slate-700">Target Affiliate URL</TableHead>
                  <TableHead className="font-bold text-slate-700">Category</TableHead>
                  <TableHead className="font-bold text-slate-700">Clicks Tracked</TableHead>
                  <TableHead className="font-bold text-slate-700">Est. Commission</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs">
                {affiliates.map((aff) => (
                  <TableRow key={aff.id} id={`affiliate-row-${aff.id}`}>
                    <TableCell className="font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-blue-600" />
                        <span>{aff.keyword}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        /go/{aff.cloakedSlug}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-slate-500 font-mono text-[11px]">
                      {aff.targetUrl}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {aff.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">
                      {aff.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600">
                      ₹{aff.earningsEst.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={aff.isActive ? 'default' : 'secondary'}
                        className={`text-[10px] font-bold ${
                          aff.isActive ? 'bg-emerald-600' : ''
                        }`}
                      >
                        {aff.isActive ? 'ACTIVE' : 'PAUSED'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleAffiliateActive(aff.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-blue-700 h-7"
                      >
                        {aff.isActive ? 'Pause' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 4: BACKLINK & INTERNAL LINKING MANAGER */}
        <TabsContent value="backlinks" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Backlinks &amp; Partner SEO Hub</h2>
              <p className="text-xs text-slate-500">
                Track link exchanges, domain authority scores, and incoming links from regional news &amp; travel portals.
              </p>
            </div>
            <Button
              id="add-backlink-btn"
              size="sm"
              onClick={() => setBacklinkModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-8.5 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register Backlink</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <Table id="backlinks-data-table">
              <TableHeader className="bg-slate-50 text-xs">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Partner Website</TableHead>
                  <TableHead className="font-bold text-slate-700">Anchor Text</TableHead>
                  <TableHead className="font-bold text-slate-700">Our Target Page</TableHead>
                  <TableHead className="font-bold text-slate-700">DA Score</TableHead>
                  <TableHead className="font-bold text-slate-700">Link Status</TableHead>
                  <TableHead className="font-bold text-slate-700">Last Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs">
                {backlinks.map((bl) => (
                  <TableRow key={bl.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{bl.partnerSite}</span>
                        <a
                          href={bl.partnerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate max-w-[220px]">{bl.partnerUrl}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      &ldquo;{bl.anchorText}&rdquo;
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-600">
                      {bl.ourTargetUrl}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold text-indigo-700 border-indigo-200 bg-indigo-50">
                        DA {bl.daScore}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                        {bl.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">{bl.lastChecked}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* CATEGORY CRUD MODAL */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Categorize listings or news for easy navigation on the public app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Category Name</Label>
              <Input
                placeholder="e.g., Electrical & Electronics"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Slug (optional)</Label>
              <Input
                placeholder="electrical-electronics"
                value={catSlug}
                onChange={(e) => setCatSlug(e.target.value)}
                className="h-9 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="font-bold text-slate-700">Emoji / Icon</Label>
                <Input
                  placeholder="⚡"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="h-9 rounded-xl text-xs text-center text-lg"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-slate-700">Section Type</Label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as 'NEWS' | 'BUSINESS')}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                >
                  <option value="NEWS">News</option>
                  <option value="BUSINESS">Business Directory</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategoryModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AFFILIATE RULE MODAL */}
      <Dialog open={affiliateModalOpen} onOpenChange={setAffiliateModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Add Auto-Affiliate Keyword Rule
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Set target keyword that will trigger cloaked affiliate links across articles.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Trigger Keyword</Label>
              <Input
                placeholder="e.g., iPhone 16 or Samsung 5G or Solar Pump"
                value={affKeyword}
                onChange={(e) => setAffKeyword(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Target Affiliate URL (with your tag)</Label>
              <Input
                placeholder="https://www.amazon.in/...&tag=choutuppal-21"
                value={affTargetUrl}
                onChange={(e) => setAffTargetUrl(e.target.value)}
                className="h-9 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Cloaked Slug (choutuppal.in/go/[slug])</Label>
              <Input
                placeholder="iphone-sale"
                value={affSlug}
                onChange={(e) => setAffSlug(e.target.value)}
                className="h-9 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Category</Label>
              <Input
                placeholder="Electronics / Agriculture / Fashion"
                value={affCategory}
                onChange={(e) => setAffCategory(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAffiliateModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAffiliate}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BACKLINK MODAL */}
      <Dialog open={backlinkModalOpen} onOpenChange={setBacklinkModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Register External Backlink
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a partner site linking back to Choutuppal Super App to monitor SEO health.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Partner Website Name</Label>
              <Input
                placeholder="e.g., Telangana Today Tourism"
                value={blPartner}
                onChange={(e) => setBlPartner(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Partner Page URL (Where backlink lives)</Label>
              <Input
                placeholder="https://partner-portal.com/article-url"
                value={blPartnerUrl}
                onChange={(e) => setBlPartnerUrl(e.target.value)}
                className="h-9 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Our Target Page</Label>
              <Input
                placeholder="https://choutuppal.in/explore"
                value={blTargetUrl}
                onChange={(e) => setBlTargetUrl(e.target.value)}
                className="h-9 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-700">Anchor Text</Label>
              <Input
                placeholder="e.g., Choutuppal Local Services"
                value={blAnchor}
                onChange={(e) => setBlAnchor(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBacklinkModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveBacklink}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Save Backlink
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
