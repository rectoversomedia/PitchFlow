"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  FileText,
  PenLine,
  FolderOpen,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ChevronRight,
  X,
  Send,
  BarChart3,
  Calendar,
  Users,
  Presentation as PresentationIcon,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Brief Intake", href: "/brief-intake", icon: FileText },
  { name: "Proposal Builder", href: "/proposal-builder", icon: PenLine },
  { name: "Proposal Library", href: "/proposal-library", icon: FolderOpen },
  { name: "Sales Review", href: "/sales-review", icon: MessageSquare },
]

const aiTools = [
  { name: "Brand DNA Explorer", href: "/brand-dna-explorer", icon: Sparkles, badge: "NEW" },
  { name: "Trend Radar", href: "/trend-radar", icon: BarChart3, badge: "NEW" },
  { name: "Audience Insights", href: "/audience-insights", icon: Users, badge: "NEW" },
  { name: "ROI Calculator", href: "/roi-calculator", icon: Sparkles, badge: "NEW" },
  { name: "Campaign Studio", href: "/campaign-studio", icon: Lightbulb, badge: "NEW" },
]

const toolsItems = [
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Client CRM", href: "/client-crm", icon: Users },
  { name: "Presentation", href: "/presentation", icon: PresentationIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Halo! Saya AI Assistant PitchFlow. Ada yang bisa saya bantu untuk membuat proposal sponsorship Anda?' }
  ])
  const [chatInput, setChatInput] = useState("")

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    setChatMessages([...chatMessages, { role: 'user', text: chatInput }])
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Saya bisa membantu Anda membuat brief sponsorship yang lebih terstruktur. Apa brand yang sedang Anda tangani?",
        "Untuk proposal yang lebih kuat, saya sarankan untuk fokus pada insight audiens target. Apakah Anda sudah memiliki data audience?",
        "Berikut ide integrasi kreatif untuk brand Anda...",
        "Saya bisa bantu generate template proposal berdasarkan brief yang ada. Mau coba?"
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatMessages(prev => [...prev, { role: 'ai', text: randomResponse }])
    }, 1000)
  }

  return (
    <>
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '256px',
          height: '100vh',
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            height: '64px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <Image src="/picthflow logo (white).png" alt="PitchFlow" width={140} height={40} style={{ objectFit: 'contain' }} />
        </div>

        {/* Navigation Section */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            overflowY: 'auto',
          }}
        >
          {/* Main Nav */}
          <div style={{ marginBottom: '8px' }}>
            <p style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#64748b',
              padding: '0 16px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Main Menu
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    marginBottom: '2px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? 'white' : '#cbd5e1',
                    backgroundColor: isActive ? '#7c3aed' : 'transparent',
                    boxShadow: isActive ? '0 10px 15px -3px rgba(124, 58, 237, 0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* AI Tools Section */}
          <div style={{ marginBottom: '8px' }}>
            <p style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#64748b',
              padding: '0 16px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              AI Tools 🧠
            </p>
            {aiTools.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    marginBottom: '2px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? 'white' : '#cbd5e1',
                    backgroundColor: isActive ? '#7c3aed' : 'transparent',
                    boxShadow: isActive ? '0 10px 15px -3px rgba(124, 58, 237, 0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#10b981',
                      color: 'white',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: '#1e293b',
            margin: '16px 0'
          }} />

          {/* Tools Section */}
          <div>
            <p style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#64748b',
              padding: '0 16px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Management
            </p>
            {toolsItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    marginBottom: '2px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? 'white' : '#cbd5e1',
                    backgroundColor: isActive ? '#7c3aed' : 'transparent',
                    boxShadow: isActive ? '0 10px 15px -3px rgba(124, 58, 237, 0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* AI Assistant Section */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid #1e293b',
          }}
        >
          <div
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(59, 130, 246, 0.2))',
              borderRadius: '12px',
              border: '1px solid rgba(124, 58, 237, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ padding: '6px', backgroundColor: 'rgba(124, 58, 237, 0.3)', borderRadius: '6px' }}>
                <Sparkles size={14} color="#a78bfa" />
              </div>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>AI Assistant</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '10px', marginBottom: '12px', lineHeight: 1.5 }}>
              Butuh bantuan membuat proposal lebih cepat?
            </p>
            <button
              onClick={() => setShowChat(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px 12px',
                backgroundColor: '#7c3aed',
                color: 'white',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Mulai Chat
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </aside>

      {/* AI Chat Modal */}
      {showChat && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowChat(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 100,
            }}
          />

          {/* Chat Modal */}
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '380px',
              height: '500px',
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
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="white" />
                </div>
                <div>
                  <h3 style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: 0 }}>AI Assistant</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>Online</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} color="white" />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                padding: '16px 20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: msg.role === 'user' ? '#7c3aed' : '#f1f5f9',
                      color: msg.role === 'user' ? 'white' : '#0f172a',
                      fontSize: '13px',
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '12px',
              }}
            >
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{
                  flex: 1,
                  height: '44px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '22px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: chatInput.trim() ? '#7c3aed' : '#e2e8f0',
                  border: 'none',
                  borderRadius: '22px',
                  cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={18} color={chatInput.trim() ? 'white' : '#94a3b8'} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
