"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingPage } from "@/components/ui/loading"
import {
  TrendingUp,
  Flame,
  Target,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Sparkles,
  Search,
  ChevronRight,
} from "lucide-react"

interface Trend {
  id: string
  title: string
  category: string
  trend: "up" | "down" | "stable"
  growth: string
  description: string
  brands: string[]
  example?: string
}

const mockTrends: Trend[] = [
  { id: "1", title: "Micro-Influencer Marketing", category: "Marketing", trend: "up", growth: "+45%", description: "Brand lebih memilih micro-influencer dengan followers 10K-100K untuk reach yang lebih engaged", brands: ["Sociolla", "Wardah", "Gojek"], example: "Wardah collab dengan beauty blogger 50K followers" },
  { id: "2", title: "Live Commerce", category: "E-Commerce", trend: "up", growth: "+120%", description: "Live streaming shopping experience dengan interactive features", brands: ["Shopee", "Tokopedia", "Blibli"], example: "Shopee Live dengan artis dan flash sale" },
  { id: "3", title: "Health & Wellness", category: "Lifestyle", trend: "up", growth: "+35%", description: "Brand kesehatan dan wellness makin agresif sponsor program kesehatan", brands: ["Greenfields", "Bear Brand", "Frisian Flag"], example: "Bear Brand sponsorship podcast kesehatan" },
  { id: "4", title: "Gaming & Esports", category: "Entertainment", trend: "up", growth: "+89%", description: "Esports tournament dan gaming content makin menarik brand sponsor", brands: ["Red Bull", "ASUS ROG", "Monster Energy"], example: "ASUS ROG sponsorship MLBB tournament" },
  { id: "5", title: "Sinetron Ramadan", category: "Broadcasting", trend: "stable", growth: "+5%", description: "Sinetron Ramadan tetap menjadi prime time untuk brand activation", brands: ["OPPO", "Samsung", "Indomie"], example: "OPPO product placement di sinetron RCTI" },
  { id: "6", title: "Podcast Sponsorship", category: "Audio", trend: "up", growth: "+67%", description: "Brand mulai realize potensi podcast untuk target demographic spesifik", brands: ["Spotify", "Grab", "Telkomsel"], example: "Grab sponsorship di podcast Cerita Distori" },
]

