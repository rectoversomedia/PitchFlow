"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { proposals as mockProposals, statusLabels, salesComments } from "@/lib/mock-data"
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  FolderOpen,
  Plus,
  MessageSquare,
  Search,
  Globe,
  ChevronRight,
  Zap,
  Rocket,
  Lightbulb,
  X,
  Calendar,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [briefs, setBriefs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Get user session
  useEffect(() => {
    const session = localStorage.getItem('pitchflow_session')
    const userType = localStorage.getItem('pitchflow_user_type')

    if (session) {
      setCurrentUser(JSON.parse(session))
    }
  }, [])

  // Fetch data based on user type
  useEffect(() => {
    async function fetchData() {
      const userType = localStorage.getItem('pitchflow_user_type') || 'demo'

      try {
        // Demo user - use mock data
        if (userType === 'demo') {
          setProposals(mockProposals)
          setBriefs(mockData.briefs)
          setIsLoading(false)
          return
        }

        // New user - empty data
        if (userType === 'new') {
          setProposals([])
          setBriefs([])
          setIsLoading(false)
          return
        }

        // Existing user - fetch real data
        const briefsRes = await fetch('/api/briefs')
        const briefsData = await briefsRes.json()
        if (briefsData.success && briefsData.data) {
          setBriefs(briefsData.data)
        }

        const proposalsRes = await fetch('/api/proposals')
        const proposalsData = await proposalsRes.json()
        if (proposalsData.success && proposalsData.data && proposalsData.data.length > 0) {
          setProposals(proposalsData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Mock data for demo
  const mockData = {
    briefs: [
      { id: "brief-1", brand_name: "Wardah", program: "Sinetron Ramadan", status: "new", created_at: "2025-05-19" },
      { id: "brief-2", brand_name: "OPPO", program: "Sinetron", status: "in_progress", created_at: "2025-05-18" },
      { id: "brief-3", brand_name: "Indomie", program: "Reality Show", status: "in_review", created_at: "2025-05-17" },
    ]
  }

  const getKpiCards = () => {
    const userType = localStorage.getItem('pitchflow_user_type') || 'demo'

    if (userType === 'demo') {
      return [
        { title: "New Briefs", value: 7, change: "+16%", icon: FileText, bgColor: "#dbeafe", iconColor: "#2563eb", borderColor: "#93c5fd", href: "/brief-intake?status=new" },
        { title: "In Progress", value: 18, change: "+12%", icon: TrendingUp, bgColor: "#fef3c7", iconColor: "#d97706", borderColor: "#fcd34d", href: "/brief-intake?status=in_progress" },
        { title: "Waiting Feedback", value: 9, change: "+29%", icon: Clock, bgColor: "#f3e8ff", iconColor: "#9333ea", borderColor: "#c4b5fd", href: "/sales-review?status=waiting" },
        { title: "Ready for Sales", value: 11, change: "+10%", icon: CheckCircle, bgColor: "#dcfce7", iconColor: "#16a34a", borderColor: "#86efac", href: "/sales-review?status=ready" },
      ]
    }

    if (userType === 'new') {
      return [
        { title: "New Briefs", value: 0, change: "0%", icon: FileText, bgColor: "#dbeafe", iconColor: "#2563eb", borderColor: "#93c5fd", href: "/brief-intake?status=new" },
        { title: "In Progress", value: 0, change: "0%", icon: TrendingUp, bgColor: "#fef3c7", iconColor: "#d97706", borderColor: "#fcd34d", href: "/brief-intake?status=in_progress" },
        { title: "Waiting Feedback", value: 0, change: "0%", icon: Clock, bgColor: "#f3e8ff", iconColor: "#9333ea", borderColor: "#c4b5fd", href: "/sales-review?status=waiting" },
        { title: "Ready for Sales", value: 0, change: "0%", icon: CheckCircle, bgColor: "#dcfce7", iconColor: "#16a34a", borderColor: "#86efac", href: "/sales-review?status=ready" },
      ]
    }

    // Existing user - real data
    const newBriefs = briefs.filter(b => b.status === 'new').length
    const inProgress = briefs.filter(b => b.status === 'in_progress').length
    const waiting = proposals.filter(p => p.status === 'need_input').length
    const ready = proposals.filter(p => p.status === 'ready').length

    return [
      { title: "New Briefs", value: newBriefs, change: "", icon: FileText, bgColor: "#dbeafe", iconColor: "#2563eb", borderColor: "#93c5fd", href: "/brief-intake?status=new" },
      { title: "In Progress", value: inProgress, change: "", icon: TrendingUp, bgColor: "#fef3c7", iconColor: "#d97706", borderColor: "#fcd34d", href: "/brief-intake?status=in_progress" },
      { title: "Waiting Feedback", value: waiting, change: "", icon: Clock, bgColor: "#f3e8ff", iconColor: "#9333ea", borderColor: "#c4b5fd", href: "/sales-review?status=waiting" },
      { title: "Ready for Sales", value: ready, change: "", icon: CheckCircle, bgColor: "#dcfce7", iconColor: "#16a34a", borderColor: "#86efac", href: "/sales-review?status=ready" },
    ]
  }

  const kpiCards = getKpiCards()

  const pipelineStages = [
    { id: "new_brief", title: "New Brief", color: "#2563eb", bgColor: "#eff6ff", borderColor: "#bfdbfe" },
    { id: "drafting", title: "Drafting", color: "#ea580c", bgColor: "#fff7ed", borderColor: "#fed7aa" },
    { id: "need_input", title: "Need Input", color: "#9333ea", bgColor: "#faf5ff", borderColor: "#e9d5ff" },
    { id: "revised", title: "Revised", color: "#2563eb", bgColor: "#fef2f2", borderColor: "#fecaca" },
    { id: "ready", title: "Ready", color: "#16a34a", bgColor: "#f0fdf4", borderColor: "#bbf7d0" },
  ]

  const getProposalsByStatus = (status: string) => {
    return proposals.filter(p => p.status === status)
  }

  const getRecentComments = () => {
    return salesComments.slice(0, 4)
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Selamat datang, {currentUser?.name?.split(" ")[0] || 'User'}! 👋</h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {localStorage.getItem('pitchflow_user_type') === 'demo' && 'Demo mode - Data sample untuk percobaan'}
              {localStorage.getItem('pitchflow_user_type') === 'new' && 'Mulai workflow baru dengan data kosong'}
              {localStorage.getItem('pitchflow_user_type') === 'existing' && 'Berikut ringkasan pipeline proposal sponsorship Anda'}
              {!localStorage.getItem('pitchflow_user_type') && 'Berikut ringkasan pipeline proposal sponsorship Anda'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/proposal-library">
              <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '14px', paddingRight: '14px' }}>
                <FolderOpen size={16} style={{ marginRight: '8px' }} />
                Library
              </Button>
            </Link>
            <Link href="/brief-intake?action=new">
              <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }}>
                <Plus size={16} style={{ marginRight: '8px' }} />
                Brief Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {kpiCards.map((kpi, index) => {
            const IconComponent = kpi.icon
            return (
              <div
                key={index}
                onClick={() => router.push(kpi.href)}
                style={{
                  background: `linear-gradient(135deg, ${kpi.bgColor}, white)`,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `2px solid ${kpi.borderColor}`,
                  boxShadow: `0 4px 15px ${kpi.borderColor}30`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 25px ${kpi.borderColor}50`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = `0 4px 15px ${kpi.borderColor}30`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{kpi.title}</p>
                    <p style={{ fontSize: '32px', fontWeight: 800, color: kpi.iconColor, marginTop: '8px', letterSpacing: '-1px' }}>{kpi.value}</p>
                    <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>{kpi.change}</p>
                  </div>
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    boxShadow: `0 2px 8px ${kpi.borderColor}50`
                  }}>
                    <IconComponent size={20} color={kpi.iconColor} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Proposal Pipeline */}
        <div style={{
          background: 'linear-gradient(180deg, #ffffff, #fafafa)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={20} color="#2563eb" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Proposal Pipeline</h2>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>
              19-25 Mei 2025
            </span>
          </div>

          {/* Pipeline Kanban */}
          <div style={{ display: 'flex', gap: '16px', padding: '20px', overflowX: 'auto' }}>
            {pipelineStages.map((stage) => {
              const stageProposals = getProposalsByStatus(stage.id)
              return (
                <div key={stage.id} style={{
                  flex: '1',
                  minWidth: '240px',
                  maxWidth: '300px',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: stage.bgColor,
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: stage.color
                      }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: stage.color }}>{stage.title}</span>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: stage.color,
                      backgroundColor: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {stageProposals.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {stageProposals.slice(0, 3).map((proposal) => (
                      <div
                        key={proposal.id}
                        onClick={() => router.push(`/proposal-builder?id=${proposal.id}`)}
                        style={{
                          padding: '14px',
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = stage.color
                          e.currentTarget.style.boxShadow = `0 4px 12px ${stage.color}20`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{proposal.brand_name}</h4>
                        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>{proposal.program}</p>
                        <Badge variant={
                          proposal.status === 'ready' ? 'green' :
                          proposal.status === 'drafting' ? 'orange' :
                          proposal.status === 'revised' ? 'red' :
                          proposal.status === 'need_input' ? 'purple' : 'blue'
                        }>
                          {statusLabels[proposal.status] || proposal.status}
                        </Badge>
                      </div>
                    ))}
                    {stageProposals.length > 3 && (
                      <button
                        onClick={() => router.push(`/proposal-library?status=${stage.id}`)}
                        style={{
                          padding: '10px',
                          backgroundColor: 'transparent',
                          border: '1px dashed #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '12px',
                          color: '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        Lihat semua ({stageProposals.length})
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions & AI Suggestions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Quick Actions */}
          {(() => {
            const quickActions = [
              { label: "Brief Baru", icon: Plus, bgColor: "linear-gradient(135deg, #fef2f2, #fee2e2)", color: "#2563eb", borderColor: "#fecaca", href: "/brief-intake?action=new" },
              { label: "Buat Proposal", icon: FileText, bgColor: "linear-gradient(135deg, #eff6ff, #dbeafe)", color: "#2563eb", borderColor: "#93c5fd", href: "/proposal-builder?action=new" },
              { label: "Library", icon: FolderOpen, bgColor: "linear-gradient(135deg, #f0fdf4, #dcfce7)", color: "#16a34a", borderColor: "#86efac", href: "/proposal-library" },
              { label: "Brand Explorer", icon: Globe, bgColor: "linear-gradient(135deg, #fef3c7, #fde68a)", color: "#d97706", borderColor: "#fcd34d", href: "/brand-idea-explorer" },
            ]
            return (
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Rocket size={20} color="#2563eb" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Quick Actions</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <Link
                    key={index}
                    href={action.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        padding: '16px',
                        background: action.bgColor,
                        borderRadius: '12px',
                        border: `1px solid ${action.borderColor}`,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <IconComponent size={18} color={action.color} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{action.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
            )}
          </div>

          {/* AI Suggestions */}
          {(() => {
            const aiSuggestions = [
              { title: "Similar Proposal", desc: "5 proposal serupa ditemukan", icon: Search, gradient: "linear-gradient(135deg, #f5f3ff, #ede9fe)", borderColor: "#c4b5fd", badge: "#7c3aed", href: "/proposal-library?tab=won" },
              { title: "Improve Proposal", desc: "3 bagian bisa diperkuat", icon: Zap, gradient: "linear-gradient(135deg, #fef3c7, #fde68a)", borderColor: "#fcd34d", badge: "#ca8a04", href: "/proposal-builder?action=enhance" },
              { title: "Creative Ideas", desc: "Ide integrasi brand fresh", icon: Lightbulb, gradient: "linear-gradient(135deg, #dcfce7, #bbf7d0)", borderColor: "#86efac", badge: "#15803d", href: "/brand-idea-explorer?action=ideas" },
            ]
            return (

        {/* Recent Activity */}
        <div style={{
          background: 'linear-gradient(180deg, #ffffff, #fafafa)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginTop: '24px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageSquare size={20} color="#2563eb" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Aktivitas Sales Feedback</h2>
            </div>
            <Link href="/sales-review" style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
              Lihat semua →
            </Link>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {getRecentComments().map((comment, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {comment.user_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{comment.user_name}</p>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{comment.user_role}</p>
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: 'auto' }}>{comment.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{comment.content}</p>
                </div>
              ))}
            </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
