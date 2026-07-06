"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { proposals as mockProposals, salesComments as mockSalesComments, statusLabels } from "@/lib/mock-data"
import { SalesComment } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import {
  Plus,
  Search,
  Send,
  MessageSquare,
  FileText,
  Clock,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Download,
  ChevronRight,
  Filter,
  Bell,
  ArrowRight,
  Sparkles,
  X,
  Loader2,
  Check,
  Paperclip,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const statusFilters = [
  { id: "all", label: "Semua", count: 12 },
  { id: "waiting", label: "Menunggu Feedback", count: 5 },
  { id: "revision", label: "Perlu Revisi", count: 4 },
  { id: "ready", label: "Siap untuk Sales", count: 3 },
]

export default function SalesReviewPage() {
  const router = useRouter()
  const { userType } = useAuth()

  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedProposalId, setSelectedProposalId] = useState<string>("prop-1")
  const [searchQuery, setSearchQuery] = useState("")
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<SalesComment[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [activeTab, setActiveTab] = useState<'comments' | 'history' | 'info'>('comments')

  // Fetch data based on userType
  useEffect(() => {
    async function fetchData() {
      try {
        if (userType === 'demo') {
          setProposals(mockProposals)
          setComments(mockSalesComments)
        } else if (userType === 'new') {
          setProposals([])
          setComments([])
        } else {
          const [proposalsRes, commentsRes] = await Promise.all([
            fetch('/api/proposals'),
            fetch('/api/sales-comments')
          ])
          const proposalsData = await proposalsRes.json()
          const commentsData = await commentsRes.json()

          if (proposalsData.success) setProposals(proposalsData.data || [])
          if (commentsData.success) setComments(commentsData.data || [])
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

  const selectedProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0]

  const getProposalComments = (proposal_id: string) => {
    return comments.filter(c => c.proposal_id === proposal_id)
  }

  const filteredProposals = proposals.filter(p => {
    if (activeFilter === "waiting") return p.status === "need_input"
    if (activeFilter === "revision") return p.status === "revised"
    if (activeFilter === "ready") return p.status === "ready"
    return true
  }).filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendComment = () => {
    if (!newComment.trim()) return
    setIsSending(true)
    setTimeout(() => {
      const comment: SalesComment = {
        id: `comment-${Date.now()}`,
        proposal_id: selectedProposalId,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: "Supervisor",
        content: newComment,
        timestamp: "Baru saja"
      }
      setComments([...comments, comment])
      setNewComment("")
      setIsSending(false)
      setSent(true)
      setTimeout(() => setSent(false), 2000)
    }, 1000)
  }

  const handleUpdateStatus = (status: string) => {
    alert(`Status proposal "${selectedProposal.title}" diupdate ke: ${status}`)
  }

  const handleSendToSales = () => {
    alert(`Proposal "${selectedProposal.title}" berhasil dikirim ke Sales!`)
    router.push('/dashboard')
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Sales Review
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Kelola feedback dari tim Sales untuk setiap proposal
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              size="sm"
              style={{ border: '1px solid #e2e8f0', backgroundColor: 'white' }}
              onClick={() => router.push('/proposal-builder')}
            >
              <Search size={16} style={{ marginRight: '8px' }} />
              Lihat Proposal
            </Button>
            <Button size="sm" style={{ backgroundColor: '#2563eb' }} onClick={handleSendToSales}>
              <Send size={16} style={{ marginRight: '8px' }} />
              Kirim ke Sales
            </Button>
          </div>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: activeFilter === filter.id ? 'none' : '1px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeFilter === filter.id ? '#2563eb' : 'white',
                color: activeFilter === filter.id ? 'white' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          {/* Proposal List */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #eff6ff, white)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '10px' }}>
                  <FileText size={18} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Daftar Proposal</h2>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{filteredProposals.length} proposal</p>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Cari proposal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 32px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    outline: 'none',
                    backgroundColor: 'white',
                    width: '160px'
                  }}
                />
              </div>
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredProposals.map((proposal, index) => {
                const isSelected = selectedProposalId === proposal.id
                const proposalComments = getProposalComments(proposal.id)
                return (
                  <div
                    key={proposal.id}
                    onClick={() => setSelectedProposalId(proposal.id)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: isSelected ? '#fef2f2' : 'white',
                      borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#f8fafc'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'white'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: `linear-gradient(135deg, #${['2563eb', '16a34a', 'd97706', '9333ea', 'dc2626'][index % 5]}15, #f8fafc)`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Building size={18} color="#64748b" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proposal.title}</h4>
                          {statusLabels[proposal.status] === "Input" && (
                            <AlertCircle size={14} color="#9333ea" />
                          )}
                          {proposalComments.length > 0 && (
                            <Badge variant="red" style={{ fontSize: '9px', padding: '2px 6px' }}>
                              {proposalComments.length}
                            </Badge>
                          )}
                        </div>
                        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>{proposal.program}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Badge
                            variant={
                              proposal.status === "ready" ? "green" :
                              proposal.status === "need_input" ? "purple" :
                              proposal.status === "revised" ? "orange" : "blue"
                            }
                            style={{ fontSize: '10px', padding: '2px 6px' }}
                          >
                            {statusLabels[proposal.status]}
                          </Badge>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={10} />{proposal.lastActivity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Comment Detail */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f1f5f9',
              background: 'linear-gradient(90deg, #fef2f2, white)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '10px' }}>
                  <MessageSquare size={18} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{selectedProposal.title}</h2>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{selectedProposal.program} • {selectedProposal.sponsorship_type}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', padding: '6px 10px' }}
                  onClick={() => router.push(`/proposal-builder?proposal=${selectedProposalId}`)}
                >
                  <Eye size={14} />
                </Button>
                <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', padding: '6px 10px' }}>
                  <Download size={14} />
                </Button>
              </div>
            </div>

            {/* Proposal Info */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Brand</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.brand_name}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>PIC Sales</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.pic_sales}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Deadline</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.deadline}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Status</p>
                  <Badge
                    variant={
                      selectedProposal.status === "ready" ? "green" :
                      selectedProposal.status === "need_input" ? "purple" :
                      selectedProposal.status === "revised" ? "orange" : "blue"
                    }
                    style={{ fontSize: '10px' }}
                  >
                    {statusLabels[selectedProposal.status]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
              {[
                { id: 'comments', label: 'Komentar' },
                { id: 'history', label: 'Riwayat Revisi' },
                { id: 'info', label: 'Info Proposal' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#64748b',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content based on tab */}
            {activeTab === 'comments' && (
              <div style={{ padding: '20px 24px', maxHeight: '400px', overflowY: 'auto' }}>
                {getProposalComments(selectedProposalId).map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: '16px',
                      backgroundColor: comment.user_role === "Sales" ? '#fef2f2' : '#f8fafc',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      border: `1px solid ${comment.user_role === "Sales" ? '#fecaca' : '#e2e8f0'}`
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: comment.user_role === "Sales" ? '#2563eb' : '#9333ea',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {comment.user_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{comment.user_name}</span>
                            <Badge
                              variant={comment.user_role === "Sales" ? "red" : "purple"}
                              style={{ fontSize: '9px', padding: '2px 6px', marginLeft: '8px' }}
                            >
                              {comment.user_role}
                            </Badge>
                          </div>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{comment.timestamp}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reply Input */}
                <div style={{
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginTop: '16px'
                }}>
                  <textarea
                    placeholder="Tulis komentar..."
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none',
                      backgroundColor: '#f8fafc',
                      fontFamily: 'inherit'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Paperclip size={14} />
                      Lampirkan File
                    </button>
                    <Button
                      size="sm"
                      style={{ backgroundColor: '#2563eb' }}
                      onClick={handleSendComment}
                      disabled={!newComment.trim() || isSending}
                    >
                      {sent ? (
                        <>
                          <Check size={14} style={{ marginRight: '6px' }} />
                          Terkirim!
                        </>
                      ) : isSending ? (
                        <>
                          <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send size={14} style={{ marginRight: '6px' }} />
                          Kirim Komentar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div style={{ padding: '24px' }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <Clock size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Belum ada riwayat revisi untuk proposal ini.
                  </p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Riwayat akan muncul setelah ada perubahan status.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Created</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.createdAt}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Last Updated</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.updatedAt}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Industry</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.industry}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Slides</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.slidesCount} slides</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { icon: Bell, label: "Minta Feedback", color: "#d97706", bgColor: "#fef3c7", text: "Hubungi Sales", action: () => alert("Notifikasi feedback dikirim ke Sales!") },
            { icon: RefreshCw, label: "Kirim untuk Revisi", color: "#2563eb", bgColor: "#eff6ff", text: "Update Proposal", action: () => handleUpdateStatus("revised") },
            { icon: CheckCircle, label: "Setujui Revisi", color: "#16a34a", bgColor: "#dcfce7", text: "Konfirmasi", action: () => handleUpdateStatus("approved") },
            { icon: ArrowRight, label: "Siap untuk Sales", color: "#9333ea", bgColor: "#f3e8ff", text: "Finalisasi", action: handleSendToSales },
          ].map((action, index) => {
            const IconComponent = action.icon
            return (
              <button
                key={index}
                onClick={action.action}
                style={{
                  padding: '16px',
                  background: `linear-gradient(135deg, ${action.bgColor}, white)`,
                  borderRadius: '12px',
                  border: `1px solid ${action.color}40`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}30`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px' }}>
                    <IconComponent size={16} color={action.color} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: action.color }}>{action.label}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#64748b' }}>{action.text}</p>
              </button>
            )
          })}
        </div>
      </div>
    </MainLayout>
  )
}