const hotCategories = [
  { name: "Technology", change: "+45%", icon: TrendingUp, color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  { name: "Beauty & Personal Care", change: "+38%", icon: Flame, color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8" },
  { name: "FMCG", change: "+25%", icon: Target, color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  { name: "Automotive", change: "+18%", icon: TrendingUp, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  { name: "Fintech", change: "+52%", icon: BarChart3, color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  { name: "Gaming", change: "+89%", icon: Flame, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
]

export default function TrendRadar() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("trends")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(2026)

  const tabs = [
    { id: "trends", label: "Trends", icon: TrendingUp },
    { id: "analysis", label: "AI Analysis", icon: BarChart3 },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ]

  const industries = ["all", "Marketing", "E-Commerce", "Lifestyle", "Entertainment", "Broadcasting", "Audio", "Technology"]

  const filteredTrends = mockTrends.filter(trend => {
    const matchesIndustry = selectedIndustry === "all" || trend.category === selectedIndustry
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) || trend.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesIndustry && matchesSearch
  })

  const analyzeTrends = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trendAnalysis', params: { industry: selectedIndustry === "all" ? "Semua Industri" : selectedIndustry, year: selectedYear } })
      })
      const data = await response.json()
      if (data.success) setAnalysisResult(data.data)
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <ArrowUpRight className="w-4 h-4" style={{ color: '#16a34a' }} />
      case "down": return <ArrowDownRight className="w-4 h-4" style={{ color: '#dc2626' }} />
      default: return <Minus className="w-4 h-4" style={{ color: '#94a3b8' }} />
    }
  }

  const getTrendBadge = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <Badge style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#16a34a' }}>Trending Up</Badge>
      case "down": return <Badge style={{ fontSize: '10px', backgroundColor: '#fef2f2', color: '#dc2626' }}>Trending Down</Badge>
      default: return <Badge variant="outline" style={{ fontSize: '10px' }}>Stable</Badge>
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
              <div style={{ padding: '8px', backgroundColor: '#fff7ed', borderRadius: '10px' }}>
                <TrendingUp size={20} color="#ea580c" />
              </div>
              Trend Radar
              <Badge variant="outline" style={{ fontSize: '11px', backgroundColor: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
                <Flame size={10} style={{ marginRight: '4px' }} /> Real-time
              </Badge>
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginLeft: '44px' }}>
              Track tren sponsorship dan media terbaru di Indonesia
            </p>
          </div>
        </div>

        {/* Hot Categories */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#ea580c" />
            Hot Categories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
            {hotCategories.map((cat, index) => {
              const Icon = cat.icon
              return (
                <div
                  key={index}
                  style={{
                    background: `linear-gradient(135deg, ${cat.bg}, white)`,
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${cat.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 4px 12px ${cat.border}50`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ padding: '6px', backgroundColor: 'white', borderRadius: '8px' }}>
                      <Icon size={16} color={cat.color} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>{cat.change}</span>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#0f172a' }}>{cat.name}</p>
                </div>
              )
            })}
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
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TRENDS TAB */}
        {activeTab === 'trends' && (
          <div>
            {/* Filters */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                    <Search size={12} style={{ marginRight: '4px', display: 'inline' }} /> Search
                  </label>
                  <input
                    type="text"
                    placeholder="Cari trend..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                <div style={{ width: '180px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Industry</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      backgroundColor: 'white',
                      outline: 'none',
                    }}
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind === "all" ? "Semua Industry" : ind}</option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  <RefreshCw size={14} style={{ marginRight: '6px' }} />
                  Reset
                </Button>
              </div>
            </div>

            {/* Trends List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTrends.map((trend) => (
                <div
                  key={trend.id}
                  style={{
                    background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{trend.title}</h3>
                        {getTrendBadge(trend.trend)}
                        <Badge variant="outline" style={{ fontSize: '10px' }}>{trend.category}</Badge>
                      </div>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', lineHeight: 1.5 }}>{trend.description}</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {trend.brands.map((brand) => (
                          <Badge key={brand} variant="secondary" style={{ fontSize: '10px' }}>{brand}</Badge>
                        ))}
                      </div>
                      {trend.example && (
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px', fontStyle: 'italic' }}>
                          Example: {trend.example}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>
                        {getTrendIcon(trend.trend)}
                        {trend.growth}
                      </div>
                      <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>vs last year</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI ANALYSIS TAB */}
        {activeTab === 'analysis' && (
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
                <BarChart3 size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>AI Trend Analysis</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Generate deep trend analysis dengan AI untuk industri spesifik</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Industry</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      backgroundColor: 'white',
                      outline: 'none',
                    }}
                  >
                    {industries.filter(i => i !== "all").map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      backgroundColor: 'white',
                      outline: 'none',
                    }}
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>
              </div>

              <Button onClick={analyzeTrends} disabled={selectedIndustry === "all"} style={{ width: '100%', backgroundColor: '#7c3aed' }}>
                <Sparkles size={16} style={{ marginRight: '8px' }} />
                Generate Trend Analysis
              </Button>

              {analysisResult && (
                <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f5f3ff', borderRadius: '12px', border: '2px solid #c4b5fd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed' }}>Trend Analysis Report</h4>
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {analysisResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
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
                <Calendar size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Event Calendar</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Calendar event sponsorship opportunities</p>
              </div>
            </div>
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                <Calendar size={40} color="#93c5fd" />
              </div>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Event Calendar Coming Soon</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Track event dates, deadlines, dan sponsorship windows</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
