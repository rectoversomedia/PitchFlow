"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { libraryProposals as mockLibraryProposals, statusLabels } from "@/lib/mock-data"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  DollarSign,
  Clock,
  Award,
  Users,
  Building,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  RefreshCw,
  ChevronRight,
  Layers,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"

const kpiCards = [
  { title: "Total Pipeline", value: "Rp 24.5M", change: "+12%", trend: "up", icon: DollarSign, color: "#16a34a", bgColor: "#dcfce7", borderColor: "#86efac" },
  { title: "Win Rate", value: "61%", change: "+5%", trend: "up", icon: Award, color: "#9333ea", bgColor: "#f3e8ff", borderColor: "#c4b5fd" },
  { title: "Avg. Conversion", value: "14 hari", change: "-2 hari", trend: "up", icon: Clock, color: "#2563eb", bgColor: "#eff6ff", borderColor: "#93c5fd" },
  { title: "Active Clients", value: "24", change: "+3", trend: "up", icon: Building, color: "#2563eb", bgColor: "#fef2f2", borderColor: "#fecaca" },
]

const programPerformance = [
  { program: "Sinetron", total: 8, won: 5, pitched: 2, lost: 1, revenue: "Rp 8.2M" },
  { program: "Reality Show", total: 6, won: 4, pitched: 1, lost: 1, revenue: "Rp 6.5M" },
  { program: "Variety Show", total: 4, won: 2, pitched: 1, lost: 1, revenue: "Rp 4.8M" },
  { program: "Infotainment", total: 3, won: 1, pitched: 1, lost: 1, revenue: "Rp 3.2M" },
  { program: "Sports Program", total: 2, won: 1, pitched: 1, lost: 0, revenue: "Rp 2.8M" },
]

const monthlyData = [
  { month: "Jan", proposals: 12, revenue: 2.1 },
  { month: "Feb", proposals: 15, revenue: 2.8 },
  { month: "Mar", proposals: 18, revenue: 3.2 },
  { month: "Apr", proposals: 14, revenue: 2.5 },
  { month: "Mei", proposals: 22, revenue: 4.1 },
  { month: "Jun", proposals: 19, revenue: 3.8 },
]

const brandPerformance = [
  { brand: "Wardah", winRate: 75, avgDeal: "Rp 1.2M", proposals: 5 },
  { brand: "OPPO", winRate: 68, avgDeal: "Rp 950K", proposals: 4 },
  { brand: "Indomie", winRate: 72, avgDeal: "Rp 1.1M", proposals: 3 },
  { brand: "Shopee", winRate: 82, avgDeal: "Rp 1.8M", proposals: 2 },
  { brand: "Honda", winRate: 65, avgDeal: "Rp 1.5M", proposals: 3 },
]

const recentActivity = [
  { type: "won", title: "Wardah - Ramadan Campaign", detail: "Rp 1.2M - Sinetron Ramadan", time: "Hari ini" },
  { type: "new", title: "Telkomsel - Halo+", detail: "Brief baru dari Andi", time: "2 jam lalu" },
  { type: "pitched", title: "Aqua - 100% Murni", detail: "Pitched ke client", time: "Kemarin" },
  { type: "won", title: "Shopee - 6.6 Big Sale", detail: "Rp 1.8M - Variety Show", time: "Kemarin" },
]

