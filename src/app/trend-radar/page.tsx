"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingPage } from "@/components/ui/loading"
import {
  TrendingUp,
  Flame,
  Star,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  BarChart3,
  PieChart,
  Clock,
  Zap
} from "lucide-react"

interface Trend {
  id: string
  title: string
  category: string
  trend: "up" | "down" | "stable"
  growth: string
  description: string
  brands: string[]
  example?: string
}

const mockTrends: Trend[] = [
  {
    id: "1",
    title: "Micro-Influencer Marketing",
    category: "Marketing",
    trend: "up",
    growth: "+45%",
    description: "Brand lebih memilih micro-influencer dengan followers 10K-100K untuk reach yang lebih engaged",
    brands: ["Sociolla", "Wardah", "Gojek"],
    example: "Wardah collab dengan beauty blogger 50K followers"
  },
  {
    id: "2",
    title: "Live Commerce",
    category: "E-Commerce",
    trend: "up",
    growth: "+120%",
    description: "Live streaming shopping experience dengan interactive features",
    brands: ["Shopee", "Tokopedia", "Blibli"],
    example: "Shopee Live dengan artis dan flash sale"
  },
  {
    id: "3",
    title: "Health & Wellness",
    category: "Lifestyle",
    trend: "up",
    growth: "+35%",
    description: "Brand kesehatan dan wellness makin agresif sponsor program kesehatan",
    brands: ["Greenfields", "Bear Brand", "Frisian Flag"],
    example: "Bear Brand sponsorship podcast kesehatan"
  },
  {
    id: "4",
    title: "Gaming & Esports",
    category: "Entertainment",
    trend: "up",
    growth: "+89%",
    description: "Esports tournament dan gaming content makin menarik brand sponsor",
    brands: ["Red Bull", "ASUS ROG", "Monster Energy"],
    example: "ASUS ROG sponsorship MLBB tournament"
  },
  {
    id: "5",
    title: "Sinetron Ramadan",
    category: "Broadcasting",
    trend: "stable",
    growth: "+5%",
    description: "Sinetron Ramadan tetap menjadi prime time untuk brand activation",
    brands: ["OPPO", "Samsung", "Indomie"],
    example: "OPPO product placement di sinetron RCTI"
  },
  {
    id: "6",
    title: "Podcast Sponsorship",
    category: "Audio",
    trend: "up",
    growth: "+67%",
    description: "Brand mulai realize potensi podcast untuk target demographic spesifik",
    brands: ["Spotify", "Grab", "Telkomsel"],
    example: "Grab sponsorship di podcast Cerita Distori"
  }
]

const hotCategories = [
  { name: "Technology", change: "+45%", icon: Zap },
  { name: "Beauty & Personal Care", change: "+38%", icon: Star },
  { name: "FMCG", change: "+25%", icon: TrendingUp },
  { name: "Automotive", change: "+18%", icon: Target },
  { name: "Fintech", change: "+52%", icon: BarChart3 },
  { name: "Gaming", change: "+89%", icon: Flame },
]

export default function TrendRadar() {
  const [loading, setLoading] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [trends, setTrends] = useState<Trend[]>(mockTrends)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(2026)

  const industries = ["all", "Marketing", "E-Commerce", "Lifestyle", "Entertainment", "Broadcasting", "Audio", "Technology"]

  const filteredTrends = trends.filter(trend => {
    const matchesIndustry = selectedIndustry === "all" || trend.category === selectedIndustry
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesIndustry && matchesSearch
  })

  const analyzeTrends = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trendAnalysis',
          params: {
            industry: selectedIndustry === "all" ? "Semua Industri" : selectedIndustry,
            year: selectedYear
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setAnalysisResult(data.data)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case "down":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-slate-400" />
    }
  }

  const getTrendBadge = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Trending Up</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Trending Down</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-600">Stable</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold">Trend Radar</h1>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Flame className="w-3 h-3 mr-1" /> Real-time
            </Badge>
          </div>
          <p className="text-slate-600">
            Track tren sponsorship dan media terbaru di Indonesia
          </p>
        </div>

        {/* Hot Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Hot Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hotCategories.map((cat) => (
              <Card key={cat.name} className="hover:shadow-md transition-shadow cursor-pointer hover:border-orange-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <cat.icon className="w-5 h-5 text-orange-500" />
                    <span className="text-green-600 text-sm font-semibold">{cat.change}</span>
                  </div>
                  <p className="text-sm font-medium">{cat.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Trends
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> AI Analysis
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Calendar
            </TabsTrigger>
          </TabsList>

          {/* TRENDS TAB */}
          <TabsContent value="trends" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <Label>Search</Label>
                    <Input
                      placeholder="Cari trend..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-[200px]">
                    <Label>Industry</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind === "all" ? "Semua Industry" : ind}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button variant="outline" onClick={() => setTrends([...mockTrends])}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trends List */}
            <div className="space-y-4">
              {filteredTrends.map((trend) => (
                <Card key={trend.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{trend.title}</h3>
                          {getTrendBadge(trend.trend)}
                          <Badge variant="outline">{trend.category}</Badge>
                        </div>
                        <p className="text-slate-600 mb-3">{trend.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {trend.brands.map((brand) => (
                            <Badge key={brand} variant="secondary">{brand}</Badge>
                          ))}
                        </div>
                        {trend.example && (
                          <p className="text-sm text-slate-500 italic">
                            Example: {trend.example}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xl">
                          {getTrendIcon(trend.trend)}
                          {trend.growth}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">vs last year</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI ANALYSIS TAB */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  AI Trend Analysis
                </CardTitle>
                <CardDescription>
                  Generate deep trend analysis dengan AI untuk industri spesifik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label>Industry</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                    >
                      {industries.filter(i => i !== "all").map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      <option value={2026}>2026</option>
                      <option value={2025}>2025</option>
                      <option value={2024}>2024</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={analyzeTrends}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading || selectedIndustry === "all"}
                >
                  {loading ? (
                    <>
                      <LoadingPage />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Trend Analysis
                    </>
                  )}
                </Button>

                {analysisResult && (
                  <Card className="mt-6 bg-purple-50 border-purple-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-purple-700">
                          Trend Analysis Report
                        </h4>
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">
                        {analysisResult}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CALENDAR TAB */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Event Calendar
                </CardTitle>
                <CardDescription>
                  Calendar event sponsorship opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Event Calendar Coming Soon</p>
                  <p className="text-sm mt-2">
                    Track event dates, deadlines, dan sponsorship windows
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
