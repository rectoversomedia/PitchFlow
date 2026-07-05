"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { proposals, libraryProposals } from "@/lib/mock-data"
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Settings,
  MessageSquare,
  PenTool,
  Camera,
  Download,
  Share2,
  Eye,
  EyeOff,
  Clock,
  Layers,
  X,
  Check,
  Loader2,
  Home,
  FileText,
  Link as LinkIcon,
  Copy,
  CheckCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const proposalSlides = [
  {
    id: 1,
    type: "cover",
    title: "Wardah",
    subtitle: "Sinetron Ramadan Campaign",
    typeLabel: "Cover Slide",
    content: {
      brand: "Wardah",
      program: "Sinetron Ramadan",
      year: 2025,
      sponsorType: "Segment Sponsor"
    }
  },
  {
    id: 2,
    type: "brief",
    title: "Brief Overview",
    subtitle: "Client Objectives & Target Audience",
    typeLabel: "Brief Summary",
    content: {
      objective: "Meningkatkan brand awareness dan consideration selama Ramadan",
      targetAudience: "Perempuan 20-45 tahun",
      budget: "Rp 1.000.000.000 - 1.500.000.000",
      period: "Ramadan 2025"
    }
  },
  {
    id: 3,
    type: "brand",
    title: "Brand Overview",
    subtitle: "Wardah - Beauty & Personal Care",
    typeLabel: "Brand Summary",
    content: {
      description: "Wardah adalah brand kosmetik halal terkemuka di Indonesia yang menargetkan perempuan modern, aktif, dan berdaya.",
      values: ["Halal", "Natural", "Inspiring", "Trusted"],
      persona: "Modern Muslimah, Confident, Family Oriented"
    }
  },
  {
    id: 4,
    type: "audience",
    title: "Audience Insight",
    subtitle: "Target Profile & Behavior",
    typeLabel: "Insight",
    content: {
      primary: "Perempuan 20-45 tahun",
      characteristics: [
        "Aktif menggunakan media sosial",
        "Berkunjung ke supermarket/online shop",
        "Suka mengikuti trend",
        "Family-oriented"
      ],
      mediaHabits: "Sering menonton sinetron TV di waktu prime time keluarga"
    }
  },
  {
    id: 5,
    type: "program",
    title: "Program Overview",
    subtitle: "Sinetron Ramadan ANTV",
    typeLabel: "Program",
    content: {
      programName: "Sinetron Ramadan",
      channel: "ANTV",
      slot: "Prime Time 21:00 - 22:00",
      episodes: "30 episodes",
      reach: "5.2 juta penonton per episode",
      demographics: "65% perempuan, 35% laki-laki, usia 15-54"
    }
  },
  {
    id: 6,
    type: "integration",
    title: "Brand Integration",
    subtitle: "Creative Sponsorship Concept",
    typeLabel: "Integration",
    content: {
      concept: "Cantik Tanpa Batas",
      elements: [
        "Segment bumper (opening & closing)",
        "Product placement di meja rias karakter",
        "Social media integration",
        "Meet & greet with BA"
      ]
    }
  },
  {
    id: 7,
    type: "package",
    title: "Investment Package",
    subtitle: "Segment Sponsor Package",
    typeLabel: "Package",
    content: {
      packageName: "Paket Segment Sponsor Ramadan",
      value: "Rp 1.200.000.000",
      deliverables: [
        "Segment branding (60 detik/day)",
        "Product placement 20 episodes",
        "Social media campaign",
        "Meet & greet BA session"
      ]
    }
  },
  {
    id: 8,
    type: "contact",
    title: "Contact & Next Steps",
    subtitle: "Let's Make It Happen",
    typeLabel: "Closing",
    content: {
      company: "Rectoverso",
      contact: "Rina A. - Supervisor",
      email: "rina.a@rectoverso.com",
      phone: "+62 21 1234 5678"
    }
  }
]

