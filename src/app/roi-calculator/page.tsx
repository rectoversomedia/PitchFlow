"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LoadingPage } from "@/components/ui/loading"
import {
  Calculator,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  PieChart,
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
} from "lucide-react"

interface ROIResult {
  cpm: number
  cpe: number
  roi: number
  riskLevel: "low" | "medium" | "high"
  recommendation: string
}

const programTypes = [
  "Sinetron", "Reality Show", "Variety Show", "News Program",
  "Sports Event", "Digital Campaign", "Podcast", "Social Media", "Concert"
]

const benchmarks = [
  { industry: "Technology", avgCPM: "Rp 45.000", avgROI: "35%", potential: "High" },
  { industry: "Beauty & Personal Care", avgCPM: "Rp 38.000", avgROI: "42%", potential: "Very High" },
  { industry: "FMCG", avgCPM: "Rp 25.000", avgROI: "28%", potential: "Medium" },
  { industry: "Automotive", avgCPM: "Rp 55.000", avgROI: "45%", potential: "High" },
  { industry: "Fintech", avgCPM: "Rp 65.000", avgROI: "52%", potential: "Very High" },
  { industry: "Food & Beverage", avgCPM: "Rp 30.000", avgROI: "32%", potential: "Medium" },
]

export default function ROICalculator() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("calculator")

  // Input State
  const [brandName, setBrandName] = useState("")
  const [programType, setProgramType] = useState("")
  const [budget, setBudget] = useState("")
  const [duration, setDuration] = useState("")
  const [expectedReach, setExpectedReach] = useState("")
  const [roiResult, setRoiResult] = useState<ROIResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const tabs = [
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "analysis", label: "AI Analysis", icon: BarChart3 },
    { id: "benchmark", label: "Benchmarks", icon: PieChart },
  ]

  const quickCalculate = () => {
    const budgetNum = parseFloat(budget.replace(/[^0-9]/g, '')) || 0
    const reachNum = parseFloat(expectedReach.replace(/[^0-9]/g, '')) || 0

    if (budgetNum && reachNum) {
      const cpm = (budgetNum / reachNum) * 1000
      const estimatedImpressions = reachNum * 30
      const estimatedValue = estimatedImpressions * 0.01
      const roi = ((estimatedValue - budgetNum) / budgetNum) * 100

      let riskLevel: "low" | "medium" | "high" = "medium"
      if (roi > 50) riskLevel = "low"
      if (roi < 0) riskLevel = "high"

      setRoiResult({
        cpm,
        cpe: cpm / 100,
        roi,
        riskLevel,
        recommendation: roi > 30 ? "Highly recommended" : roi > 0 ? "Moderately recommended" : "Not recommended"
      })
    }
  }

  const analyzeROI = async () => {
    if (!brandName || !programType || !budget) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculateROI',
          params: { brandName, programType, budget, duration: duration || "3 months", expectedReach: expectedReach || "To be determined" }
        })
      })
      const data = await response.json()
      if (data.success) setAnalysisResult(data.data)
    } catch (err) {
      console.error('ROI analysis failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)}M`
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`
    return `Rp ${num.toFixed(0)}`
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return { bg: '#dcfce7', border: '#86efac', text: '#16a34a' }
      case "medium": return { bg: '#fef3c7', border: '#fcd34d', text: '#d97706' }
      case "high": return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' }
      default: return { bg: '#f1f5f9', border: '#e2e8f0', text: '#64748b' }
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
              <div style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '10px' }}>
                <Calculator size={20} color="#16a34a" />
              </div>
              ROI Calculator
              <Badge variant="outline" style={{ fontSize: '11px', backgroundColor: '#dcfce7', color: '#16a34a', borderColor: '#86efac' }}>
                <Sparkles size={10} style={{ marginRight: '4px' }} /> AI-Powered
              </Badge>
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginLeft: '44px' }}>
              Calculate dan analyze sponsorship ROI dengan AI
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
                  backgroundColor: isActive ? '#16a34a' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* CALCULATOR TAB */}
        {activeTab === 'calculator' && (
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
                background: 'linear-gradient(90deg, #dcfce7, white)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ padding: '8px', backgroundColor: '#16a34a', borderRadius: '8px' }}>
                  <Calculator size={16} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Input Details</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>Masukkan detail sponsorship untuk calculate ROI</p>
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Program Type</label>
                  <select
                    value={programType}
                    onChange={(e) => setProgramType(e.target.value)}
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
                    <option value="">Select program type</option>
                    {programTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Budget (IDR)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 500.000.000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
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
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Expected Reach</label>
                  <input
                    type="text"
                    placeholder="Contoh: 10.000.000"
                    value={expectedReach}
                    onChange={(e) => setExpectedReach(e.target.value)}
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

                <Button onClick={quickCalculate} style={{ width: '100%', backgroundColor: '#16a34a' }}>
                  <Calculator size={16} style={{ marginRight: '8px' }} />
                  Calculate ROI
                </Button>
              </div>
            </div>

            {/* Results */}
            {roiResult ? (
              <div style={{
                background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                borderRadius: '16px',
                border: `2px solid ${getRiskColor(roiResult.riskLevel).border}`,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  background: `linear-gradient(90deg, ${getRiskColor(roiResult.riskLevel).bg}, white)`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#16a34a', borderRadius: '8px' }}>
                      <TrendingUp size={16} color="white" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>ROI Analysis</h3>
                      <Badge style={{
                        fontSize: '10px',
                        backgroundColor: getRiskColor(roiResult.riskLevel).bg,
                        color: getRiskColor(roiResult.riskLevel).text
                      }}>
                        {roiResult.riskLevel === 'low' ? 'Low Risk' : roiResult.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download size={14} style={{ marginRight: '6px' }} /> Export
                  </Button>
                </div>

                <div style={{ padding: '24px' }}>
                  {/* ROI Score */}
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      border: '8px solid',
                      borderColor: roiResult.roi >= 30 ? '#16a34a' : roiResult.roi >= 0 ? '#d97706' : '#dc2626',
                      margin: '0 auto 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <span style={{ fontSize: '28px', fontWeight: 800, color: roiResult.roi >= 0 ? '#16a34a' : '#dc2626' }}>
                        {roiResult.roi.toFixed(0)}%
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>ROI</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Target size={16} color="#2563eb" style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '10px', color: '#64748b' }}>CPM</p>
                      <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(roiResult.cpm)}</p>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Users size={16} color="#7c3aed" style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '10px', color: '#64748b' }}>CPE</p>
                      <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(roiResult.cpe)}</p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: getRiskColor(roiResult.riskLevel).bg,
                    borderRadius: '12px',
                    border: `1px solid ${getRiskColor(roiResult.riskLevel).border}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {roiResult.roi >= 30 ? (
                        <CheckCircle2 size={18} color="#16a34a" />
                      ) : roiResult.roi >= 0 ? (
                        <AlertCircle size={18} color="#d97706" />
                      ) : (
                        <XCircle size={18} color="#dc2626" />
                      )}
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Recommendation</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{roiResult.recommendation}</p>
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
                  <div style={{ padding: '20px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                    <Calculator size={40} color="#86efac" />
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Results akan muncul di sini</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Masukkan data dan click Calculate</p>
                </div>
              </div>
            )}
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
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>AI Deep ROI Analysis</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Get detailed ROI analysis dengan AI-powered insights</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Brand"
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
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Program Type</label>
                  <select
                    value={programType}
                    onChange={(e) => setProgramType(e.target.value)}
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
                    <option value="">Select program</option>
                    {programTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Budget</label>
                  <input
                    type="text"
                    placeholder="Budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
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
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Duration</label>
                  <input
                    type="text"
                    placeholder="Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
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

              <Button onClick={analyzeROI} disabled={!brandName || !programType || !budget} style={{ width: '100%', backgroundColor: '#7c3aed' }}>
                <Sparkles size={16} style={{ marginRight: '8px' }} />
                Generate AI Analysis
              </Button>

              {analysisResult && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f3ff', borderRadius: '12px', border: '2px solid #c4b5fd' }}>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {analysisResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BENCHMARKS TAB */}
        {activeTab === 'benchmark' && (
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
                <PieChart size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Industry Benchmarks</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Average CPM dan ROI by industry</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {benchmarks.map((bm) => (
                  <div
                    key={bm.industry}
                    style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{bm.industry}</p>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>Avg CPM: {bm.avgCPM}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge style={{
                        fontSize: '11px',
                        backgroundColor: bm.potential === 'Very High' ? '#dcfce7' : bm.potential === 'High' ? '#eff6ff' : '#f1f5f9',
                        color: bm.potential === 'Very High' ? '#16a34a' : bm.potential === 'High' ? '#2563eb' : '#64748b',
                        marginBottom: '4px'
                      }}>
                        {bm.avgROI} ROI
                      </Badge>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>{bm.potential} Potential</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
