"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { proposals, briefs } from "@/lib/mock-data"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Building,
  Users,
  Filter,
  Search,
  Bell,
  Eye,
  Edit,
  X,
  Check,
  Loader2,
} from "lucide-react"
import Link from "next/link"

const timelineEvents = [
  {
    id: 1,
    title: "Brief Deadline",
    proposal: "Wardah - Ramadan Campaign",
    date: "2025-05-27",
    time: "17:00",
    type: "deadline",
    color: "#2563eb",
    priority: "high"
  },
  {
    id: 2,
    title: "Proposal Submission",
    proposal: "OPPO - Reno Series",
    date: "2025-05-28",
    time: "12:00",
    type: "submission",
    color: "#2563eb",
    priority: "high"
  },
  {
    id: 3,
    title: "Client Meeting",
    proposal: "Indomie - Family Moment",
    date: "2025-05-29",
    time: "14:00",
    type: "meeting",
    color: "#16a34a",
    priority: "medium"
  },
  {
    id: 4,
    title: "Pitch Presentation",
    proposal: "Shopee - 6.6 Big Sale",
    date: "2025-05-30",
    time: "10:00",
    type: "pitch",
    color: "#9333ea",
    priority: "high"
  },
  {
    id: 5,
    title: "Production Start",
    proposal: "Honda - One HEART",
    date: "2025-05-31",
    time: "08:00",
    type: "production",
    color: "#d97706",
    priority: "medium"
  },
  {
    id: 6,
    title: "Airing Start",
    proposal: "Aqua - 100% Murni",
    date: "2025-06-01",
    time: "19:00",
    type: "airing",
    color: "#06b6d4",
    priority: "low"
  },
  {
    id: 7,
    title: "Contract Signing",
    proposal: "Telkomsel - Halo+",
    date: "2025-06-03",
    time: "15:00",
    type: "contract",
    color: "#16a34a",
    priority: "high"
  },
  {
    id: 8,
    title: "Campaign End",
    proposal: "Pepsodent - Total Care",
    date: "2025-06-05",
    time: "23:59",
    type: "end",
    color: "#64748b",
    priority: "low"
  },
]

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)) // May 2025
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')
  const [selectedEvent, setSelectedEvent] = useState<typeof timelineEvents[0] | null>(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [filterType, setFilterType] = useState("all")

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Add empty slots for days before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const getEventsForDay = (day: number | null) => {
    if (!day) return []
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return timelineEvents.filter(e => e.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleEventClick = (event: typeof timelineEvents[0]) => {
    setSelectedEvent(event)
    setShowEventDetail(true)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock size={12} color="white" />
      case 'submission': return <CheckCircle size={12} color="white" />
      case 'meeting': return <Users size={12} color="white" />
      case 'pitch': return <Target size={12} color="white" />
      case 'production': return <Calendar size={12} color="white" />
      case 'airing': return <Check size={12} color="white" />
      case 'contract': return <CheckCircle size={12} color="white" />
      case 'end': return <X size={12} color="white" />
      default: return <Calendar size={12} color="white" />
    }
  }

  const filteredEvents = filterType === 'all'
    ? timelineEvents
    : timelineEvents.filter(e => e.type === filterType)

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Calendar & Timeline
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Kelola jadwal dan milestone semua proposal
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '14px', paddingRight: '14px' }}>
              <Bell size={16} style={{ marginRight: '8px' }} />
              Reminder Settings
            </Button>
            <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              Add Event
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: "Events Bulan Ini", value: 12, color: "#2563eb", bg: "#eff6ff" },
            { label: "Deadlines", value: 3, color: "#2563eb", bg: "#fef2f2" },
            { label: "Meetings", value: 5, color: "#16a34a", bg: "#dcfce7" },
            { label: "Pitches", value: 2, color: "#9333ea", bg: "#f3e8ff" },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                backgroundColor: stat.bg,
                borderRadius: '12px',
                border: `1px solid ${stat.color}30`
              }}
            >
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          {/* Calendar */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Calendar Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  {months[currentMonth]} {currentYear}
                </h2>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => navigateMonth('prev')}
                    style={{
                      padding: '6px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronLeft size={16} color="#64748b" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(2025, 4, 1))}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#64748b'
                    }}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    style={{
                      padding: '6px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronRight size={16} color="#64748b" />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                {['month', 'week', 'list'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as typeof viewMode)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: viewMode === mode ? '#2563eb' : '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: viewMode === mode ? 'white' : '#64748b',
                      textTransform: 'capitalize'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: '1px solid #e2e8f0'
            }}>
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: index === 0 || index === 6 ? '#94a3b8' : '#64748b',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)'
            }}>
              {getDaysInMonth().map((day, index) => {
                const dayEvents = getEventsForDay(day)
                const isToday = day === 27 && currentMonth === 4 && currentYear === 2025
                const isWeekend = index % 7 === 0 || index % 7 === 6

                return (
                  <div
                    key={index}
                    style={{
                      minHeight: '100px',
                      padding: '8px',
                      borderRight: (index + 1) % 7 !== 0 ? '1px solid #f1f5f9' : 'none',
                      borderBottom: index < getDaysInMonth().length - 7 ? '1px solid #f1f5f9' : 'none',
                      backgroundColor: isToday ? '#fef2f2' : isWeekend ? '#fafafa' : 'white'
                    }}
                  >
                    {day && (
                      <>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: isToday ? 700 : 500,
                          color: isToday ? '#2563eb' : isWeekend ? '#94a3b8' : '#0f172a'
                        }}>
                          {day}
                        </span>
                        <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {dayEvents.slice(0, 2).map((event) => (
                            <button
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              style={{
                                padding: '2px 4px',
                                backgroundColor: event.color,
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                overflow: 'hidden'
                              }}
                            >
                              <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'white' }} />
                              <span style={{ fontSize: '9px', color: 'white', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.title}
                              </span>
                            </button>
                          ))}
                          {dayEvents.length > 2 && (
                            <span style={{ fontSize: '9px', color: '#64748b', paddingLeft: '4px' }}>
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar - Upcoming Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Filters */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '16px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Filter</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'deadline', label: 'Deadline' },
                  { id: 'meeting', label: 'Meeting' },
                  { id: 'pitch', label: 'Pitch' },
                  { id: 'production', label: 'Production' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: filterType === filter.id ? '#2563eb' : '#f1f5f9',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: filterType === filter.id ? 'white' : '#64748b'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              flex: 1
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Upcoming Events</h3>
              </div>

              <div style={{ padding: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                {filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = event.color
                      e.currentTarget.style.backgroundColor = event.color + '10'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: event.color,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getEventIcon(event.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{event.title}</p>
                        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{event.proposal}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={10} />
                            {event.date}
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={10} />
                            {event.time}
                          </span>
                        </div>
                      </div>
                      {event.priority === 'high' && (
                        <AlertCircle size={16} color="#2563eb" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline View - Full Width */}
        {viewMode === 'list' && (
          <div style={{
            marginTop: '24px',
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Full Timeline View</h3>
              <Badge variant="blue">{filteredEvents.length} events</Badge>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Timeline */}
              <div style={{ position: 'relative' }}>
                {/* Vertical Line */}
                <div style={{
                  position: 'absolute',
                  left: '23px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#e2e8f0'
                }} />

                {/* Events */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event, index) => (
                    <div key={event.id} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                      {/* Timeline Dot */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: event.color,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                          position: 'relative'
                        }}
                      >
                        {getEventIcon(event.type)}
                      </div>

                      {/* Event Content */}
                      <div
                        style={{
                          flex: 1,
                          padding: '16px',
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleEventClick(event)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = event.color
                          e.currentTarget.style.boxShadow = `0 4px 12px ${event.color}20`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{event.title}</h4>
                            <p style={{ fontSize: '12px', color: '#64748b' }}>{event.proposal}</p>
                          </div>
                          <Badge style={{
                            backgroundColor: event.color,
                            color: 'white',
                            fontSize: '10px'
                          }}>
                            {event.type}
                          </Badge>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} />
                            {event.date}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} />
                            {event.time}
                          </span>
                          {event.priority === 'high' && (
                            <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertCircle size={12} />
                              High Priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EVENT DETAIL MODAL ==================== */}
        {showEventDetail && selectedEvent && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setShowEventDetail(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100,
              }}
            />

            {/* Modal */}
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 101,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: selectedEvent.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getEventIcon(selectedEvent.type)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0 }}>{selectedEvent.title}</h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{selectedEvent.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEventDetail(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} color="white" />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Tanggal</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedEvent.date}</p>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Waktu</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedEvent.time}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Proposal</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedEvent.proposal}</p>
                  </div>
                </div>

                {selectedEvent.priority === 'high' && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} color="#2563eb" />
                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>High Priority Event - Segera ditindaklanjuti!</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href="/proposal-builder" style={{ flex: 1 }}>
                    <Button variant="outline" style={{ width: '100%' }}>
                      <Eye size={14} style={{ marginRight: '6px' }} />
                      Lihat Proposal
                    </Button>
                  </Link>
                  <Button style={{ flex: 1, backgroundColor: '#2563eb' }}>
                    <Bell size={14} style={{ marginRight: '6px' }} />
                    Set Reminder
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
