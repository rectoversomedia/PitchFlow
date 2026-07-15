"use client"

import { useState, useEffect, useCallback } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/toast"
import {
  Plus,
  Search,
  FileText,
  Building,
  Upload,
  Save,
  Send,
  Eye,
  Edit,
  Download,
  Calendar,
  User,
  DollarSign,
  Target,
  Users,
  Clock,
  ChevronRight,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  PenLine,
  X,
  Check,
  Loader2,
  AlertCircle,
  AlertTriangle,
  WifiOff,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const briefStats = [
  { label: "Total Brief", key: "total", color: "#2563eb", bgColor: "#eff6ff", borderColor: "#93c5fd" },
  { label: "Baru", key: "baru", color: "#16a34a", bgColor: "#dcfce7", borderColor: "#86efac" },
  { label: "Diproses", key: "diproses", color: "#d97706", bgColor: "#fef3c7", borderColor: "#fcd34d" },
  { label: "Review", key: "review", color: "#9333ea", bgColor: "#f3e8ff", borderColor: "#c4b5fd" },
]

export default function BriefIntakePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [action, setAction] = useState<string | null>(null)
  const [briefs, setBriefs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedBrief, setSelectedBrief] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Handle action from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlAction = params.get('action')
    if (urlAction === 'new') {
      setAction('new')
      setShowForm(true)
    }
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    brand_name: '',
    pic_sales: '',
    industry_category: '',
    pic_contact: '',
    program: '',
    sponsorship_type: '',
    objective: '',
    target_audience: '',
    period: '',
    deadline: '',
    budget_range: '',
    notes: '',
  })

  // Fetch briefs from Supabase
  const fetchBriefs = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setIsError(false)
    setErrorMessage("")

    try {
      const res = await fetch('/api/briefs')
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch briefs')
      }

      setBriefs(data.data || [])
    } catch (error: any) {
      console.error('Error fetching briefs:', error)
      setIsError(true)
      setErrorMessage(error.message || 'Gagal memuat brief. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!authLoading) {
      fetchBriefs()
    }
  }, [authLoading, fetchBriefs])

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.brand_name.trim()) {
      errors.brand_name = 'Nama brand wajib diisi'
    }
    if (!formData.pic_sales.trim()) {
      errors.pic_sales = 'PIC Sales wajib diisi'
    }
    if (!formData.program.trim()) {
      errors.program = 'Program wajib diisi'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      brand_name: '',
      pic_sales: '',
      industry_category: '',
      pic_contact: '',
      program: '',
      sponsorship_type: '',
      objective: '',
      target_audience: '',
      period: '',
      deadline: '',
      budget_range: '',
      notes: '',
    })
    setFormErrors({})
  }

  const filteredBriefs = briefs.filter(brief =>
    brief.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brief.pic_sales?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stats
  const stats = {
    total: briefs.length,
    baru: briefs.filter(b => b.status === 'new').length,
    diproses: briefs.filter(b => b.status === 'in_progress').length,
    review: briefs.filter(b => b.status === 'in_review').length,
    approved: briefs.filter(b => b.status === 'completed').length,
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCreateProposal = (briefId: string) => {
    router.push(`/proposal-builder?brief=${briefId}`)
  }

  const handleSubmitBrief = async () => {
    if (!validateForm()) {
      showToast('Mohon lengkapi form dengan benar', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'new',
        }),
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create brief')
      }

      setBriefs([data.data, ...briefs])
      setSubmitted(true)
      setShowForm(false)
      resetForm()
      showToast('Brief berhasil dibuat!', 'success')

      setTimeout(() => setSubmitted(false), 3000)
    } catch (error: any) {
      console.error('Error creating brief:', error)
      showToast(error.message || 'Gagal membuat brief', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'draft',
        }),
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save draft')
      }

      setBriefs([data.data, ...briefs])
      resetForm()
      setShowForm(false)
      showToast('Draft berhasil disimpan!', 'success')
    } catch (error: any) {
      console.error('Error saving draft:', error)
      showToast(error.message || 'Gagal menyimpan draft', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: 'blue',
      in_progress: 'amber',
      approved: 'green',
      rejected: 'red',
    }
    const labels: Record<string, string> = {
      new: 'Baru',
      in_progress: 'Diproses',
      approved: 'Disetujui',
      rejected: 'Ditolak',
    }
    return (
      <Badge variant={variants[status] || 'blue'}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Brief Intake
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Kelola brief sponsorship dari Sales/Client
            </p>
          </div>
          <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }} onClick={() => setShowForm(true)}>
            <Plus size={16} style={{ marginRight: '8px' }} />
            New Brief
          </Button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {briefStats.map((stat) => (
            <div
              key={stat.key}
              style={{
                padding: '20px',
                backgroundColor: stat.bgColor,
                borderRadius: '12px',
                border: `1px solid ${stat.borderColor}`,
              }}
            >
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stats[stat.key as keyof typeof stats]}</p>
            </div>
          ))}
        </div>

        {/* Main Content - Split View */}
        <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 400px' : '1fr', gap: '24px', transition: 'all 0.3s' }}>
          {/* Brief List */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={18} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Daftar Brief</h2>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{filteredBriefs.length} brief ditemukan</p>
                </div>
              </div>
              {!showForm && (
                <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }} onClick={() => setShowForm(true)}>
                  <Plus size={14} style={{ marginRight: '4px' }} />
                  Brief Baru
                </Button>
              )}
            </div>

            {/* Search */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Cari brief, brand, atau PIC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ padding: '16px' }}>
              {/* Loading State */}
              {isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <Loader2 size={40} className="animate-spin" style={{ marginBottom: '16px', color: '#2563eb' }} />
                  <p style={{ fontSize: '14px' }}>Memuat brief...</p>
                </div>
              )}

              {/* Error State */}
              {isError && !isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <AlertTriangle size={32} color="#dc2626" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Gagal Memuat Data
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', maxWidth: '300px' }}>
                    {errorMessage || 'Terjadi kesalahan saat memuat brief.'}
                  </p>
                  <Button onClick={fetchBriefs} style={{ gap: '8px' }}>
                    <RefreshCw size={16} />
                    Coba Lagi
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && filteredBriefs.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f9ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <FileText size={40} color="#2563eb" style={{ opacity: 0.7 }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    {searchQuery ? 'Brief Tidak Ditemukan' : 'Belum Ada Brief'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', maxWidth: '300px' }}>
                    {searchQuery
                      ? `Tidak ada brief yang cocok dengan "${searchQuery}"`
                      : 'Mulai dengan membuat brief sponsorship pertama Anda'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setShowForm(true)} style={{ gap: '8px' }}>
                      <Plus size={16} />
                      Buat Brief Baru
                    </Button>
                  )}
                </div>
              )}

              {/* Data List */}
              {!isLoading && !isError && filteredBriefs.length > 0 && (
                filteredBriefs.map((brief) => (
                  <div
                    key={brief.id}
                    style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                      marginBottom: '12px',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedBrief(brief)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f1f5f9'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          backgroundColor: '#fef2f2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Building size={20} color="#2563eb" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                            {brief.brand_name}
                          </h3>
                          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                            {brief.program}
                          </p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {getStatusBadge(brief.status)}
                            <span style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>
                              {brief.industry_category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          size="sm"
                          style={{ backgroundColor: '#2563eb', paddingLeft: '12px', paddingRight: '12px' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCreateProposal(brief.id)
                          }}
                        >
                          <FileText size={14} style={{ marginRight: '4px' }} />
                          Buat Proposal
                        </Button>
                        <button style={{ padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                          <Eye size={16} color="#64748b" />
                        </button>
                        <button style={{ padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                          <Edit size={16} color="#64748b" />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} />
                        {brief.pic_sales}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {brief.deadline}
                      </span>
                      {brief.budget_range && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={12} />
                          {brief.budget_range}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Brief Form */}
          {showForm && (
            <div style={{
              background: 'linear-gradient(180deg, #ffffff, #fafafa)',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              height: 'fit-content',
              position: 'sticky',
              top: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Buat Brief Baru</h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} color="#64748b" />
                </button>
              </div>

              {/* Success Notification */}
              {submitted && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#dcfce7',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#16a34a',
                  animation: 'slideIn 0.3s ease'
                }}>
                  <Check size={16} />
                  Brief berhasil dibuat!
                </div>
              )}

              {/* Form Container */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                {/* Brand Name Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Nama Brand <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Wardah, OPPO, Indomie"
                    value={formData.brand_name}
                    onChange={(e) => {
                      handleInputChange('brand_name', e.target.value)
                      if (formErrors.brand_name) {
                        setFormErrors({ ...formErrors, brand_name: '' })
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '14px',
                      paddingRight: '14px',
                      backgroundColor: '#f8fafc',
                      border: `1px solid ${formErrors.brand_name ? '#dc2626' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = formErrors.brand_name ? '#dc2626' : '#e2e8f0'}
                  />
                  {formErrors.brand_name && (
                    <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {formErrors.brand_name}
                    </p>
                  )}
                </div>

                {/* PIC Sales Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    PIC Sales <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama PIC Sales"
                    value={formData.pic_sales}
                    onChange={(e) => {
                      handleInputChange('pic_sales', e.target.value)
                      if (formErrors.pic_sales) {
                        setFormErrors({ ...formErrors, pic_sales: '' })
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '14px',
                      paddingRight: '14px',
                      backgroundColor: '#f8fafc',
                      border: `1px solid ${formErrors.pic_sales ? '#dc2626' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = formErrors.pic_sales ? '#dc2626' : '#e2e8f0'}
                  />
                  {formErrors.pic_sales && (
                    <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {formErrors.pic_sales}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Kategori Industri
                  </label>
                  <select
                    value={formData.industry_category}
                    onChange={(e) => handleInputChange('industry_category', e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: formData.industry_category ? '#0f172a' : '#94a3b8'
                    }}
                  >
                    <option value="">Pilih industri</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Technology">Technology</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Finance">Finance</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Program
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => handleInputChange('program', e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: formData.program ? '#0f172a' : '#94a3b8'
                    }}
                  >
                    <option value="">Pilih program</option>
                    <option value="Sinetron">Sinetron</option>
                    <option value="Reality Show">Reality Show</option>
                    <option value="Variety Show">Variety Show</option>
                    <option value="Infotainment">Infotainment</option>
                    <option value="Sports Program">Sports Program</option>
                    <option value="News Program">News Program</option>
                    <option value="Drama">Drama</option>
                    <option value="Game Show">Game Show</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Tipe Sponsorship
                  </label>
                  <select
                    value={formData.sponsorship_type}
                    onChange={(e) => handleInputChange('sponsorship_type', e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: formData.sponsorship_type ? '#0f172a' : '#94a3b8'
                    }}
                  >
                    <option value="">Pilih tipe</option>
                    <option value="Segment Sponsor">Segment Sponsor</option>
                    <option value="Title Sponsor">Title Sponsor</option>
                    <option value="Official Sponsor">Official Sponsor</option>
                    <option value="Co-Sponsor">Co-Sponsor</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Target Audiens
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Perempuan 20-45 tahun"
                    value={formData.target_audience}
                    onChange={(e) => handleInputChange('target_audience', e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Objective
                  </label>
                  <textarea
                    placeholder="Tujuan campaign"
                    value={formData.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Budget Range
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 500 juta - 1 Miliar"
                    value={formData.budget_range}
                    onChange={(e) => handleInputChange('budget_range', e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px', display: 'block' }}>
                    Notes
                  </label>
                  <textarea
                    placeholder="Catatan tambahan"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  <Save size={14} style={{ marginRight: '6px' }} />
                  Simpan Draft
                </Button>
                <Button
                  onClick={handleSubmitBrief}
                  disabled={isSubmitting || !formData.brand_name || !formData.pic_sales}
                  style={{ flex: 1, backgroundColor: '#2563eb' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Send size={14} style={{ marginRight: '6px' }} />
                      Submit Brief
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