export default function PresentationModePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)
  const [copied, setCopied] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState(proposals[0])

  const totalSlides = proposalSlides.length

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/presentation/${selectedProposal.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault()
      nextSlide()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prevSlide()
    } else if (e.key === 'Escape') {
      router.push('/proposal-builder')
    }
  }

  const slide = proposalSlides[currentSlide]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        zIndex: 1000
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header Bar */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: '#1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/proposal-builder"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '13px'
            }}
          >
            <Home size={16} />
            Exit
          </Link>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#334155' }} />
          <div>
            <h1 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>
              {selectedProposal.title}
            </h1>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              {selectedProposal.program} • {selectedProposal.sponsorship_type}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge variant="blue">{currentSlide + 1} / {totalSlides}</Badge>
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            style={{
              padding: '8px',
              backgroundColor: '#334155',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <Layers size={16} color={showThumbnails ? '#2563eb' : '#94a3b8'} />
          </button>
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            style={{
              padding: '8px',
              backgroundColor: '#334155',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <PenTool size={16} color={showAnnotations ? '#2563eb' : '#94a3b8'} />
          </button>
          <button
            onClick={() => setShowShare(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'white',
              fontWeight: 500
            }}
          >
            <Share2 size={14} />
            Share
          </button>
          <button
            onClick={toggleFullscreen}
            style={{
              padding: '8px',
              backgroundColor: '#334155',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <Minimize2 size={16} color="#94a3b8" /> : <Maximize2 size={16} color="#94a3b8" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Thumbnails Sidebar */}
        {showThumbnails && (
          <div style={{
            width: '180px',
            backgroundColor: '#1e293b',
            borderRight: '1px solid #334155',
            padding: '12px',
            overflowY: 'auto'
          }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px', fontWeight: 500 }}>SLIDES</p>
            {proposalSlides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goToSlide(index)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: currentSlide === index ? '#2563eb' : '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}
              >
                <p style={{
                  fontSize: '10px',
                  color: 'white',
                  fontWeight: currentSlide === index ? 600 : 400,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {index + 1}. {s.title}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Main Slide Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative'
        }}>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            style={{
              position: 'absolute',
              left: '20px',
              padding: '16px',
              backgroundColor: currentSlide === 0 ? '#1e293b40' : '#1e293b',
              border: 'none',
              borderRadius: '12px',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              opacity: currentSlide === 0 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={24} color="white" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            style={{
              position: 'absolute',
              right: '20px',
              padding: '16px',
              backgroundColor: currentSlide === totalSlides - 1 ? '#1e293b40' : '#1e293b',
              border: 'none',
              borderRadius: '12px',
              cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer',
              opacity: currentSlide === totalSlides - 1 ? 0.5 : 1
            }}
          >
            <ChevronRight size={24} color="white" />
          </button>

          {/* Slide Content */}
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              aspectRatio: '16/9',
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              padding: '48px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
          >
            {/* Slide Type Badge */}
            <Badge
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: '#2563eb',
                color: 'white',
                fontSize: '10px'
              }}
            >
              {slide.typeLabel}
            </Badge>

            {/* Slide Type: Cover */}
            {slide.type === 'cover' && (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#2563eb',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>PF</span>
                  </div>
                  <Badge style={{ backgroundColor: '#2563eb', color: 'white' }}>CONFIDENTIAL</Badge>
                </div>

                <div>
                  <h1 style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 12px 0'
                  }}>
                    {slide.content.brand}
                  </h1>
                  <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)', margin: '0 0 24px 0' }}>
                    {slide.content.program}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Badge style={{ backgroundColor: '#334155', color: 'white' }}>{slide.content.year}</Badge>
                    <Badge style={{ backgroundColor: '#334155', color: 'white' }}>{slide.content.sponsorType}</Badge>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 4px 0' }}>Sponsorship Proposal</p>
                    <p style={{ fontSize: '14px', color: 'white', margin: 0 }}>by Rectoverso</p>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{slide.content.year}</p>
                </div>
              </div>
            )}

            {/* Slide Type: Brief */}
            {slide.type === 'brief' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>{slide.title}</h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{slide.subtitle}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
                  <div style={{ padding: '24px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>OBJECTIVE</p>
                    <p style={{ fontSize: '14px', color: 'white', lineHeight: 1.5 }}>{slide.content.objective}</p>
                  </div>
                  <div style={{ padding: '24px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>TARGET AUDIENCE</p>
                    <p style={{ fontSize: '14px', color: 'white' }}>{slide.content.targetAudience}</p>
                  </div>
                  <div style={{ padding: '24px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>BUDGET</p>
                    <p style={{ fontSize: '14px', color: 'white' }}>{slide.content.budget}</p>
                  </div>
                  <div style={{ padding: '24px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>PERIOD</p>
                    <p style={{ fontSize: '14px', color: 'white' }}>{slide.content.period}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Type: Brand */}
            {slide.type === 'brand' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>{slide.title}</h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{slide.subtitle}</p>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '24px' }}>
                    {slide.content.description}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    {slide.content.values.map((val, i) => (
                      <Badge key={i} style={{ backgroundColor: '#2563eb', color: 'white', padding: '6px 12px' }}>
                        {val}
                      </Badge>
                    ))}
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#334155', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Users size={16} color="#94a3b8" />
                    <p style={{ fontSize: '12px', color: 'white', margin: 0 }}>
                      <strong>Persona:</strong> {slide.content.persona}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Type: Audience */}
            {slide.type === 'audience' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>{slide.title}</h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{slide.subtitle}</p>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>PRIMARY TARGET</p>
                    <div style={{ padding: '20px', backgroundColor: '#2563eb', borderRadius: '12px' }}>
                      <p style={{ fontSize: '18px', color: 'white', fontWeight: 600 }}>{slide.content.primary}</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>CHARACTERISTICS</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {slide.content.characteristics.map((char, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', backgroundColor: '#2563eb', borderRadius: '50%' }} />
                          <p style={{ fontSize: '13px', color: 'white', margin: 0 }}>{char}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Type: Program */}
            {slide.type === 'program' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>{slide.title}</h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{slide.subtitle}</p>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>PROGRAM</p>
                    <p style={{ fontSize: '16px', color: 'white', fontWeight: 600 }}>{slide.content.programName}</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>CHANNEL</p>
                    <p style={{ fontSize: '16px', color: 'white', fontWeight: 600 }}>{slide.content.channel}</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>SLOT</p>
                    <p style={{ fontSize: '14px', color: 'white', fontWeight: 600 }}>{slide.content.slot}</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>EPISODES</p>
                    <p style={{ fontSize: '16px', color: 'white', fontWeight: 600 }}>{slide.content.episodes}</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#2563eb', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>REACH/EPISODE</p>
                    <p style={{ fontSize: '18px', color: 'white', fontWeight: 700 }}>{slide.content.reach}</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#334155', borderRadius: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>DEMOGRAPHICS</p>
                    <p style={{ fontSize: '12px', color: 'white', lineHeight: 1.4 }}>{slide.content.demographics}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Type: Integration */}
            {slide.type === 'integration' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>{slide.title}</h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{slide.subtitle}</p>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                  <div style={{
                    padding: '32px',
                    background: 'linear-gradient(135deg, #2563eb, #991b1b)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Creative Concept</p>
                      <p style={{ fontSize: '28px', color: 'white', fontWeight: 'bold' }}>{slide.content.concept}</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>INTEGRATION ELEMENTS</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {slide.content.elements.map((el, i) => (
                        <div key={i} style={{
                          padding: '16px',
                          backgroundColor: '#334155',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#2563eb',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Check size={16} color="white" />
                          </div>
                          <p style={{ fontSize: '14px', color: 'white', margin: 0 }}>{el}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Type: Package */}
            {slide.type === 'package' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>{slide.title}</h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{slide.subtitle}</p>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div style={{
                    padding: '32px',
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    borderRadius: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '12px', color: '#92400e', marginBottom: '8px' }}>PACKAGE VALUE</p>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>{slide.content.value}</p>
                    <p style={{ fontSize: '14px', color: '#92400e' }}>{slide.content.packageName}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>DELIVERABLES</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {slide.content.deliverables.map((d, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%' }} />
                          <p style={{ fontSize: '14px', color: 'white', margin: 0 }}>{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Type: Contact */}
            {slide.type === 'contact' && (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#2563eb',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>PF</span>
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 12px 0' }}>{slide.title}</h2>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: '0 0 32px 0' }}>{slide.subtitle}</p>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                  <div style={{ padding: '16px 24px', backgroundColor: '#334155', borderRadius: '8px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>CONTACT</p>
                    <p style={{ fontSize: '14px', color: 'white' }}>{slide.content.contact}</p>
                  </div>
                  <div style={{ padding: '16px 24px', backgroundColor: '#334155', borderRadius: '8px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>EMAIL</p>
                    <p style={{ fontSize: '14px', color: 'white' }}>{slide.content.email}</p>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  © 2025 Rectoverso. All rights reserved.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: '#1e293b',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        borderTop: '1px solid #334155'
      }}>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          style={{
            padding: '8px 24px',
            backgroundColor: currentSlide === 0 ? '#33415550' : '#334155',
            border: 'none',
            borderRadius: '8px',
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'white'
          }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {proposalSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentSlide === index ? '24px' : '8px',
                height: '8px',
                backgroundColor: currentSlide === index ? '#2563eb' : currentSlide > index ? '#16a34a' : '#334155',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          style={{
            padding: '8px 24px',
            backgroundColor: currentSlide === totalSlides - 1 ? '#33415550' : '#2563eb',
            border: 'none',
            borderRadius: '8px',
            cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'white'
          }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ==================== SHARE MODAL ==================== */}
      {showShare && (
        <>
          <div
            onClick={() => setShowShare(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1001,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '450px',
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              zIndex: 1002,
              overflow: 'hidden',
            }}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>Share Presentation</h3>
              <button
                onClick={() => setShowShare(false)}
                style={{
                  padding: '6px',
                  backgroundColor: '#334155',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={16} color="#94a3b8" />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Shareable Link</p>
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#334155',
                borderRadius: '8px'
              }}>
                <input
                  type="text"
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/presentation/${selectedProposal.id}`}
                  readOnly
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleShare}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: copied ? '#16a34a' : '#2563eb',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: 'white'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px' }}>
                Link ini bisa digunakan client untuk melihat proposal dalam mode read-only.
              </p>

              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>View-Only Access</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="sm" style={{ flex: 1, borderColor: '#334155', color: 'white' }}>
                    <Download size={14} style={{ marginRight: '6px' }} />
                    Download PDF
                  </Button>
                  <Button size="sm" style={{ flex: 1, backgroundColor: '#2563eb' }}>
                    <Camera size={14} style={{ marginRight: '6px' }} />
                    Screenshot
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
