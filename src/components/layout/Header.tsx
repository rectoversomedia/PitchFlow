"use client"

import { useState, useEffect } from "react"
import { Bell, MessageSquare, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { currentUser } from "@/lib/mock-data"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [user, setUser] = useState(currentUser)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Check for demo user
    if (typeof window !== 'undefined') {
      const demoUserStr = localStorage.getItem('pitchflow_demo_user')
      const isDemoMode = localStorage.getItem('pitchflow_is_demo')
      if (demoUserStr && isDemoMode === 'true') {
        const demoUser = JSON.parse(demoUserStr)
        setUser(demoUser)
        setIsDemo(true)
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pitchflow_demo_user')
      localStorage.removeItem('pitchflow_is_demo')
    }
    router.push('/login')
  }

  const notifications = [
    { id: 1, title: "Brief baru dari Sales", desc: "Wardah - Sinetron Ramadan", time: "5 menit lalu", unread: true },
    { id: 2, title: "Proposal siap di-review", desc: "Shopee - 6.6 Big Sale", time: "30 menit lalu", unread: true },
    { id: 3, title: "Feedback dari Sales", desc: "Aqua - 100% Murni", time: "1 jam lalu", unread: true },
    { id: 4, title: "Proposal winning", desc: "Hydro Coco - Sports Time", time: "2 jam lalu", unread: false },
    { id: 5, title: "Brief deadline approaching", desc: "OPPO - Reno Series", time: "3 jam lalu", unread: false },
  ]

  const messages = [
    { id: 1, from: "Budi Setiawan", role: "Sales", avatar: "BS", content: "Budget mohon disesuaikan...", time: "10:30", unread: true },
    { id: 2, from: "Andi Pratama", role: "Sales", avatar: "AP", content: "Client minta tambahan ide...", time: "09:15", unread: true },
    { id: 3, from: "Dita Amelia", role: "ACS", avatar: "DA", content: "Mohon tambahan visual...", time: "Kemarin", unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length
  const unreadMessages = messages.filter(m => m.unread).length

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          padding: '0 24px',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, maxWidth: '768px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Cari brief, proposal, brand, atau program..."
              style={{
                width: '100%',
                height: '44px',
                paddingLeft: '48px',
                paddingRight: '16px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '24px' }}>
          {/* Notification */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowMessages(false)
              }}
              style={{
                position: 'relative',
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: showNotifications ? '#fee2e2' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <Bell size={20} color={showNotifications ? "#2563eb" : "#475569"} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div
                  onClick={() => setShowNotifications(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '360px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    border: '1px solid #e2e8f0',
                    zIndex: 51,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Notifikasi</h3>
                    <Link href="/sales-review" onClick={() => setShowNotifications(false)} style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}>
                      Lihat semua
                    </Link>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.title.includes("Brief") ? "/brief-intake" : notif.title.includes("Proposal") || notif.title.includes("Feedback") ? "/sales-review" : "/dashboard"}
                        onClick={() => setShowNotifications(false)}
                        style={{
                          display: 'block',
                          padding: '14px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          textDecoration: 'none',
                          backgroundColor: notif.unread ? '#fef2f2' : 'white',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: notif.unread ? '#fee2e2' : '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Bell size={18} color={notif.unread ? '#2563eb' : '#64748b'} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: notif.unread ? 600 : 400, color: '#0f172a', margin: '0 0 4px 0' }}>{notif.title}</p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notif.desc}</p>
                            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>{notif.time}</p>
                          </div>
                          {notif.unread && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0, marginTop: '6px' }} />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Messages */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowMessages(!showMessages)
                setShowNotifications(false)
              }}
              style={{
                position: 'relative',
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: showMessages ? '#f3e8ff' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <MessageSquare size={20} color={showMessages ? "#9333ea" : "#475569"} />
              {unreadMessages > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#9333ea',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadMessages}
                </span>
              )}
            </button>

            {/* Messages Dropdown */}
            {showMessages && (
              <>
                <div
                  onClick={() => setShowMessages(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '360px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    border: '1px solid #e2e8f0',
                    zIndex: 51,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Pesan</h3>
                    <Link href="/sales-review" onClick={() => setShowMessages(false)} style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}>
                      Lihat semua
                    </Link>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {messages.map((msg) => (
                      <Link
                        key={msg.id}
                        href="/sales-review"
                        onClick={() => setShowMessages(false)}
                        style={{
                          display: 'block',
                          padding: '14px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          textDecoration: 'none',
                          backgroundColor: msg.unread ? '#faf5ff' : 'white',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: msg.role === 'Sales' ? '#2563eb' : '#9333ea',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 600,
                            flexShrink: 0
                          }}>
                            {msg.avatar}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ fontSize: '13px', fontWeight: msg.unread ? 600 : 400, color: '#0f172a', margin: 0 }}>{msg.from}</p>
                              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.time}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.content}</p>
                          </div>
                          {msg.unread && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9333ea', flexShrink: 0, marginTop: '6px' }} />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingLeft: '12px',
              borderLeft: '1px solid #e2e8f0',
            }}
          >
            <Avatar style={{ width: '36px', height: '36px' }}>
              <AvatarFallback
                style={{
                  backgroundColor: isDemo ? '#16a34a' : '#2563eb',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{user.name}</p>
                {isDemo && (
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    DEMO
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: '8px',
                padding: '8px',
                backgroundColor: '#fef2f2',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Logout"
            >
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
