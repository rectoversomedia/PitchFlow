"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { libraryProposals, statusLabels, currentUser } from "@/lib/mock-data"
import { LibraryProposal } from "@/lib/types"
import {
  Plus,
  Search,
  FileText,
  Upload,
  Download,
  Eye,
  Trophy,
  Clock,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Calendar,
  Building,
  Tag,
  Sparkles,
  ChevronRight,
  FolderOpen,
  Award,
  X,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const stats = [
  { label: "Total Proposal", value: 128, color: "#2563eb", bgColor: "#eff6ff", borderColor: "#93c5fd", icon: FileText },
  { label: "Proposal Menang", value: 78, color: "#16a34a", bgColor: "#dcfce7", borderColor: "#86efac", icon: Trophy },
  { label: "Sedang Diproses", value: 32, color: "#d97706", bgColor: "#fef3c7", borderColor: "#fcd34d", icon: Clock },
  { label: "Win Rate", value: "61%", color: "#9333ea", bgColor: "#f3e8ff", borderColor: "#c4b5fd", icon: TrendingUp },
]

const tabs = [
  { id: "all", label: "Semua", count: 128 },
  { id: "won", label: "Menang", count: 78 },
  { id: "pitched", label: "Pitched", count: 35 },
  { id: "lost", label: "Tidak Menang", count: 15 },
  { id: "template", label: "Template", count: 12 },
]

export default function ProposalLibraryPage() {
  const router = useRouter()
  
  const initialTab = "all"

  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProposal, setSelectedProposal] = useState<LibraryProposal | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [copied, setCopied] = useState(false)

  const filteredProposals = libraryProposals.filter(p => {
    const matchesTab = activeTab === 'all' || p.status === activeTab
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleViewDetail = (proposal: LibraryProposal) => {
    setSelectedProposal(proposal)
    setShowDetail(true)
  }

  const handleUseTemplate = (proposal: LibraryProposal) => {
    router.push(`/proposal-builder?template=${proposal.id}`)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/proposal-library?tab=${activeTab}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Proposal Library
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Pusat referensi semua proposal dan case study
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '14px', paddingRight: '14px' }}>
              <Upload size={16} style={{ marginRight: '8px' }} />
              Upload
            </Button>
            <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }} onClick={() => router.push('/proposal-builder?action=new')}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              Proposal Baru
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${stat.bgColor}, white)`,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `2px solid ${stat.borderColor}`,
                  boxShadow: `0 4px 15px ${stat.borderColor}30`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{stat.label}</p>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: stat.color, marginTop: '8px', letterSpacing: '-1px' }}>{stat.value}</p>
                  </div>
                  <div style={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    boxShadow: `0 2px 8px ${stat.borderColor}50`
                  }}>
                    <IconComponent size={18} color={stat.color} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content */}
        <div style={{
          background: 'linear-gradient(180deg, #ffffff, #fafafa)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(90deg, #f8fafc, white)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? '#2563eb' : '#f1f5f9',
                    color: activeTab === tab.id ? 'white' : '#64748b',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Cari proposal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: 'white',
                    width: '240px'
                  }}
                />
              </div>
              <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                <Filter size={14} style={{ marginRight: '6px' }} />
                Filter
              </Button>
              <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? '#2563eb' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <Grid3X3 size={14} color={viewMode === 'grid' ? 'white' : '#64748b'} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? '#2563eb' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <List size={14} color={viewMode === 'list' ? 'white' : '#64748b'} />
                </button>
              </div>
            </div>
          </div>

          {/* Proposal Grid/List */}
          <div style={{ padding: '24px' }}>
            {viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {filteredProposals.slice(0, 8).map((proposal, index) => (
                  <div
                    key={proposal.id}
                    onClick={() => handleViewDetail(proposal)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px #f1f5f9'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                      e.currentTarget.style.borderColor = '#2563eb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px #f1f5f9'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      height: '100px',
                      background: `linear-gradient(135deg, #${['2563eb', '16a34a', 'd97706', '9333ea', 'dc2626', '0891b2', 'be185d', 'ca8a04'][index % 8]}15, #f8fafc)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <FolderOpen size={32} color="#94a3b8" />
                      {proposal.status === "won" && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: '#fcd34d',
                          borderRadius: '50%',
                          padding: '4px'
                        }}>
                          <Trophy size={14} color="#92400e" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{proposal.title}</h4>
                          <p style={{ fontSize: '11px', color: '#64748b' }}>{proposal.program}</p>
                        </div>
                        <Badge
                          variant={
                            proposal.status === "won" ? "green" :
                            proposal.status === "pitched" ? "blue" :
                            proposal.status === "lost" ? "red" : "gray"
                          }
                          style={{ fontSize: '9px', padding: '2px 6px' }}
                        >
                          {statusLabels[proposal.status]}
                        </Badge>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '10px',
                          color: '#64748b'
                        }}>{proposal.sponsorship_type.split(' ')[0]}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '10px',
                          color: '#64748b'
                        }}>{proposal.year}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '10px',
                          color: '#64748b'
                        }}>{proposal.slides_count} slides</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>Dilihat: {proposal.last_viewed}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetail(proposal)
                            }}
                            style={{ padding: '4px', backgroundColor: '#f1f5f9', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                          >
                            <Eye size={12} color="#64748b" />
                          </button>
                          <button style={{ padding: '4px', backgroundColor: '#f1f5f9', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                            <Download size={12} color="#64748b" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div>
                {filteredProposals.map((proposal, index) => (
                  <div
                    key={proposal.id}
                    onClick={() => handleViewDetail(proposal)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: `linear-gradient(135deg, #${['2563eb', '16a34a', 'd97706', '9333ea', 'dc2626'][index % 5]}15, #f8fafc)`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FolderOpen size={20} color="#64748b" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{proposal.title}</h4>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>{proposal.program} • {proposal.year}</p>
                    </div>
                    <Badge
                      variant={
                        proposal.status === "won" ? "green" :
                        proposal.status === "pitched" ? "blue" :
                        proposal.status === "lost" ? "red" : "gray"
                      }
                    >
                      {statusLabels[proposal.status] || proposal.status}
                    </Badge>
                    <span style={{ fontSize: '12px', color: '#94a3b8', width: '80px' }}>{proposal.slides_count} slides</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetail(proposal)
                        }}
                        style={{ padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                      >
                        <Eye size={14} color="#64748b" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUseTemplate(proposal)
                        }}
                        style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                      >
                        <FileText size={14} color="white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Load More */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <button style={{
              padding: '12px 32px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Lihat Semua Proposal
            </button>
          </div>
        </div>

        {/* Upload CTA */}
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
          borderRadius: '16px',
          border: '2px dashed #fecaca',
          padding: '32px',
          textAlign: 'center'
        }}>
          <Upload size={32} color="#2563eb" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Upload Proposal Lama
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Perkaya library tim dengan proposal-proposal sukses sebelumnya
          </p>
          <Button size="sm" style={{ backgroundColor: '#2563eb' }}>
            <Upload size={14} style={{ marginRight: '8px' }} />
            Upload File
          </Button>
        </div>

        {/* ==================== DETAIL MODAL ==================== */}
        {showDetail && selectedProposal && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowDetail(false)}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FolderOpen size={24} color="#2563eb" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedProposal.title}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{selectedProposal.program}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} color="#64748b" />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Brand</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.brand_name}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Sponsor Type</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.sponsorship_type}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Year</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.year}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Slides</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{selectedProposal.slides_count} slides</p>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Tags</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedProposal.tags.map((tag, i) => (
                      <span key={i} style={{
                        padding: '6px 12px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: selectedProposal.status === 'won' ? '#f0fdf4' : '#f8fafc',
                  borderRadius: '12px',
                  border: `1px solid ${selectedProposal.status === 'won' ? '#86efac' : '#e2e8f0'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {selectedProposal.status === 'won' ? <Trophy size={16} color="#16a34a" /> : <Award size={16} color="#64748b" />}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                      {selectedProposal.status === 'won' ? 'Proposal Berhasil' : selectedProposal.status === 'pitched' ? 'Sudah Dipitch' : 'Reference'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {selectedProposal.status === 'won'
                      ? 'Proposal ini berhasil memenangkan sponsorship deal.'
                      : selectedProposal.status === 'pitched'
                      ? 'Proposal sudah pernah dipresentasikan ke client.'
                      : 'Dapat digunakan sebagai referensi untuk proposal baru.'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '8px'
              }}>
                <Button variant="outline" style={{ flex: 1 }}>
                  <Eye size={14} style={{ marginRight: '6px' }} />
                  Preview
                </Button>
                <Button variant="outline" style={{ flex: 1 }}>
                  <Download size={14} style={{ marginRight: '6px' }} />
                  Download
                </Button>
                <Button style={{ flex: 1, backgroundColor: '#2563eb' }} onClick={() => handleUseTemplate(selectedProposal)}>
                  <FileText size={14} style={{ marginRight: '6px' }} />
                  Gunakan Template
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
