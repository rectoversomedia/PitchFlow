"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LoadingPage } from "@/components/ui/loading"
import {
  Users,
  Target,
  TrendingUp,
  Heart,
  Tv,
  Play,
  MessageCircle,
  Video,
  Globe,
  Radio,
  Sparkles,
  Download,
  ChevronRight,
  Search,
} from "lucide-react"

interface AudienceSegment {
  name: string
  percentage: number
  ageRange: string
  gender: string
  interests: string[]
}

const mockSegments: AudienceSegment[] = [
  { name: "Young Professionals", percentage: 35, ageRange: "25-35", gender: "All", interests: ["Career", "Technology", "Lifestyle"] },
  { name: "Digital Natives", percentage: 28, ageRange: "18-24", gender: "All", interests: ["Social Media", "Gaming", "Entertainment"] },
  { name: "Family Builders", percentage: 22, ageRange: "30-45", gender: "All", interests: ["Family", "Home", "Education"] },
  { name: "Mature Segment", percentage: 15, ageRange: "45-60", gender: "All", interests: ["Health", "Finance", "Travel"] },
]

const mockMediaConsumption = [
  { platform: "YouTube", percentage: 85, icon: Play, color: "#dc2626", dailyHours: "2.5 hrs" },
  { platform: "Instagram", percentage: 78, icon: MessageCircle, color: "#ec4899", dailyHours: "2.0 hrs" },
  { platform: "TikTok", percentage: 72, icon: Video, color: "#0f172a", dailyHours: "1.8 hrs" },
  { platform: "TV", percentage: 65, icon: Tv, color: "#2563eb", dailyHours: "3.0 hrs" },
  { platform: "Facebook", percentage: 58, icon: Globe, color: "#1877f2", dailyHours: "1.2 hrs" },
  { platform: "Podcast", percentage: 35, icon: Radio, color: "#ea580c", dailyHours: "0.8 hrs" },
]

