"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Clock,
  ChevronRight,
  Star,
  AlertCircle,
  X,
  Check,
  Loader2,
} from "lucide-react"

const clients = [
  {
    id: 1,
    company: "Wardah",
    logo: "W",
    industry: "Beauty & Personal Care",
    status: "active",
    contacts: [
      {
        id: 1,
        name: "Sarah Putri",
        position: "Marketing Director",
        email: "sarah.putri@wardah.com",
        phone: "+62 812 3456 7890",
        isPrimary: true
      },
      {
        id: 2,
        name: "Ahmad Rizki",
        position: "Brand Manager",
        email: "ahmad.rizki@wardah.com",
        phone: "+62 812 3456 7891",
        isPrimary: false
      }
    ],
    lastContact: "2025-05-20",
    nextFollowUp: "2025-05-28",
    totalDeals: 5,
    totalValue: "Rp 5.2M",
    notes: "Client sangat tertarik dengan format sinetron Ramadan. Fokus pada momen keluarga dan spiritual."
  },
  {
    id: 2,
    company: "OPPO Indonesia",
    logo: "O",
    industry: "Technology",
    status: "active",
    contacts: [
      {
        id: 3,
        name: "Budi Santoso",
        position: "Head of Marketing",
        email: "budi.santoso@oppo.com",
        phone: "+62 813 4567 8901",
        isPrimary: true
      }
    ],
    lastContact: "2025-05-18",
    nextFollowUp: "2025-05-25",
    totalDeals: 4,
    totalValue: "Rp 3.8M",
    notes: "OPPO fokus pada target audience anak muda. Suggest program yang engage dengan Gen Z."
  },
  {
    id: 3,
    company: "Indomie",
    logo: "I",
    industry: "Food & Beverages",
    status: "active",
    contacts: [
      {
        id: 4,
        name: "Diana Chen",
        position: "Brand Director",
        email: "diana.chen@indomie.com",
        phone: "+62 814 5678 9012",
        isPrimary: true
      },
      {
        id: 5,
        name: "Fajar Nugroho",
        position: "Marketing Manager",
        email: "fajar.nugroho@indomie.com",
        phone: "+62 814 5678 9013",
        isPrimary: false
      }
    ],
    lastContact: "2025-05-15",
    nextFollowUp: "2025-05-22",
    totalDeals: 3,
    totalValue: "Rp 3.3M",
    notes: "Indomie ingin menonjolkan aspek family-friendly. Budget locked."
  },
  {
    id: 4,
    company: "Bank BCA",
    logo: "B",
    industry: "Banking & Finance",
    status: "prospect",
    contacts: [
      {
        id: 6,
        name: "Michael Tanoto",
        position: "VP Marketing",
        email: "michael.tanoto@bca.co.id",
        phone: "+62 815 6789 0123",
        isPrimary: true
      }
    ],
    lastContact: "2025-05-10",
    nextFollowUp: "2025-05-30",
    totalDeals: 0,
    totalValue: "-",
    notes: "Prospect baru. Butuh approach edukatif untuk produk KPR dan deposito."
  },
  {
    id: 5,
    company: "Aqua",
    logo: "A",
    industry: "Food & Beverages",
    status: "active",
    contacts: [
      {
        id: 7,
        name: "Lisa Wijaya",
        position: "Brand Manager",
        email: "lisa.wijaya@aqua.com",
        phone: "+62 816 7890 1234",
        isPrimary: true
      }
    ],
    lastContact: "2025-05-08",
    nextFollowUp: "2025-05-29",
    totalDeals: 2,
    totalValue: "Rp 2.4M",
    notes: "Aqua fokus pada purity dan kesegaran. Challenging untuk beat competitive positioning."
  },
  {
    id: 6,
    company: "Honda Indonesia",
    logo: "H",
    industry: "Automotive",
    status: "inactive",
    contacts: [
      {
        id: 8,
        name: "Rudi Hermawan",
        position: "Marketing Director",
        email: "rudi.hermawan@honda.co.id",
        phone: "+62 817 8901 2345",
        isPrimary: true
      }
    ],
    lastContact: "2025-04-20",
    nextFollowUp: null,
    totalDeals: 3,
    totalValue: "Rp 4.5M",
    notes: "Last deal closed April 2024. Need re-engagement strategy."
  }
]

const interactionHistory = [
  { date: "2025-05-20", type: "meeting", title: "Proposal Discussion", detail: "Discussed Ramadan campaign proposal", client: "Wardah" },
  { date: "2025-05-18", type: "email", title: "Quote Sent", detail: "Sent revised quotation for Reno Series", client: "OPPO" },
  { date: "2025-05-15", type: "call", title: "Follow-up Call", detail: "Discussed budget allocation for Q3", client: "Indomie" },
  { date: "2025-05-10", type: "meeting", title: "Initial Meeting", detail: "Intro meeting with VP Marketing", client: "Bank BCA" },
]

