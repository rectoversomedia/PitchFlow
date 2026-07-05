"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LoadingPage } from "@/components/ui/loading"
import {
  Sparkles,
  Brain,
  TrendingUp,
  Target,
  Users,
  Award,
  Zap,
  Lightbulb,
  BarChart3,
  Copy,
  Download,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function BrandDNAExplorer() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dna")

  // Deep Analysis State
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("")
  const [competitors, setCompetitors] = useState("")
  const [deepResult, setDeepResult] = useState<string | null>(null)

  // Quick Analyze State
  const [quickBrand, setQuickBrand] = useState("")
  const [quickIndustry, setQuickIndustry] = useState("")
  const [quickResult, setQuickResult] = useState<string | null>(null)

  // Creative Ideas State
  const [ideaBrand, setIdeaBrand] = useState("")
  const [ideaIndustry, setIdeaIndustry] = useState("")
  const [ideaProgram, setIdeaProgram] = useState("")
  const [ideaAudience, setIdeaAudience] = useState("")
  const [ideasResult, setIdeasResult] = useState<string | null>(null)

  const stats = [
    { label: "Total Analyzed", value: "127", icon: Brain, color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
    { label: "Ideas Generated", value: "456", icon: Lightbulb, color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
    { label: "Win Rate", value: "78%", icon: Award, color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
    { label: "Active Brands", value: "89", icon: TrendingUp, color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  ]

  const tabs = [
    { id: "dna", label: "Brand DNA", icon: Brain },
    { id: "quick", label: "Quick Analyze", icon: Zap },
    { id: "ideas", label: "Creative Ideas", icon: Lightbulb },
    { id: "competitor", label: "Competitor Watch", icon: Target },
  ]

  const analyzeDeep = async () => {
    if (!brandName || !industry) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'brandDNA',
          params: { brandName, industry, competitorBrands: competitors.split(',').map(s => s.trim()).filter(Boolean) }
        })
      })
      const data = await response.json()
      if (data.success) setDeepResult(data.data)
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const analyzeQuick = async () => {
    if (!quickBrand || !quickIndustry) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyzeBrand', params: { brandName: quickBrand, industry: quickIndustry } })
      })
      const data = await response.json()
      if (data.success) setQuickResult(data.data)
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateIdeas = async () => {
    if (!ideaBrand || !ideaIndustry || !ideaProgram) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateIdeas',
          params: { brandName: ideaBrand, industry: ideaIndustry, programType: ideaProgram, targetAudience: ideaAudience }
        })
      })
      const data = await response.json()
      if (data.success) setIdeasResult(data.data)
    } catch (err) {
      console.error('Generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingPage />

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#f3e8ff', borderRadius: '10px' }}>
                <Brain size={20} color="#7c3aed" />
              </div>
              Brand DNA Explorer
              <Badge variant="outline" style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#7c3aed', borderColor: '#c4b5fd' }}>
                <Sparkles size={10} style={{ marginRight: '4px' }} /> AI-Powered
              </Badge>
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginLeft: '44px' }}>
              Deep brand analysis dengan AI untuk menemukan insight tersembunyi dan strategi optimal
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  backgroundColor: isActive ? '#7c3aed' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'dna' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Input Form */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                background: 'linear-gradient(90deg, #f5f3ff, white)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ padding: '8px', backgroundColor: '#7c3aed', borderRadius: '8px' }}>
                  <Sparkles size={16} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Deep Brand Analysis</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>Masukkan detail brand untuk analisis DNA menyeluruh</p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Contoh: OPPO, Wardah, Indomie"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Industry</label>
                  <input
                    type="text"
                    placeholder="Contoh: Technology, Beauty, Food & Beverage"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Competitor Brands (Optional)</label>
                  <input
                    type="text"
                    placeholder="Pisahkan dengan koma: Samsung, Vivo, Xiaomi"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Kosongkan untuk auto-detect competitors</p>
                </div>

                <Button
                  onClick={analyzeDeep}
                  disabled={!brandName || !industry}
                  style={{ width: '100%', backgroundColor: '#7c3aed' }}
                >
                  <Brain size={16} style={{ marginRight: '8px' }} />
                  Analyze Brand DNA
                </Button>
              </div>
            </div>

            {/* Results */}
            {deepResult ? (
              <div style={{
                background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                borderRadius: '16px',
                border: '2px solid #c4b5fd',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  background: 'linear-gradient(90deg, #f5f3ff, white)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#7c3aed', borderRadius: '8px' }}>
                      <Brain size={16} color="white" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed' }}>{brandName} - Brand DNA Report</h3>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>Generated with AI</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '6px 10px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>
                      <Copy size={14} color="#64748b" />
                    </button>
                    <button style={{ padding: '6px 10px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>
                      <Download size={14} color="#64748b" />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {deepResult}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#f5f3ff', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                    <Brain size={40} color="#c4b5fd" />
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Results akan muncul di sini</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quick' && (
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #fef3c7, white)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#d97706', borderRadius: '8px' }}>
                <Zap size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Quick Brand Analysis</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Analisis cepat dalam hitungan detik</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Brand"
                    value={quickBrand}
                    onChange={(e) => setQuickBrand(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Industry</label>
                  <input
                    type="text"
                    placeholder="Industry"
                    value={quickIndustry}
                    onChange={(e) => setQuickIndustry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button onClick={analyzeQuick} disabled={!quickBrand || !quickIndustry} style={{ width: '100%', backgroundColor: '#d97706' }}>
                    <Zap size={16} style={{ marginRight: '8px' }} />
                    Analyze
                  </Button>
                </div>
              </div>

              {quickResult && (
                <div style={{
                  padding: '20px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '12px',
                  border: '1px solid #fcd34d'
                }}>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {quickResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #eff6ff, white)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '8px' }}>
                <Lightbulb size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Creative Integration Ideas</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Generate ide integrasi brand yang kreatif dan innovative</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Brand"
                    value={ideaBrand}
                    onChange={(e) => setIdeaBrand(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Industry</label>
                  <input
                    type="text"
                    placeholder="Industry"
                    value={ideaIndustry}
                    onChange={(e) => setIdeaIndustry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Program Type</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sinetron, Reality Show"
                    value={ideaProgram}
                    onChange={(e) => setIdeaProgram(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Target Audience</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibu rumah tangga 25-40 tahun"
                    value={ideaAudience}
                    onChange={(e) => setIdeaAudience(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <Button onClick={generateIdeas} disabled={!ideaBrand || !ideaIndustry || !ideaProgram} style={{ width: '100%', backgroundColor: '#2563eb' }}>
                <Lightbulb size={16} style={{ marginRight: '8px' }} />
                Generate Creative Ideas
              </Button>

              {ideasResult && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #93c5fd' }}>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {ideasResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'competitor' && (
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
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#dc2626', borderRadius: '8px' }}>
                <Target size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Competitor Watch</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Track dan analyze competitor sponsorship activities</p>
              </div>
            </div>
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                <Target size={40} color="#fecaca" />
              </div>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Fitur Competitor Watch Coming Soon</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Track competitor sponsorships, media presence, dan brand strategies</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${stat.bg}, white)`,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `2px solid ${stat.border}`,
                  boxShadow: `0 4px 15px ${stat.border}30`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{stat.label}</p>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: stat.color, marginTop: '8px' }}>{stat.value}</p>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '10px', boxShadow: `0 2px 8px ${stat.border}50` }}>
                    <Icon size={18} color={stat.color} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </MainLayout>
  )
}
