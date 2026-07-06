"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { briefs as mockBriefs, proposals as mockProposals, salesComments as mockSalesComments, proposalSections, statusLabels, libraryProposals as mockLibraryProposals, brandExplorerData } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import {
  ChevronLeft,
  Save,
  Share2,
  Send,
  Sparkles,
  Search,
  Globe,
  Lightbulb,
  Wand2,
  Image,
  FileText,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  Circle,
  Plus,
  ZoomIn,
  ArrowUpRight,
  User,
  Calendar,
  DollarSign,
  Target,
  RefreshCw,
  Building,
  ArrowLeft,
  ChevronRight,
  X,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  WandSparkles,
  Eye as EyeIcon,
  Heart,
  Star,
  Award,
  Bookmark,
  Download,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ==================== TYPE DEFINITIONS ====================
type SectionStatus = "completed" | "drafting" | "not_started" | "pending" | "pending"

interface Section {
  id: string
  title: string
  status: SectionStatus
  content?: string
}

interface Comment {
  id: string
  user_id: string
  user_name: string
  user_role: "Sales" | "ACS" | "Supervisor"
  content: string
  timestamp: string
}

// ==================== AI TOOL RESPONSES ====================
const aiResponses = {
  cariReferensi: [
    { title: "Wardah Ramadan Campaign 2024", brand: "Wardah", program: "Sinetron Ramadan", status: "won", match: 95 },
    { title: "Wardah - Islamic Series", brand: "Wardah", program: "Sinetron", status: "won", match: 87 },
    { title: "Wardah Beauty Talk", brand: "Wardah", program: "Infotainment", status: "pitched", match: 82 },
  ],
  ideKreatif: [
    { type: "Segment Integration", idea: "Brand messaging 'Cantik Tanpa Batas' terintegrasi di opening & closing bumper sinetron dengan visual Ramadan yang hangat.", icon: "🎬" },
    { type: "Product Placement", idea: "Tampil natural di meja rias karakter utama dengan露出 produk Wardah Perfect Stay dalam adegan daily routine.", icon: "💄" },
    { type: "Social Digital", idea: "Instagram filter 'Ramadan Glow' yang bisa digunakan follower dengan branded AR effects.", icon: "📱" },
    { type: "Meet & Greet", idea: "Sesi meet & greet eksklusif dengan Brand Ambassador Wardah untuk pemenang voting karakter favorit.", icon: "⭐" },
  ],
  enhance: [
    "Tambahkan data rating sinetron Ramadan tahun sebelumnya untuk memperkuat rationale.",
    "Sebutkan 3 kompetitor yang sudah sponsor sinetron serupa untuk menunjukkan credibility.",
    "Tambahkan kutipan test case dari brand beauty lain yang sukses dengan format serupa.",
    "Strengthen CTA dengan timeline yang jelas: proposal deadline, production schedule, dan airing date.",
  ],
  visualRef: [
    { title: "Moodboard Ramadan", desc: "Warm, golden tones dengan Islamic geometric patterns", url: "/images/moodboard-ramadan.jpg" },
    { title: "Brand Integration Examples", desc: "Clean product placement yang tidak intrusive", url: "/images/brand-integration.jpg" },
    { title: "Social Campaign Assets", desc: "Instagram Stories & Feed templates", url: "/images/social-assets.jpg" },
  ],
}

