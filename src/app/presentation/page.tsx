"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { proposals as mockProposals } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import {
  Presentation,
  Search,
  Plus,
  Filter,
  Play,
  Eye,
  Download,
  ChevronRight,
  Clock,
  Building,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PresentationListPage() {
  const router = useRouter()
  const { userType } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [proposals, setProposals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data based on userType
  useEffect(() => {
    async function fetchData() {
      try {
        if (userType === 'demo') {
          setProposals(mockProposals)
        } else if (userType === 'new') {
          setProposals([])
        } else {
          const res = await fetch('/api/proposals')
          const data = await res.json()
          if (data.success && data.data) {
            setProposals(data.data)
          }
        }
      } catch (error) {
        console.error('Error fetching proposals:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (userType) {
      fetchData()
    }
  }, [userType])

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleStartPresentation = (proposalId: string) => {
    router.push(`/presentation/${proposalId}`)
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Presentation Mode
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Tampilkan proposal dalam mode full-screen untuk client presentation
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#eff6ff',
            borderRadius: '12px',
            border: '1px solid #93c5fd'
          }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Total Proposals</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#2563eb' }}>{proposals.length}</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#dcfce7',
            borderRadius: '12px',
            border: '1px solid #86efac'
          }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Ready to Present</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>{proposals.filter(p => p.status === 'ready').length}</p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fef3c7',
            borderRadius: '12px',
            border: '1px solid #fcd34d'
          }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Need Review</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#d97706' }}>{proposals.filter(p => ['drafting', 'need_input', 'revised'].includes(p.status)).length}</p>
          </div>
        </div>

        {/* Proposals List */}
        <div style={{
          background: 'linear-gradient(180deg, #ffffff, #fafafa)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'ready', 'drafting', 'revised'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: filterStatus === status ? '#2563eb' : '#f1f5f9',
                    color: filterStatus === status ? 'white' : '#64748b',
                  }}
                >
                  {status === 'all' ? 'Semua' : status === 'ready' ? 'Ready' : status === 'drafting' ? 'Drafting' : 'Revised'}
                </button>
              ))}
            </div>
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
          </div>

          {/* List */}
          <div style={{ padding: '16px' }}>
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '12px',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Presentation size={24} color="#2563eb" />
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{proposal.title}</h4>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building size={12} />
                      {proposal.program}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {proposal.deadline}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    proposal.status === "ready" ? "green" :
                    proposal.status === "need_input" ? "purple" :
                    proposal.status === "revised" ? "orange" :
                    proposal.status === "drafting" ? "amber" : "blue"
                  }
                >
                  {proposal.status === 'ready' ? 'Ready' :
                   proposal.status === 'drafting' ? 'Drafting' :
                   proposal.status === 'revised' ? 'Revised' :
                   proposal.status === 'need_input' ? 'Need Input' : proposal.status}
                </Badge>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ paddingLeft: '12px', paddingRight: '12px' }}
                    onClick={() => router.push('/proposal-builder')}
                  >
                    <Eye size={14} style={{ marginRight: '4px' }} />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    style={{ backgroundColor: '#2563eb', whiteSpace: 'nowrap', paddingLeft: '12px', paddingRight: '12px' }}
                    onClick={() => handleStartPresentation(proposal.id)}
                  >
                    <Play size={14} style={{ marginRight: '4px' }} />
                    Present
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#fef3c7',
          borderRadius: '12px',
          border: '1px solid #fcd34d'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', margin: 0, marginBottom: '8px' }}>💡 Tips Presentasi</h4>
          <ul style={{ fontSize: '12px', color: '#92400e', margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>Gunakan keyboard arrow keys untuk navigasi slide</li>
            <li>Tekan ESC untuk keluar dari fullscreen</li>
            <li>Gunakan tombol Share untuk generate link view-only untuk client</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  )
}