export default function AnalyticsPage() {
  const { userType, isLoading: isAuthLoading } = useAuth()
  const [dateRange, setDateRange] = useState("6bulan")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realData, setRealData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real data for existing users
  useEffect(() => {
    if (userType === 'existing') {
      async function fetchData() {
        try {
          const [briefsRes, proposalsRes] = await Promise.all([
            fetch('/api/briefs'),
            fetch('/api/proposals')
          ])
          const briefsData = await briefsRes.json()
          const proposalsData = await proposalsRes.json()
          setRealData({
            briefs: briefsData.data || [],
            proposals: proposalsData.data || []
          })
        } catch (error) {
          console.error('Error fetching analytics data:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    } else {
      setIsLoading(false)
    }
  }, [userType])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  // Show empty state for new users
  if (userType === 'new' || isAuthLoading) {
    return (
      <MainLayout>
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Analytics & Insights</h1>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Pantau performa pipeline sponsorship</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
            <div style={{ textAlign: 'center' }}>
              <BarChart3 size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Belum Ada Data</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>Mulai buat brief dan proposal untuk melihat analytics</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Demo mode - show mock data with indicator
  const displayData = userType === 'demo' ? { mock: true } : realData

  const getMaxRevenue = () => Math.max(...monthlyData.map(d => d.revenue))
  const getMaxProposals = () => Math.max(...monthlyData.map(d => d.proposals))

  return (
    <MainLayout>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Analytics & Insights
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Pantau performa pipeline sponsorship dan track pencapaian target
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="1bulan">1 Bulan Terakhir</option>
              <option value="3bulan">3 Bulan Terakhir</option>
              <option value="6bulan">6 Bulan Terakhir</option>
              <option value="1tahun">1 Tahun Terakhir</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', paddingLeft: '14px', paddingRight: '14px' }}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} style={{ marginRight: '8px' }} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button size="sm" style={{ backgroundColor: '#2563eb', paddingLeft: '14px', paddingRight: '14px' }}>
              <Download size={16} style={{ marginRight: '8px' }} />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {kpiCards.map((kpi, index) => {
            const IconComponent = kpi.icon
            return (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${kpi.bgColor}, white)`,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `2px solid ${kpi.borderColor}`,
                  boxShadow: `0 4px 15px ${kpi.borderColor}30`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{kpi.title}</p>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: kpi.color, marginTop: '8px', letterSpacing: '-1px' }}>{kpi.value}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight size={14} color="#16a34a" />
                      ) : (
                        <ArrowDownRight size={14} color="#2563eb" />
                      )}
                      <span style={{ fontSize: '12px', color: kpi.trend === 'up' ? '#16a34a' : '#2563eb', fontWeight: 600 }}>{kpi.change}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>vs last period</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    boxShadow: `0 2px 8px ${kpi.borderColor}50`
                  }}>
                    <IconComponent size={22} color={kpi.color} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Revenue Chart */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Revenue & Proposals Trend</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Perbandingan revenue dan jumlah proposal per bulan</p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Revenue (Rp M)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Proposals</span>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
              {monthlyData.map((data, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '160px' }}>
                    {/* Revenue Bar */}
                    <div
                      style={{
                        width: '20px',
                        height: `${(data.revenue / getMaxRevenue()) * 120}px`,
                        backgroundColor: '#2563eb',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                    {/* Proposals Bar */}
                    <div
                      style={{
                        width: '20px',
                        height: `${(data.proposals / getMaxProposals()) * 80}px`,
                        backgroundColor: '#2563eb',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{data.month}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>Rp 18.5M</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Total Revenue YTD</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>100</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Total Proposals</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>61%</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Win Rate</p>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #fafafa)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Conversion Funnel</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>Alur konversi brief ke winning</p>

            {[
              { stage: "Brief Masuk", count: 100, percent: 100, color: "#2563eb" },
              { stage: "Proposal Dibuat", count: 85, percent: 85, color: "#9333ea" },
              { stage: "Pitched ke Client", count: 52, percent: 52, color: "#d97706" },
              { stage: "Negosiasi", count: 32, percent: 32, color: "#2563eb" },
              { stage: "Won", count: 22, percent: 22, color: "#16a34a" },
            ].map((item, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{item.stage}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>{item.count}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percent}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
            ))}

            <div style={{
              padding: '12px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Target size={16} color="#16a34a" />
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 500 }}>Target Win Rate: 65% • Current: 61%</span>
            </div>
          </div>
        </div>

        {/* Performance Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Program Performance */}
          <div style={{
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '10px' }}>
                  <Layers size={18} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Performa per Program</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>Win rate dan revenue per tipe program</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Program</th>
                    <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Total</th>
                    <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Won</th>
                    <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Win Rate</th>
                    <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {programPerformance.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{row.program}</td>
                      <td style={{ padding: '12px', fontSize: '12px', textAlign: 'center', color: '#64748b' }}>{row.total}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: '#dcfce7',
                          color: '#16a34a',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {row.won}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#16a34a'
                        }}>
                          <TrendingUp size={12} />
                          {Math.round((row.won / row.total) * 100)}%
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Brand Performance */}
          <div style={{
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#2563eb', borderRadius: '10px' }}>
                  <Award size={18} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Top Brand Performance</h3>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>Brand dengan win rate dan deal tertinggi</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px' }}>
              {brandPerformance.map((brand, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: index === 0 ? '#fef2f2' : index === 1 ? '#fff7ed' : index === 2 ? '#fef3c7' : 'transparent',
                    borderRadius: '10px',
                    marginBottom: '8px'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: index === 0 ? '#2563eb' : index === 1 ? '#d97706' : index === 2 ? '#ca8a04' : '#94a3b8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{brand.brand}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>{brand.proposals} proposals</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a' }}>{brand.winRate}%</p>
                    <p style={{ fontSize: '10px', color: '#94a3b8' }}>{brand.avgDeal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#9333ea', borderRadius: '10px' }}>
                <Clock size={18} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Aktivitas Terbaru</h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Update pipeline terbaru</p>
              </div>
            </div>
            <Link href="/dashboard" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Lihat Semua
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '20px' }}>
            {recentActivity.map((activity, index) => (
              <Link
                key={index}
                href="/proposal-builder"
                style={{
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: activity.type === 'won' ? '#dcfce7' : activity.type === 'pitched' ? '#eff6ff' : '#fef3c7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {activity.type === 'won' ? (
                      <CheckCircle size={14} color="#16a34a" />
                    ) : activity.type === 'pitched' ? (
                      <Target size={14} color="#2563eb" />
                    ) : (
                      <AlertCircle size={14} color="#d97706" />
                    )}
                  </div>
                  <Badge
                    variant={
                      activity.type === 'won' ? 'green' :
                      activity.type === 'pitched' ? 'blue' : 'amber'
                    }
                    style={{ fontSize: '9px', padding: '2px 6px' }}
                  >
                    {activity.type === 'won' ? 'Won' : activity.type === 'pitched' ? 'Pitched' : 'New'}
                  </Badge>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{activity.title}</h4>
                <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>{activity.detail}</p>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{activity.time}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </MainLayout>
  )
}