// ==================== MAIN COMPONENT ====================
export default function ProposalBuilderPage() {
  const router = useRouter()
  const { userType, user } = useAuth()

  // URL params
  const [proposalId, setProposalId] = useState<string | null>(null)
  const [briefId, setBriefId] = useState<string | null>(null)
  const [action, setAction] = useState<string | null>(null)

  // Data states
  const [briefs, setBriefs] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [salesComments, setSalesComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get data based on params (with SSR safety)
  const selectedProposal = proposalId ? proposals.find(p => p.id === proposalId) : proposals[0]
  const selectedBrief = briefId
    ? briefs.find((b: any) => b.id === briefId)
    : briefs[0] || null

  const briefComments = salesComments.filter(c => c.proposal_id === selectedProposal?.id || c.proposal_id === "prop-1")

  // State management
  const [sections, setSections] = useState<Section[]>(proposalSections as Section[])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({})

  // Dialog states
  const [showAITools, setShowAITools] = useState(false)
  const [activeAITool, setActiveAITool] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showEditBrief, setShowEditBrief] = useState(false)
  const [showVisualRef, setShowVisualRef] = useState(false)

  // Comment state - convert from SalesComment to Comment type
  const [comments, setComments] = useState<Comment[]>(
    briefComments.map(c => ({
      id: c.id,
      user_id: c.user_id,
      user_name: c.user_name,
      user_role: c.user_role,
      content: c.content,
      timestamp: c.timestamp,
    }))
  )
  const [newComment, setNewComment] = useState("")

  // AI states
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResults, setAiResults] = useState<Record<string, any>>({})
  const [aiError, setAiError] = useState<string | null>(null)

  // General states
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)

  // Handle action params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setProposalId(params.get('proposal'))
    setBriefId(params.get('brief'))
    setAction(params.get('action'))

    const urlAction = params.get('action')
    if (urlAction === 'ideas') {
      setActiveAITool('ideKreatif')
      setShowAITools(true)
    } else if (urlAction === 'enhance') {
      setActiveAITool('enhance')
      setShowAITools(true)
    } else if (urlAction === 'visual') {
      setActiveAITool('visualRef')
      setShowAITools(true)
    }
  }, [])

  // Fetch data based on userType
  useEffect(() => {
    async function fetchData() {
      try {
        if (userType === 'demo') {
          setBriefs(mockBriefs)
          setProposals(mockProposals)
          setSalesComments(mockSalesComments)
        } else if (userType === 'new') {
          setBriefs([])
          setProposals([])
          setSalesComments([])
        } else {
          const [briefsRes, proposalsRes, commentsRes] = await Promise.all([
            fetch('/api/briefs'),
            fetch('/api/proposals'),
            fetch('/api/sales-comments')
          ])
          const briefsData = await briefsRes.json()
          const proposalsData = await proposalsRes.json()
          const commentsData = await commentsRes.json()

          if (briefsData.success) setBriefs(briefsData.data || [])
          if (proposalsData.success) setProposals(proposalsData.data || [])
          if (commentsData.success) setSalesComments(commentsData.data || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (userType) {
      fetchData()
    }
  }, [userType])

  // ==================== HANDLERS ====================
  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/proposal-builder?proposal=${selectedProposal?.id}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleSendReview = () => {
    alert("Proposal berhasil dikirim untuk review! Sales akan mendapat notifikasi.")
    router.push('/sales-review')
  }

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId)
  }

  const handleEditSection = (sectionId: string) => {
    setEditingSection(sectionId)
  }

  const handleSaveSection = () => {
    if (editingSection) {
      setSections(sections.map(s =>
        s.id === editingSection
          ? { ...s, status: 'drafting' as SectionStatus, content: sectionContent[editingSection] || s.content }
          : s
      ))
      setEditingSection(null)
      handleSave()
    }
  }

  const handleCompleteSection = (sectionId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, status: 'completed' as SectionStatus } : s
    ))
    handleSave()
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        user_id: "user-1",
        user_name: "Rina A.",
        user_role: "Supervisor",
        content: newComment,
        timestamp: "Baru saja"
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const handleGenerateVisual = () => {
    setGeneratingImage(true)
    setTimeout(() => {
      setGeneratingImage(false)
      setShowVisualRef(true)
    }, 2000)
  }

  // ==================== AI HANDLERS ====================
  const handleAICall = async (action: string, params: any) => {
    setAiLoading(true)
    setAiError(null)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params })
      })
      const data = await response.json()
      if (data.success) {
        setAiResults({ ...aiResults, [action]: data.data })
        return data.data
      } else {
        setAiError(data.error || 'AI request failed')
        return null
      }
    } catch (error) {
      console.error('AI error:', error)
      setAiError('Failed to call AI')
      return null
    } finally {
      setAiLoading(false)
    }
  }

  const handleGenerateIdeas = async () => {
    if (!selectedBrief) return
    setAiLoading(true)
    try {
      const ideas = await handleAICall('generateIdeas', {
        brandName: selectedBrief.brand_name,
        industry: selectedBrief.industry_category,
        programType: selectedBrief.program,
        targetAudience: selectedBrief.target_audience,
        budget: selectedBrief.budget_range
      })
      if (ideas) {
        // Parse ideas from AI response
        const parsedIdeas = ideas.split('\n').filter((line: string) => line.trim() && (line.includes('**') || line.includes('1.') || line.includes('2.') || line.includes('3.') || line.includes('4.') || line.includes('5.')))
        setAiResults({ ...aiResults, ideKreatif: parsedIdeas })
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleEnhanceProposal = async () => {
    if (!selectedBrief) return
    setAiLoading(true)
    try {
      const suggestions = await handleAICall('improveText', {
        text: selectedBrief.objective || selectedBrief.notes || '',
        type: 'Proposal Enhancement'
      })
      if (suggestions) {
        const parsedSuggestions = suggestions.split('\n').filter((line: string) => line.trim() && line.startsWith('-'))
        setAiResults({ ...aiResults, enhance: parsedSuggestions.length > 0 ? parsedSuggestions : [suggestions] })
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleSearchReference = async () => {
    if (!selectedBrief) return
    setAiLoading(true)
    try {
      const references = await handleAICall('searchReference', {
        topic: selectedBrief.program,
        industry: selectedBrief.industry_category
      })
      if (references) {
        // Create mock reference structure
        const refs = [
          { title: `${selectedBrief.brand_name} Campaign Reference 1`, brand: selectedBrief.brand_name, program: selectedBrief.program, status: "won", match: 92 },
          { title: `${selectedBrief.brand_name} Similar Program`, brand: selectedBrief.brand_name, program: selectedBrief.program, status: "won", match: 85 },
        ]
        setAiResults({ ...aiResults, cariReferensi: refs })
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleVisualReference = async () => {
    if (!selectedBrief) return
    setAiLoading(true)
    try {
      await handleAICall('brandDNA', {
        brandName: selectedBrief.brand_name,
        industry: selectedBrief.industry_category
      })
      // Visual refs are generated based on brand analysis
      setAiResults({
        ...aiResults,
        visualRef: [
          { title: `${selectedBrief.brand_name} Moodboard`, desc: `Visual concept for ${selectedBrief.program}`, url: '' },
        ]
      })
      setShowVisualRef(true)
    } finally {
      setAiLoading(false)
    }
  }

  // ==================== AI TOOL DATA ====================
  const aiTools = [
    {
      id: "cariReferensi",
      icon: Search,
      title: "Cari Referensi",
      desc: "Temukan proposal serupa",
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      id: "brandExplorer",
      icon: Globe,
      title: "Brand Explorer",
      desc: "Analisis brand lebih dalam",
      color: "#16a34a",
      bg: "#dcfce7",
      href: "/brand-idea-explorer"
    },
    {
      id: "ideKreatif",
      icon: Lightbulb,
      title: "Ide Kreatif",
      desc: "Generate ide integrasi",
      color: "#d97706",
      bg: "#fef3c7"
    },
    {
      id: "enhance",
      icon: Wand2,
      title: "Enhance",
      desc: "Perkuat proposal",
      color: "#9333ea",
      bg: "#f3e8ff"
    },
    {
      id: "visualRef",
      icon: Image,
      title: "Visual Ref",
      desc: "Buat moodboard",
      color: "#2563eb",
      bg: "#fef2f2"
    },
  ]

  // Loading or no data state
  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <Loader2 size={40} className="animate-spin" style={{ color: '#2563eb', margin: '0 auto' }} />
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Empty state for new users
  if (!selectedBrief) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', padding: '32px' }}>
          <FileText size={64} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Belum Ada Brief</h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>
            {userType === 'new'
              ? 'Mulai dengan membuat brief baru terlebih dahulu.'
              : 'Pilih brief dari daftar atau buat brief baru.'}
          </p>
          <Link href="/brief-intake?action=new">
            <Button style={{ backgroundColor: '#2563eb' }}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              Buat Brief Baru
            </Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/dashboard"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#64748b', fontSize: '14px' }}
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                  {selectedBrief.brand_name} - {selectedBrief.program}
                </h1>
                <Badge variant="blue" style={{ fontSize: '10px', padding: '4px 8px' }}>{selectedBrief.program}</Badge>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>PIC Sales: {selectedBrief.pic_sales}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              size="sm"
              style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '12px', paddingRight: '12px' }}
              onClick={() => router.push('/brief-intake')}
            >
              <FileText size={14} style={{ marginRight: '6px' }} />
              Edit Brief
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '12px', paddingRight: '12px' }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} /> : <Save size={14} style={{ marginRight: '6px' }} />}
              {saved ? 'Tersimpan!' : 'Simpan Draft'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '12px', paddingRight: '12px' }}
              onClick={() => setShowShare(true)}
            >
              <Share2 size={14} style={{ marginRight: '6px' }} />
              Bagikan
            </Button>
            <Button
              size="sm"
              style={{ backgroundColor: '#2563eb', paddingLeft: '12px', paddingRight: '12px' }}
              onClick={handleSendReview}
            >
              <Send size={14} style={{ marginRight: '6px' }} />
              Kirim Review
            </Button>
          </div>
        </div>

        {/* Last Saved */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#64748b" />
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Terakhir disimpan: {saved ? 'Baru saja' : 'Hari ini, 14:32'}
            </span>
          </div>
          <Badge variant="amber" style={{ fontSize: '10px', padding: '2px 8px' }}>Draft</Badge>
          <Link href="/sales-review" style={{ marginLeft: 'auto', textDecoration: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Lihat Feedback Sales
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Brief Summary */}
        <div style={{
          background: 'linear-gradient(180deg, #ffffff, #fafafa)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '16px'
        }}>
          {[
            { label: "Brand", value: selectedBrief.brand_name },
            { label: "Kategori", value: selectedBrief.industry_category },
            { label: "PIC Sales", value: selectedBrief.pic_sales.split(' ')[0] },
            { label: "Program", value: selectedBrief.program },
            { label: "Sponsor Type", value: selectedBrief.sponsorship_type },
            { label: "Budget", value: selectedBrief.budget_range.split(' ')[0] + ' - ' + selectedBrief.budget_range.split(' ')[2] },
            { label: "Audience", value: selectedBrief.target_audience },
            { label: "Deadline", value: selectedBrief.deadline },
          ].map((item, index) => (
            <div key={index}>
              <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>{item.label}</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          {/* Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* AI Tools */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '6px', backgroundColor: '#9333ea', borderRadius: '8px' }}>
                  <Sparkles size={14} color="white" />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>AI Tools</h3>
                <Link href="/brand-idea-explorer" style={{ marginLeft: 'auto', textDecoration: 'none', fontSize: '12px', color: '#9333ea', fontWeight: 600 }}>
                  Lihat Brand Explorer
                  <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {aiTools.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        if (tool.href) {
                          router.push(tool.href)
                        } else {
                          setActiveAITool(tool.id)
                          setShowAITools(true)
                        }
                      }}
                      style={{
                        padding: '16px 12px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: tool.bg,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <IconComponent size={18} color={tool.color} />
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{tool.title}</p>
                      <p style={{ fontSize: '9px', color: '#94a3b8' }}>{tool.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Proposal Structure */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '6px', backgroundColor: '#2563eb', borderRadius: '8px' }}>
                    <FileText size={14} color="white" />
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Proposal Structure</h3>
                </div>
                <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', padding: '6px 12px' }}>
                  <Plus size={14} style={{ marginRight: '6px' }} />
                  Tambah
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sections.map((section, index) => (
                  <div key={section.id}>
                    <div
                      onClick={() => handleSectionClick(section.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: section.status === 'completed' ? '#f0fdf4' : section.status === 'drafting' ? '#fef3c7' : '#f8fafc',
                        borderRadius: '10px',
                        border: `1px solid ${section.status === 'completed' ? '#86efac' : section.status === 'drafting' ? '#fcd34d' : '#e2e8f0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8', width: '20px' }}>{index + 1}.</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{section.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Badge
                          variant={
                            section.status === 'completed' ? 'green' :
                            section.status === 'drafting' ? 'amber' : 'gray'
                          }
                          style={{ fontSize: '10px', padding: '2px 8px' }}
                        >
                          {section.status === 'completed' ? 'Selesai' : section.status === 'drafting' ? 'Drafting' : 'Belum'}
                        </Badge>
                        {section.status === 'completed' ? (
                          <CheckCircle size={16} color="#16a34a" />
                        ) : section.status === 'drafting' ? (
                          <Clock size={16} color="#d97706" />
                        ) : (
                          <Circle size={16} color="#cbd5e1" />
                        )}
                        <ChevronRight
                          size={16}
                          color="#94a3b8"
                          style={{
                            transform: activeSection === section.id ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </div>
                    </div>

                    {/* Expanded Section Content */}
                    {activeSection === section.id && (
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        marginTop: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        {editingSection === section.id ? (
                          <div>
                            <textarea
                              value={sectionContent[section.id] || ''}
                              onChange={(e) => setSectionContent({ ...sectionContent, [section.id]: e.target.value })}
                              placeholder={`Tulis konten untuk ${section.title}...`}
                              rows={6}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '13px',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: 'inherit'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <Button
                                size="sm"
                                style={{ backgroundColor: '#2563eb' }}
                                onClick={handleSaveSection}
                              >
                                <Check size={14} style={{ marginRight: '4px' }} />
                                Simpan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSection(null)}
                              >
                                Batal
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                                {sectionContent[section.id] || 'Klik tombol Edit untuk menambahkan konten...'}
                              </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditSection(section.id)}
                              >
                                <FileText size={14} style={{ marginRight: '4px' }} />
                                Edit
                              </Button>
                              {section.status !== 'completed' && (
                                <Button
                                  size="sm"
                                  style={{ backgroundColor: '#16a34a' }}
                                  onClick={() => handleCompleteSection(section.id)}
                                >
                                  <CheckCircle size={14} style={{ marginRight: '4px' }} />
                                  Tandai Selesai
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Preview */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Preview Proposal</h3>
              <div
                style={{
                  background: generatingImage
                    ? 'linear-gradient(180deg, #1e293b, #0f172a)'
                    : 'linear-gradient(180deg, #1e293b, #0f172a)',
                  borderRadius: '12px',
                  padding: '24px',
                  aspectRatio: '3/4',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {generatingImage ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Loader2 size={32} color="white" className="animate-spin" />
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '12px' }}>Generating preview...</p>
                  </div>
                ) : (
                  <>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>PF</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{selectedBrief.brand_name}</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{selectedBrief.program}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Sponsorship Proposal</p>
                    </div>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                style={{ width: '100%', marginTop: '16px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}
                onClick={() => setShowPreview(true)}
              >
                <EyeIcon size={14} style={{ marginRight: '6px' }} />
                Lihat Preview
              </Button>
              <Button
                variant="outline"
                style={{ width: '100%', marginTop: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}
                onClick={handleGenerateVisual}
                disabled={generatingImage}
              >
                <WandSparkles size={14} style={{ marginRight: '6px' }} />
                {generatingImage ? 'Generating...' : 'Generate Image'}
              </Button>
            </div>

            {/* Comments */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '6px', backgroundColor: '#2563eb', borderRadius: '8px' }}>
                  <MessageSquare size={14} color="white" />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Komentar</h3>
                <Badge variant="red" style={{ fontSize: '10px', padding: '2px 8px', marginLeft: 'auto' }}>{comments.length}</Badge>
              </div>
              <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '16px' }}>
                {comments.map((comment) => (
                  <div key={comment.id} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: comment.user_role === 'Sales' ? '#2563eb' : '#9333ea',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {comment.user_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{comment.user_name}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{comment.timestamp}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4, marginTop: '4px' }}>{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/sales-review">
                <Button size="sm" style={{ width: '100%', backgroundColor: '#2563eb', marginBottom: '8px' }}>
                  Lihat Semua Komentar
                </Button>
              </Link>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', backgroundColor: '#f8fafc' }}>
                <textarea
                  placeholder="Tulis komentar..."
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
                <Button
                  size="sm"
                  style={{ width: '100%', marginTop: '8px', backgroundColor: '#2563eb' }}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Kirim Komentar
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc, white)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '16px'
            }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>Aksi Cepat</p>
              {[
                { icon: ZoomIn, label: "Zoom Preview", action: () => setShowPreview(true) },
                { icon: Share2, label: "Generate Link", action: handleShare },
                { icon: RefreshCw, label: "Update Status", action: () => router.push('/sales-review') },
                { icon: Search, label: "Cari Referensi", action: () => { setActiveAITool('cariReferensi'); setShowAITools(true); } },
              ].map((action, index) => {
                const IconComponent = action.icon
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    <IconComponent size={14} color="#64748b" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ==================== AI TOOLS MODAL ==================== */}
        {showAITools && activeAITool && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowAITools(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100,
              }}
            />

            {/* Modal */}
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                maxHeight: '80vh',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 101,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                background: 'linear-gradient(90deg, #f8fafc, white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', backgroundColor: '#9333ea', borderRadius: '10px' }}>
                    <Sparkles size={18} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {activeAITool === 'cariReferensi' && 'Cari Referensi'}
                      {activeAITool === 'ideKreatif' && 'Ide Kreatif'}
                      {activeAITool === 'enhance' && 'Enhance Proposal'}
                      {activeAITool === 'visualRef' && 'Visual Reference'}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Generated by AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAITools(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} color="#64748b" />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                {/* Cari Referensi */}
                {activeAITool === 'cariReferensi' && (
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                      Ditemukan {aiResponses.cariReferensi.length} proposal serupa:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {aiResponses.cariReferensi.map((ref, i) => (
                        <div key={i} style={{
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#9333ea'
                          e.currentTarget.style.backgroundColor = '#faf5ff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0'
                          e.currentTarget.style.backgroundColor = '#f8fafc'
                        }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{ref.title}</h4>
                            <Badge
                              style={{
                                backgroundColor: ref.match >= 90 ? '#16a34a' : ref.match >= 80 ? '#2563eb' : '#64748b',
                                color: 'white',
                                fontSize: '10px'
                              }}
                            >
                              {ref.match}% Match
                            </Badge>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>{ref.program}</p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <Button size="sm" variant="outline" style={{ padding: '6px 12px' }}>
                              <EyeIcon size={12} style={{ marginRight: '4px' }} />
                              Lihat
                            </Button>
                            <Button size="sm" variant="outline" style={{ padding: '6px 12px' }}>
                              <Copy size={12} style={{ marginRight: '4px' }} />
                              Gunakan Template
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ide Kreatif */}
                {activeAITool === 'ideKreatif' && (
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                      {aiResponses.ideKreatif.length} ide integrasi kreatif untuk {selectedBrief.brand_name}:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {aiResponses.ideKreatif.map((idea, i) => (
                        <div key={i} style={{
                          padding: '16px',
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#d97706'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{idea.icon}</span>
                            <Badge variant="amber" style={{ fontSize: '10px' }}>{idea.type}</Badge>
                          </div>
                          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{idea.idea}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      style={{ width: '100%', marginTop: '16px', backgroundColor: '#2563eb' }}
                      onClick={() => {
                        setShowAITools(false)
                        router.push('/brand-idea-explorer?action=ideas')
                      }}
                    >
                      <Lightbulb size={14} style={{ marginRight: '6px' }} />
                      Lihat Detail di Brand Explorer
                    </Button>
                  </div>
                )}

                {/* Enhance */}
                {activeAITool === 'enhance' && (
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                      Saran untuk memperkuat proposal {selectedBrief.brand_name}:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {aiResponses.enhance.map((tip, i) => (
                        <div key={i} style={{
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#9333ea',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {i + 1}
                          </div>
                          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      style={{ width: '100%', marginTop: '16px', backgroundColor: '#9333ea' }}
                      onClick={() => {
                        setSections(sections.map(s => ({
                          ...s,
                          status: s.status === 'not_started' ? 'drafting' : s.status
                        })))
                        setShowAITools(false)
                      }}
                    >
                      <Wand2 size={14} style={{ marginRight: '6px' }} />
                      Apply Semua Saran
                    </Button>
                  </div>
                )}

                {/* Visual Ref */}
                {activeAITool === 'visualRef' && (
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                      Visual reference untuk {selectedBrief.brand_name} - {selectedBrief.program}:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {aiResponses.visualRef.map((ref, i) => (
                        <div key={i} style={{
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}>
                          <div style={{
                            width: '100%',
                            height: '80px',
                            background: `linear-gradient(135deg, #${['2563eb', 'dc2626', '16a34a'][i]}20, #f8fafc)`,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '8px'
                          }}>
                            <Image size={24} color="#94a3b8" />
                          </div>
                          <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>{ref.title}</h4>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      style={{ width: '100%', marginTop: '16px', backgroundColor: '#2563eb' }}
                      onClick={handleGenerateVisual}
                      disabled={generatingImage}
                    >
                      {generatingImage ? (
                        <>
                          <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} />
                          Generating...
                        </>
                      ) : (
                        <>
                          <WandSparkles size={14} style={{ marginRight: '6px' }} />
                          Generate Custom Moodboard
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}>
                <Button variant="outline" size="sm" onClick={() => setShowAITools(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ==================== PREVIEW MODAL ==================== */}
        {showPreview && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowPreview(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 100,
              }}
            />

            {/* Preview Modal */}
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '800px',
                maxHeight: '90vh',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 101,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Preview Proposal</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="sm" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                    <Share2 size={14} style={{ marginRight: '4px' }} />
                    Share
                  </Button>
                  <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '12px', paddingRight: '12px' }}>
                    <Download size={14} style={{ marginRight: '4px' }} />
                    Download PDF
                  </Button>
                  <button
                    onClick={() => setShowPreview(false)}
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={18} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#f1f5f9' }}>
                {/* Cover Slide */}
                <div style={{
                  background: 'linear-gradient(180deg, #1e293b, #0f172a)',
                  borderRadius: '16px',
                  padding: '48px',
                  aspectRatio: '16/9',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>PF</span>
                    </div>
                    <Badge style={{ backgroundColor: '#2563eb', color: 'white' }}>CONFIDENTIAL</Badge>
                  </div>
                  <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{selectedBrief.brand_name}</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>{selectedBrief.program}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Sponsorship Proposal</p>
                      <p style={{ fontSize: '14px', color: 'white' }}>by Rectoverso</p>
                    </div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>2025</p>
                  </div>
                </div>

                {/* Brief Summary */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Brief Summary</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Brand</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedBrief.brand_name}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Program</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedBrief.program}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Budget</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedBrief.budget_range}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Audience</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedBrief.target_audience}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Proposal Progress</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                    {sections.slice(0, 5).map((section, i) => (
                      <div key={i} style={{
                        padding: '12px',
                        backgroundColor: section.status === 'completed' ? '#f0fdf4' : section.status === 'drafting' ? '#fef3c7' : '#f8fafc',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: section.status === 'completed' ? '#16a34a' : section.status === 'drafting' ? '#d97706' : '#e2e8f0',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px'
                        }}>
                          {section.status === 'completed' ? (
                            <Check size={12} color="white" />
                          ) : (
                            <span style={{ fontSize: '10px', color: '#64748b' }}>{i + 1}</span>
                          )}
                        </div>
                        <p style={{ fontSize: '10px', color: '#64748b' }}>{section.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== SHARE MODAL ==================== */}
        {showShare && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowShare(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100,
              }}
            />

            {/* Share Modal */}
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 101,
                overflow: 'hidden',
              }}
            >
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Bagikan Proposal</h3>
                <button
                  onClick={() => setShowShare(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} color="#64748b" />
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Link proposal berhasil disalin!</p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/proposal-builder?proposal=${selectedProposal?.id}`}
                    readOnly
                    style={{
                      flex: 1,
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '12px',
                      color: '#475569'
                    }}
                  />
                  <button
                    onClick={handleShare}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: copiedLink ? '#16a34a' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    {copiedLink ? 'Tersalin' : 'Salin'}
                  </button>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Kirim ke:</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" size="sm" style={{ flex: 1 }}>
                      <MessageSquare size={14} style={{ marginRight: '4px' }} />
                      Sales Team
                    </Button>
                    <Button variant="outline" size="sm" style={{ flex: 1 }}>
                      <Building size={14} style={{ marginRight: '4px' }} />
                      Client
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== VISUAL REF MODAL ==================== */}
        {showVisualRef && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowVisualRef(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 100,
              }}
            />

            {/* Visual Ref Modal */}
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '900px',
                maxHeight: '90vh',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 101,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '10px' }}>
                    <WandSparkles size={18} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Generated Moodboard</h3>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{selectedBrief.brand_name} - {selectedBrief.program}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="sm">
                    <Bookmark size={14} style={{ marginRight: '4px' }} />
                    Save
                  </Button>
                  <button
                    onClick={() => setShowVisualRef(false)}
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={18} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Content - Generated Image Preview */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #eff6ff 100%)',
                  borderRadius: '16px',
                  padding: '48px',
                  aspectRatio: '16/9',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginBottom: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative elements */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #fcd34d20, transparent)',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '40px',
                    width: '150px',
                    height: '150px',
                    background: 'linear-gradient(135deg, #f472b620, transparent)',
                    borderRadius: '50%'
                  }} />

                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ fontSize: '36px' }}>🌸</span>
                  </div>

                  <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {selectedBrief.brand_name}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px' }}>
                    {selectedBrief.program} Sponsorship Proposal
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Ramadan', 'Family', 'Beauty', 'Inspiring'].map((tag, i) => (
                      <span key={i} style={{
                        padding: '6px 16px',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Heart size={24} color="#d97706" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Emotional</h4>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>Family & Ramadan values</p>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#fce7f3',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Star size={24} color="#db2777" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Premium</h4>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>Beauty & elegance</p>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Award size={24} color="#2563eb" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Trusted</h4>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>Halal & quality</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}>
                <Button variant="outline" size="sm" onClick={handleGenerateVisual}>
                  <RefreshCw size={14} style={{ marginRight: '4px' }} />
                  Regenerate
                </Button>
                <Button size="sm" style={{ backgroundColor: '#2563eb' }}>
                  <Download size={14} style={{ marginRight: '4px' }} />
                  Download Image
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
