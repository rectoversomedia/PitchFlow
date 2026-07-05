"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { brandExplorerData, briefs } from "@/lib/mock-data"
import {
  Search,
  Sparkles,
  Globe,
  Lightbulb,
  Target,
  Award,
  RefreshCw,
  FileText,
  Share2,
  Bookmark,
  Play,
  Image,
  ChevronRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Zap,
  Plus,
  Loader2,
  X,
  ArrowRight,
  WandSparkles,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const quickActions = [
  { icon: Lightbulb, label: "Generate Ide Kreatif", color: "#d97706", bg: "#fef3c7" },
  { icon: Image, label: "Cari Visual Ref", color: "#2563eb", bg: "#eff6ff" },
  { icon: Play, label: "Video Ref", color: "#16a34a", bg: "#dcfce7" },
  { icon: Share2, label: "Share Hasil", color: "#9333ea", bg: "#f3e8ff" },
]

const brand = brandExplorerData

export default function BrandIdeaExplorerPage() {
  const router = useRouter()

  const [selectedBrand, setSelectedBrand] = useState(brand.brand.name)
  const [isExploring, setIsExploring] = useState(false)
  const [showIdeaModal, setShowIdeaModal] = useState(false)
  const [showVisualModal, setShowVisualModal] = useState(false)
  const [generatingIdeas, setGeneratingIdeas] = useState(false)
  const [ideas, setIdeas] = useState<typeof brand.integrationIdeas>([])

  const getBrandData = (brandName: string) => {
    // Find matching brief or use default
    const matchingBrief = briefs.find(b => b.brand_name === brandName)
    if (matchingBrief) {
      return {
        brand: {
          ...brand.brand,
          name: matchingBrief.brand_name,
          industry: matchingBrief.industry_category,
          targetAudience: matchingBrief.target_audience,
        },
        objective: matchingBrief.objective || "Meningkatkan brand awareness",
        program: matchingBrief.program,
        budgetRange: matchingBrief.budget_range,
        createdAt: matchingBrief.created_at || "2025-05-21",
        insights: brand.insights,
        programFits: brand.programFits,
        integrationIdeas: brand.integrationIdeas,
        packageRecommendation: brand.packageRecommendation,
      }
    }
    return brand
  }

  const currentBrand = getBrandData(selectedBrand)

  const handleExplore = () => {
    setIsExploring(true)
    setTimeout(() => {
      setIsExploring(false)
    }, 1500)
  }

  const handleGenerateIdeas = () => {
    setGeneratingIdeas(true)
    setTimeout(() => {
      setIdeas(brand.integrationIdeas || [])
      setGeneratingIdeas(false)
      setShowIdeaModal(true)
    }, 2000)
  }

  const handleCreateProposal = () => {
    router.push(`/proposal-builder?brand=${encodeURIComponent(selectedBrand)}`)
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Brand & Idea Explorer
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Eksplorasi brand dan temukan ide kreatif sponsorship terbaik
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '14px', paddingRight: '14px' }}>
              <Search size={16} style={{ marginRight: '8px' }} />
              Cari Brand
            </Button>
            <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }} onClick={() => router.push('/proposal-builder?action=new')}>
              <Sparkles size={16} style={{ marginRight: '8px' }} />
              Eksplorasi Baru
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px' }}>
          {/* Left Form */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #fef3c7, white)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#d97706', borderRadius: '10px' }}>
                <Lightbulb size={18} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Eksplorasi Brand</h2>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Isi informasi untuk analisis</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Brand Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Nama Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: 'white',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                >
                  {briefs.map(b => (
                    <option key={b.id} value={b.brand_name}>{b.brand_name}</option>
                  ))}
                  <option value="Wardah">Wardah</option>
                  <option value="OPPO">OPPO</option>
                  <option value="Indomie">Indomie</option>
                  <option value="Bank BCA">Bank BCA</option>
                  <option value="Aqua">Aqua</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Kategori Industri
                </label>
                <input
                  type="text"
                  value={currentBrand.brand.industry}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    color: '#64748b'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Objective
                </label>
                <input
                  type="text"
                  value={currentBrand.objective}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    color: '#64748b'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Target Audience
                </label>
                <input
                  type="text"
                  value={currentBrand.brand.targetAudience}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    color: '#64748b'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Program ANTV
                </label>
                <input
                  type="text"
                  value={currentBrand.program}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    color: '#64748b'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Budget Range
                </label>
                <input
                  type="text"
                  value={currentBrand.budgetRange}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    color: '#64748b'
                  }}
                />
              </div>

              <Button
                style={{ width: '100%', backgroundColor: '#2563eb' }}
                onClick={handleExplore}
                disabled={isExploring}
              >
                {isExploring ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px' }} />
                    Exploring...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} style={{ marginRight: '8px' }} />
                    Eksplorasi Brand
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Brand Summary */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                background: 'linear-gradient(90deg, #fef2f2, white)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '6px', backgroundColor: '#2563eb', borderRadius: '8px' }}>
                    <Sparkles size={14} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Ringkasan Brand</h3>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Generated by AI • {currentBrand.createdAt}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', padding: '6px 10px' }}>
                  <RefreshCw size={14} />
                </Button>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
                  {/* Brand Logo */}
                  <div style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      boxShadow: '0 4px 12px #fecaca40'
                    }}>
                      🌸
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{currentBrand.brand.name}</h4>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>{currentBrand.brand.industry}</p>
                  </div>

                  {/* Brand Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Target Audience</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{currentBrand.brand?.targetAudience}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Persona</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{currentBrand.brand.persona}</p>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Brand Value</p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {currentBrand.brand.brandValue.split(', ').map((val, i) => (
                          <Badge key={i} variant="outline" style={{ fontSize: '10px', padding: '2px 8px' }}>{val}</Badge>
                        ))}
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Kompetitor</p>
                      <p style={{ fontSize: '13px', color: '#475569' }}>{currentBrand.brand.competitors}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '8px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                  <Lightbulb size={16} color="#d97706" />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Insight & Opportunity</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {currentBrand.insights?.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      background: `linear-gradient(135deg, #${['fef3c7', 'dcfce7', 'f3e8ff'][index % 3]}40, #fafafa)`,
                      borderRadius: '12px',
                      border: `1px solid #${['fcd34d', '86efac', 'c4b5fd'][index % 3]}`
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <Lightbulb size={14} color="#d97706" />
                      <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{insight.title}</h4>
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Fit */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '8px', backgroundColor: '#16a34a', borderRadius: '8px' }}>
                  <Target size={16} color="white" />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Program Fit</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {currentBrand.programFits?.map((fit, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(`/proposal-builder?brand=${encodeURIComponent(selectedBrand)}&program=${encodeURIComponent(fit.program)}`)}
                    style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#16a34a'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#0f172a',
                        borderRadius: '8px'
                      }}>
                        <FileText size={14} color="white" />
                      </div>
                      <Badge
                        style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          backgroundColor: fit.matchLevel === 'best' ? '#16a34a' : fit.matchLevel === 'good' ? '#2563eb' : '#64748b',
                          color: 'white'
                        }}
                      >
                        {fit.matchLevel === 'best' ? 'Best Match' : fit.matchLevel === 'good' ? 'Match' : 'Potential'}
                      </Badge>
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{fit.program}</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>{fit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Recommendation */}
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              borderRadius: '16px',
              border: '2px solid #fecaca',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Award size={20} color="#2563eb" />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Rekomendasi Package</h3>
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{currentBrand.packageRecommendation?.name}</h4>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb' }}>{currentBrand.packageRecommendation?.value}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                    <Bookmark size={16} color="#64748b" />
                  </button>
                  <button style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                    <Share2 size={16} color="#64748b" />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>Deliverables:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {currentBrand.packageRecommendation?.deliverables.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#2563eb', borderRadius: '50%' }} />
                      <span style={{ fontSize: '12px', color: '#475569' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button style={{ width: '100%', backgroundColor: '#2563eb' }} onClick={handleCreateProposal}>
                <FileText size={16} style={{ marginRight: '8px' }} />
                Buat Proposal dari Package Ini
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <button
                key={index}
                onClick={() => {
                  if (index === 0) handleGenerateIdeas()
                  if (index === 1) setShowVisualModal(true)
                }}
                style={{
                  padding: '16px',
                  background: `linear-gradient(135deg, ${action.bg}, white)`,
                  borderRadius: '12px',
                  border: `1px solid ${action.color}40`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
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
                <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <IconComponent size={16} color={action.color} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: action.color }}>{action.label}</span>
              </button>
            )
          })}
        </div>

        {/* ==================== IDE KREATIF MODAL ==================== */}
        {showIdeaModal && (
          <>
            <div
              onClick={() => setShowIdeaModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100,
              }}
            />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', backgroundColor: '#d97706', borderRadius: '10px' }}>
                    <Lightbulb size={18} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Ide Kreatif Integrasi</h3>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{selectedBrand} - Generated by AI</p>
                  </div>
                </div>
                <button onClick={() => setShowIdeaModal(false)} style={{
                  width: '36px', height: '36px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer'
                }}>
                  <X size={18} color="#64748b" />
                </button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '60vh' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {(ideas.length > 0 ? ideas : currentBrand.integrationIdeas || []).map((idea, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d97706'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <Badge variant="amber" style={{ fontSize: '10px' }}>{idea.type}</Badge>
                      </div>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{idea.idea}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <Button variant="outline" style={{ flex: 1 }} onClick={() => setShowIdeaModal(false)}>Tutup</Button>
                <Button style={{ flex: 1, backgroundColor: '#2563eb' }} onClick={handleCreateProposal}>
                  <FileText size={14} style={{ marginRight: '6px' }} />
                  Buat Proposal
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ==================== VISUAL REF MODAL ==================== */}
        {showVisualModal && (
          <>
            <div
              onClick={() => setShowVisualModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100,
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '700px',
                maxHeight: '80vh',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '10px' }}>
                    <Image size={18} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Visual Reference</h3>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Inspirasi visual untuk {selectedBrand}</p>
                  </div>
                </div>
                <button onClick={() => setShowVisualModal(false)} style={{
                  width: '36px', height: '36px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer'
                }}>
                  <X size={18} color="#64748b" />
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { title: 'Moodboard Ramadan', desc: 'Warm, golden tones dengan Islamic patterns', color: '#fef3c7' },
                    { title: 'Product Placement', desc: 'Clean integration examples', color: '#fce7f3' },
                    { title: 'Social Assets', desc: 'Instagram Stories & Feed templates', color: '#eff6ff' },
                    { title: 'Brand Colors', desc: 'Color palette reference', color: '#f0fdf4' },
                    { title: 'Typography', desc: 'Font & text style guide', color: '#faf5ff' },
                    { title: 'Creative Assets', desc: 'Bumper & lower third samples', color: '#fef2f2' },
                  ].map((item, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: item.color,
                      borderRadius: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        margin: '0 auto 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Image size={20} color="#64748b" />
                      </div>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{item.title}</h4>
                      <p style={{ fontSize: '10px', color: '#64748b' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <Button variant="outline" style={{ flex: 1 }} onClick={() => setShowVisualModal(false)}>Tutup</Button>
                <Button style={{ flex: 1, backgroundColor: '#2563eb' }}>
                  <WandSparkles size={14} style={{ marginRight: '6px' }} />
                  Generate Custom Visual
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