export default function ClientCRMPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null)
  const [showClientDetail, setShowClientDetail] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleClientClick = (client: typeof clients[0]) => {
    setSelectedClient(client)
    setShowClientDetail(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#dcfce7', color: '#16a34a', border: '#86efac' }
      case 'prospect': return { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' }
      case 'inactive': return { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' }
      default: return { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' }
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'prospect': return 'Prospek'
      case 'inactive': return 'Tidak Aktif'
      default: return status
    }
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Client CRM
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Kelola hubungan client dan tracking interaction history
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" size="sm" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '14px', paddingRight: '14px' }}>
              <Filter size={16} style={{ marginRight: '8px' }} />
              Filter
            </Button>
            <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }} onClick={() => setShowAddClient(true)}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: "Total Clients", value: clients.length, color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
            { label: "Active", value: clients.filter(c => c.status === 'active').length, color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
            { label: "Prospects", value: clients.filter(c => c.status === 'prospect').length, color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
            { label: "Total Value", value: "Rp 19.2M", color: "#9333ea", bg: "#f3e8ff", border: "#c4b5fd" },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '16px 20px',
                backgroundColor: stat.bg,
                borderRadius: '12px',
                border: `1px solid ${stat.border}`
              }}
            >
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          {/* Client List */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'active', 'prospect', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: filterStatus === status ? '#2563eb' : '#f1f5f9',
                      color: filterStatus === status ? 'white' : '#64748b',
                    }}
                  >
                    {status === 'all' ? 'Semua' : getStatusLabel(status)}
                  </button>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Cari client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: 'white',
                    width: '200px'
                  }}
                />
              </div>
            </div>

            {/* Client Cards */}
            <div style={{ padding: '16px', maxHeight: '600px', overflowY: 'auto' }}>
              {filteredClients.map((client) => {
                const statusStyle = getStatusColor(client.status)
                return (
                  <button
                    key={client.id}
                    onClick={() => handleClientClick(client)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: `1px solid ${selectedClient?.id === client.id ? '#2563eb' : '#e2e8f0'}`,
                      marginBottom: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = selectedClient?.id === client.id ? '#2563eb' : '#e2e8f0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {/* Logo */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#2563eb'
                      }}>
                        {client.logo}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{client.company}</h4>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{client.industry}</p>
                          </div>
                          <Badge style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontSize: '10px',
                            padding: '2px 8px'
                          }}>
                            {getStatusLabel(client.status)}
                          </Badge>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={12} />
                            {client.contacts.length} contacts
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            {client.totalDeals} deals
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building size={12} />
                            {client.totalValue}
                          </span>
                        </div>
                      </div>

                      <ChevronRight size={16} color="#94a3b8" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Interaction History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Info */}
            {selectedClient ? (
              <div style={{
                background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#2563eb'
                  }}>
                    {selectedClient.logo}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedClient.company}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{selectedClient.industry}</p>
                    <Badge style={{
                      backgroundColor: getStatusColor(selectedClient.status).bg,
                      color: getStatusColor(selectedClient.status).color,
                      fontSize: '10px',
                      marginTop: '4px'
                    }}>
                      {getStatusLabel(selectedClient.status)}
                    </Badge>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8' }}>Total Deals</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{selectedClient.totalDeals}</p>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8' }}>Total Value</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{selectedClient.totalValue}</p>
                  </div>
                </div>

                {selectedClient.nextFollowUp && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <Clock size={14} color="#d97706" />
                    <span style={{ fontSize: '11px', color: '#92400e' }}>
                      Next Follow-up: {selectedClient.nextFollowUp}
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Primary Contact</p>
                  {selectedClient.contacts.filter(c => c.isPrimary).map((contact) => (
                    <div key={contact.id} style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{contact.name}</p>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{contact.position}</p>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <a href={`mailto:${contact.email}`} style={{ fontSize: '11px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                          <Mail size={12} /> Email
                        </a>
                        <a href={`tel:${contact.phone}`} style={{ fontSize: '11px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                          <Phone size={12} /> Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Notes</p>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{selectedClient.notes}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="sm" style={{ flex: 1 }}>
                    <Edit size={14} style={{ marginRight: '4px' }} />
                    Edit
                  </Button>
                  <Button size="sm" style={{ flex: 1, backgroundColor: '#2563eb' }}>
                    <MessageSquare size={14} style={{ marginRight: '4px' }} />
                    Contact
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <Users size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                  Pilih client untuk melihat detail
                </p>
              </div>
            )}

            {/* Recent Interactions */}
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
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Interaction History</h3>
              </div>

              <div style={{ padding: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                {interactionHistory.map((interaction, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{interaction.title}</p>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{interaction.client}</p>
                      </div>
                      <Badge variant="blue" style={{ fontSize: '9px' }}>{interaction.type}</Badge>
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{interaction.detail}</p>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                      <Calendar size={10} style={{ marginRight: '4px' }} />
                      {interaction.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== ADD CLIENT MODAL ==================== */}
        {showAddClient && (
          <>
            <div
              onClick={() => setShowAddClient(false)}
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
                width: '500px',
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
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Add New Client</h3>
                <button
                  onClick={() => setShowAddClient(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} color="#64748b" />
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Company Name *</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama company"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Industry</label>
                  <select
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="">Pilih Industry</option>
                    <option>Beauty & Personal Care</option>
                    <option>Food & Beverages</option>
                    <option>Technology</option>
                    <option>Automotive</option>
                    <option>Banking & Finance</option>
                    <option>E-Commerce</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Primary Contact Name *</label>
                  <input
                    type="text"
                    placeholder="Nama kontak"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Email</label>
                    <input
                      type="email"
                      placeholder="email@company.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Phone</label>
                    <input
                      type="tel"
                      placeholder="+62 xxx xxxx xxxx"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Notes</label>
                  <textarea
                    placeholder="Catatan tentang client..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" style={{ flex: 1 }} onClick={() => setShowAddClient(false)}>Cancel</Button>
                  <Button style={{ flex: 1, backgroundColor: '#2563eb' }}>
                    <Plus size={14} style={{ marginRight: '6px' }} />
                    Add Client
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
