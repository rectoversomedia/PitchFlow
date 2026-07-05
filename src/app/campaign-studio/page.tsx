"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LoadingPage } from "@/components/ui/loading"
import {
  Sparkles,
  Video,
  ImageIcon,
  FileText,
  Share2,
  Wand2,
  Clock,
  Copy,
  Download,
  ChevronRight,
} from "lucide-react"

interface GeneratedContent {
  id: string
  type: "script" | "storyboard" | "social" | "package"
  title: string
  content: string
  createdAt: Date
}

const packageOptions = [
  { id: "bronze", name: "Bronze Package", price: "50-100 juta", deliverables: ["Logo placement", "Brand mention", "1 social post"], color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  { id: "silver", name: "Silver Package", price: "100-250 juta", deliverables: ["Segment integration", "Product demo", "5 social posts", "PR mentions"], color: "#64748b", bg: "#f8fafc", border: "#cbd5e1" },
  { id: "gold", name: "Gold Package", price: "250-500 juta", deliverables: ["Full episode integration", "Custom segment", "10 social posts", "Event activation", "Co-branded content"], color: "#ca8a04", bg: "#fefce8", border: "#fef08a" },
  { id: "platinum", name: "Platinum Package", price: "500 juta +", deliverables: ["Title sponsorship", "Full production", "Digital extension", "Event rights", "Year-round activation"], color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
]

export default function CampaignStudio() {
  const [loading, setLoading] = useState(false)
  const [activeTool, setActiveTool] = useState("package")

  // Package Designer State
  const [pkgBrand, setPkgBrand] = useState("")
  const [pkgProgram, setPkgProgram] = useState("")
  const [pkgObjective, setPkgObjective] = useState("")
  const [pkgBudget, setPkgBudget] = useState("")
  const [pkgPackage, setPkgPackage] = useState<string | null>(null)

  // Script Writer State
  const [scriptBrand, setScriptBrand] = useState("")
  const [scriptProgram, setScriptProgram] = useState("")
  const [scriptConcept, setScriptConcept] = useState("")
  const [scriptDuration, setScriptDuration] = useState("60")
  const [generatedScript, setGeneratedScript] = useState<string | null>(null)

  // Storyboard State
  const [storyboardBrand, setStoryboardBrand] = useState("")
  const [storyboardConcept, setStoryboardConcept] = useState("")
  const [generatedStoryboard, setGeneratedStoryboard] = useState<string | null>(null)

  // Social Post State
  const [socialBrand, setSocialBrand] = useState("")
  const [socialContent, setSocialContent] = useState("")
  const [socialPlatform, setSocialPlatform] = useState("instagram")
  const [generatedSocial, setGeneratedSocial] = useState<string | null>(null)

  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([])

  const tabs = [
    { id: "package", label: "Package", icon: FileText },
    { id: "script", label: "Script", icon: Video },
    { id: "storyboard", label: "Storyboard", icon: ImageIcon },
    { id: "social", label: "Social", icon: Share2 },
    { id: "history", label: "History", icon: Clock },
  ]

  const generateScript = async () => {
    if (!scriptBrand || !scriptProgram) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateProposal',
          params: { brandName: scriptBrand, programName: scriptProgram, objective: scriptConcept || "Brand awareness", keyMessages: ["Quality", "Innovation", "Trust"], budget: pkgBudget || "Flexible" }
        })
      })
      const data = await response.json()
      if (data.success) {
        setGeneratedScript(data.data)
        setGeneratedContents(prev => [...prev, { id: Date.now().toString(), type: "script", title: `Script - ${scriptBrand}`, content: data.data, createdAt: new Date() }])
      }
    } catch (error) {
      console.error('Script generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateStoryboard = async () => {
    if (!storyboardBrand || !storyboardConcept) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateImagePrompt', params: { brandName: storyboardBrand, concept: storyboardConcept } })
      })
      const data = await response.json()
      if (data.success) {
        setGeneratedStoryboard(data.data)
        setGeneratedContents(prev => [...prev, { id: Date.now().toString(), type: "storyboard", title: `Storyboard - ${storyboardBrand}`, content: data.data, createdAt: new Date() }])
      }
    } catch (error) {
      console.error('Storyboard generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSocialPost = async () => {
    if (!socialBrand || !socialContent) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improveText', params: { text: `Create social media content for ${socialBrand}: ${socialContent}` } })
      })
      const data = await response.json()
      if (data.success) {
        setGeneratedSocial(data.data)
        setGeneratedContents(prev => [...prev, { id: Date.now().toString(), type: "social", title: `Social Post - ${socialBrand}`, content: data.data, createdAt: new Date() }])
      }
    } catch (error) {
      console.error('Social generation failed:', error)
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
              <div style={{ padding: '8px', backgroundColor: '#fdf2f8', borderRadius: '10px' }}>
                <Sparkles size={20} color="#ec4899" />
              </div>
              Campaign Studio
              <Badge variant="outline" style={{ fontSize: '11px', backgroundColor: '#fdf2f8', color: '#ec4899', borderColor: '#fbcfe8' }}>
                <Wand2 size={10} style={{ marginRight: '4px' }} /> AI-Powered
              </Badge>
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginLeft: '44px' }}>
              Generate sponsorship packages, scripts, storyboards, dan content dengan AI
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
            const isActive = activeTool === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id)}
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
                  backgroundColor: isActive ? '#ec4899' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* PACKAGE DESIGNER */}
        {activeTool === 'package' && (
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
                  <FileText size={16} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Sponsorship Package Designer</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>Design paket sponsorship dengan deliverable yang menarik</p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Contoh: OPPO"
                    value={pkgBrand}
                    onChange={(e) => setPkgBrand(e.target.value)}
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
                  <input
                    type="text"
                    placeholder="Contoh: Sinetron Ramadan"
                    value={pkgProgram}
                    onChange={(e) => setPkgProgram(e.target.value)}
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
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Objective</label>
                  <input
                    type="text"
                    placeholder="Contoh: Increase brand awareness"
                    value={pkgObjective}
                    onChange={(e) => setPkgObjective(e.target.value)}
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
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Budget Range</label>
                  <input
                    type="text"
                    placeholder="Contoh: 100-250 juta"
                    value={pkgBudget}
                    onChange={(e) => setPkgBudget(e.target.value)}
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
            </div>

            {/* Package Options */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#7c3aed" />
                Select Package Tier
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {packageOptions.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setPkgPackage(pkg.id)}
                    style={{
                      padding: '16px',
                      background: `linear-gradient(135deg, ${pkg.bg}, white)`,
                      borderRadius: '12px',
                      border: `2px solid ${pkgPackage === pkg.id ? pkg.color : pkg.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: pkgPackage === pkg.id ? `0 4px 12px ${pkg.color}30` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (pkgPackage !== pkg.id) {
                        e.currentTarget.style.borderColor = pkg.color
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pkgPackage !== pkg.id) {
                        e.currentTarget.style.borderColor = pkg.border
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{pkg.name}</h4>
                      <Badge style={{ fontSize: '10px', backgroundColor: pkg.bg, color: pkg.color, border: `1px solid ${pkg.border}` }}>
                        {pkg.price}
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {pkg.deliverables.map((d) => (
                        <span
                          key={d}
                          style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            color: '#64748b',
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCRIPT WRITER */}
        {activeTool === 'script' && (
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
                <Video size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>AI Script Writer</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Generate sponsorship script dengan AI</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Brand"
                    value={scriptBrand}
                    onChange={(e) => setScriptBrand(e.target.value)}
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
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Program</label>
                  <input
                    type="text"
                    placeholder="Program"
                    value={scriptProgram}
                    onChange={(e) => setScriptProgram(e.target.value)}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Concept / Key Message</label>
                <Textarea
                  placeholder="Describe the sponsorship concept..."
                  value={scriptConcept}
                  onChange={(e) => setScriptConcept(e.target.value)}
                  style={{ minHeight: '100px' }}
                />
              </div>

              <Button onClick={generateScript} disabled={!scriptBrand || !scriptProgram} style={{ width: '100%', backgroundColor: '#dc2626' }}>
                <Video size={16} style={{ marginRight: '8px' }} />
                Generate Script
              </Button>

              {generatedScript && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '2px solid #fecaca' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Badge style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>Generated Script</Badge>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="outline" size="sm">
                        <Copy size={14} style={{ marginRight: '4px' }} /> Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download size={14} style={{ marginRight: '4px' }} /> Export
                      </Button>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {generatedScript}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STORYBOARD */}
        {activeTool === 'storyboard' && (
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
                <ImageIcon size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>AI Storyboard Generator</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Generate visual storyboard prompts untuk production</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Brand"
                    value={storyboardBrand}
                    onChange={(e) => setStoryboardBrand(e.target.value)}
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
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Concept</label>
                  <input
                    type="text"
                    placeholder="Integration concept"
                    value={storyboardConcept}
                    onChange={(e) => setStoryboardConcept(e.target.value)}
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

              <Button onClick={generateStoryboard} disabled={!storyboardBrand || !storyboardConcept} style={{ width: '100%', backgroundColor: '#2563eb' }}>
                <ImageIcon size={16} style={{ marginRight: '8px' }} />
                Generate Storyboard Prompts
              </Button>

              {generatedStoryboard && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '2px solid #93c5fd' }}>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {generatedStoryboard}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SOCIAL CONTENT */}
        {activeTool === 'social' && (
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
                <Share2 size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>AI Social Content Generator</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Generate social media content dan captions</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                <input
                  type="text"
                  placeholder="Brand"
                  value={socialBrand}
                  onChange={(e) => setSocialBrand(e.target.value)}
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
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Content Brief</label>
                <Textarea
                  placeholder="Describe the content you want to create..."
                  value={socialContent}
                  onChange={(e) => setSocialContent(e.target.value)}
                  style={{ minHeight: '100px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Platform</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {["instagram", "twitter", "tiktok", "facebook", "linkedin"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSocialPlatform(p)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        backgroundColor: socialPlatform === p ? '#16a34a' : '#f1f5f9',
                        color: socialPlatform === p ? 'white' : '#64748b',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={generateSocialPost} disabled={!socialBrand || !socialContent} style={{ width: '100%', backgroundColor: '#16a34a' }}>
                <Share2 size={16} style={{ marginRight: '8px' }} />
                Generate Content
              </Button>

              {generatedSocial && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#dcfce7', borderRadius: '12px', border: '2px solid #86efac' }}>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {generatedSocial}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeTool === 'history' && (
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #f8fafc, white)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#64748b', borderRadius: '8px' }}>
                <Clock size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Generated Content History</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Riwayat content yang sudah di-generate</p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {generatedContents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '50%', display: 'inline-block', marginBottom: '16px' }}>
                    <Clock size={40} color="#cbd5e1" />
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>No content generated yet</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Generated scripts, storyboards, dan packages akan muncul di sini</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {generatedContents.map((content) => (
                    <div
                      key={content.id}
                      style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Badge variant="outline" style={{ fontSize: '10px', textTransform: 'capitalize' }}>{content.type}</Badge>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{content.title}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{content.createdAt.toLocaleString('id-ID')}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{content.content.substring(0, 150)}...</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <Button variant="outline" size="sm">
                          <Copy size={12} style={{ marginRight: '4px' }} /> Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download size={12} style={{ marginRight: '4px' }} /> Export
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