export default function AudienceInsights() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("insights")

  // Deep Analysis State
  const [brandName, setBrandName] = useState("")
  const [targetAge, setTargetAge] = useState("")
  const [targetGender, setTargetGender] = useState("")
  const [location, setLocation] = useState("")
  const [deepResult, setDeepResult] = useState<string | null>(null)

  // Quick Analyze State
  const [quickBrand, setQuickBrand] = useState("")
  const [quickResult, setQuickResult] = useState<string | null>(null)

  const tabs = [
    { id: "insights", label: "Insights", icon: Target },
    { id: "segments", label: "Segments", icon: Users },
    { id: "media", label: "Media", icon: Tv },
    { id: "psychographics", label: "Psychographics", icon: Heart },
  ]

  const analyzeDeep = async () => {
    if (!brandName) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'audienceInsights',
          params: { brandName, targetAge: targetAge || "18-45", targetGender: targetGender || "All", location: location || "Indonesia" }
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

  const quickAnalyze = async () => {
    if (!quickBrand) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'audienceInsights', params: { brandName: quickBrand, targetAge: "18-45", targetGender: "All", location: "Indonesia" } })
      })
      const data = await response.json()
      if (data.success) setQuickResult(data.data)
    } catch (err) {
      console.error('Analysis failed:', err)
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
              <div style={{ padding: '8px', backgroundColor: '#ecfeff', borderRadius: '10px' }}>
                <Users size={20} color="#0891b2" />
              </div>
              Audience Insights
              <Badge variant="outline" style={{ fontSize: '11px', backgroundColor: '#ecfeff', color: '#0891b2', borderColor: '#a5f3fc' }}>
                <Sparkles size={10} style={{ marginRight: '4px' }} /> AI-Powered
              </Badge>
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginLeft: '44px' }}>
              Deep audience analysis untuk target market yang lebih tepat
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
                  backgroundColor: isActive ? '#0891b2' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* INSIGHTS TAB */}
        {activeTab === 'insights' && (
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
                background: 'linear-gradient(90deg, #ecfeff, white)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ padding: '8px', backgroundColor: '#0891b2', borderRadius: '8px' }}>
                  <Target size={16} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Audience Analysis</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>Generate deep audience insights dengan AI</p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Contoh: OPPO"
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Target Age</label>
                    <select
                      value={targetAge}
                      onChange={(e) => setTargetAge(e.target.value)}
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
                      <option value="">Pilih age</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55+">55+</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Target Gender</label>
                    <select
                      value={targetGender}
                      onChange={(e) => setTargetGender(e.target.value)}
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
                      <option value="">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Location</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta, Indonesia"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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

                <Button onClick={analyzeDeep} disabled={!brandName} style={{ width: '100%', backgroundColor: '#0891b2' }}>
                  <Target size={16} style={{ marginRight: '8px' }} />
                  Analyze Audience
                </Button>
              </div>
            </div>

            {/* Deep Result */}
            {deepResult ? (
              <div style={{
                background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                borderRadius: '16px',
                border: '2px solid #a5f3fc',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  background: 'linear-gradient(90deg, #ecfeff, white)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#0891b2', borderRadius: '8px' }}>
                      <Users size={16} color="white" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0891b2' }}>Audience Report</h3>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>Generated with AI</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download size={14} style={{ marginRight: '6px' }} /> Export
                  </Button>
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
                  <div style={{ padding: '20px', backgroundColor: '#ecfeff', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                    <Users size={40} color="#a5f3fc" />
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Results akan muncul di sini</p>
                </div>
              </div>
            )}

            {/* Quick Analyze */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              gridColumn: 'span 2'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="#16a34a" />
                Quick Audience Check
              </h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Brand name"
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
                <Button onClick={quickAnalyze} variant="outline" disabled={!quickBrand}>
                  Quick Analyze
                </Button>
              </div>
              {quickResult && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#dcfce7', borderRadius: '12px', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {quickResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEGMENTS TAB */}
        {activeTab === 'segments' && (
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #ecfeff, white)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#0891b2', borderRadius: '8px' }}>
                <Users size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Audience Segments</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Breakdown demografis audience berdasarkan data pasar</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {mockSegments.map((segment) => (
                  <div
                    key={segment.name}
                    style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0891b2'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{segment.name}</h4>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>Age: {segment.ageRange} • {segment.gender}</p>
                      </div>
                      <Badge style={{ fontSize: '11px', backgroundColor: '#ecfeff', color: '#0891b2' }}>
                        {segment.percentage}%
                      </Badge>
                    </div>
                    <Progress value={segment.percentage} className="h-2" />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {segment.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" style={{ fontSize: '10px' }}>{interest}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #ecfeff, white)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#0891b2', borderRadius: '8px' }}>
                <Tv size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Media Consumption</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Platform mana yang audience gunakan setiap hari</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {mockMediaConsumption.map((media) => {
                  const Icon = media.icon
                  return (
                    <div
                      key={media.platform}
                      style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div style={{ padding: '10px', backgroundColor: '#ecfeff', borderRadius: '10px' }}>
                        <Icon size={20} color={media.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{media.platform}</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{media.dailyHours}/day</span>
                        </div>
                        <Progress value={media.percentage} className="h-2" />
                      </div>
                      <Badge style={{ fontSize: '11px', backgroundColor: '#ecfeff', color: '#0891b2' }}>
                        {media.percentage}%
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* PSYCHOGRAPHICS TAB */}
        {activeTab === 'psychographics' && (
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #fdf2f8, white)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#ec4899', borderRadius: '8px' }}>
                <Heart size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Psychographic Profile</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Mindset, values, dan behavior patterns</p>
              </div>
            </div>
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ padding: '20px', backgroundColor: '#fdf2f8', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                <Heart size={40} color="#fbcfe8" />
              </div>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Psychographic analysis available after audience input</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
