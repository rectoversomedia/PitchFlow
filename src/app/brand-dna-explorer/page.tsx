"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LoadingPage } from "@/components/ui/loading"
import {
  Sparkles,
  Brain,
  TrendingUp,
  Target,
  Users,
  Award,
  ChevronRight,
  Zap,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  Copy,
  Download
} from "lucide-react"

interface BrandInsight {
  category: string
  content: string
  icon: React.ReactNode
}

export default function BrandDNAExplorer() {
  const [loading, setLoading] = useState(false)
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("")
  const [competitorBrands, setCompetitorBrands] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dna")

  // Quick analysis state
  const [quickBrand, setQuickBrand] = useState("")
  const [quickIndustry, setQuickIndustry] = useState("")
  const [quickResult, setQuickResult] = useState<string | null>(null)

  // Creative ideas state
  const [ideaBrand, setIdeaBrand] = useState("")
  const [ideaIndustry, setIdeaIndustry] = useState("")
  const [ideaProgram, setIdeaProgram] = useState("")
  const [ideaAudience, setIdeaAudience] = useState("")
  const [ideaBudget, setIdeaBudget] = useState("")
  const [ideasResult, setIdeasResult] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)

  const analyzeBrand = async () => {
    if (!brandName || !industry) {
      setError("Brand name and industry are required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'brandDNA',
          params: {
            brandName,
            industry,
            competitorBrands: competitorBrands ? competitorBrands.split(',').map(s => s.trim()) : []
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to analyze brand')
    } finally {
      setLoading(false)
    }
  }

  const quickAnalyze = async () => {
    if (!quickBrand || !quickIndustry) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyzeBrand',
          params: { brandName: quickBrand, industry: quickIndustry }
        })
      })

      const data = await response.json()

      if (data.success) {
        setQuickResult(data.data)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to analyze brand')
    } finally {
      setLoading(false)
    }
  }

  const generateIdeas = async () => {
    if (!ideaBrand || !ideaIndustry || !ideaProgram) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateIdeas',
          params: {
            brandName: ideaBrand,
            industry: ideaIndustry,
            programType: ideaProgram,
            targetAudience: ideaAudience,
            budget: ideaBudget
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setIdeasResult(data.data)
      } else {
        setError(data.error || 'Generation failed')
      }
    } catch (err) {
      setError('Failed to generate ideas')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold">Brand DNA Explorer</h1>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Sparkles className="w-3 h-3 mr-1" /> AI-Powered
            </Badge>
          </div>
          <p className="text-slate-600">
            Deep brand analysis dengan AI untuk menemukan insight tersembunyi dan strategi optimal
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dna" className="flex items-center gap-2">
              <Brain className="w-4 h-4" /> Brand DNA
            </TabsTrigger>
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Quick Analyze
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Creative Ideas
            </TabsTrigger>
            <TabsTrigger value="competitor" className="flex items-center gap-2">
              <Target className="w-4 h-4" /> Competitor Watch
            </TabsTrigger>
          </TabsList>

          {/* BRAND DNA TAB */}
          <TabsContent value="dna" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Deep Brand Analysis
                  </CardTitle>
                  <CardDescription>
                    Masukkan detail brand untuk analisis DNA menyeluruh
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="brand">Brand Name</Label>
                    <Input
                      id="brand"
                      placeholder="Contoh: OPPO, Wardah, Indomie"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="Contoh: Technology, Beauty, Food & Beverage"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="competitors">Competitor Brands (Optional)</Label>
                    <Input
                      id="competitors"
                      placeholder="Pisahkan dengan koma: Samsung, Vivo, Xiaomi"
                      value={competitorBrands}
                      onChange={(e) => setCompetitorBrands(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Kosongkan untuk auto-detect competitors
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={analyzeBrand}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading || !brandName || !industry}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Brand DNA
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {result && (
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-purple-700">
                          {brandName} - Brand DNA Report
                        </CardTitle>
                        <CardDescription>
                          Generated with AI • {new Date().toLocaleDateString('id-ID')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(result)}>
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" /> Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {result}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* QUICK ANALYZE TAB */}
          <TabsContent value="quick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Quick Brand Analysis
                </CardTitle>
                <CardDescription>
                  Analisis cepat dalam hitungan detik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label>Brand Name</Label>
                    <Input
                      placeholder="Brand"
                      value={quickBrand}
                      onChange={(e) => setQuickBrand(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Input
                      placeholder="Industry"
                      value={quickIndustry}
                      onChange={(e) => setQuickIndustry(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={quickAnalyze}
                      className="w-full bg-amber-500 hover:bg-amber-600"
                      disabled={!quickBrand || !quickIndustry}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </div>

                {quickResult && (
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-4">
                      <div className="whitespace-pre-wrap text-sm">
                        {quickResult}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CREATIVE IDEAS TAB */}
          <TabsContent value="ideas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  Creative Integration Ideas
                </CardTitle>
                <CardDescription>
                  Generate ide integrasi brand yang kreatif dan innovative
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label>Brand Name</Label>
                    <Input
                      placeholder="Brand"
                      value={ideaBrand}
                      onChange={(e) => setIdeaBrand(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Input
                      placeholder="Industry"
                      value={ideaIndustry}
                      onChange={(e) => setIdeaIndustry(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program Type</Label>
                    <Input
                      placeholder="Contoh: Sinetron, Reality Show, News"
                      value={ideaProgram}
                      onChange={(e) => setIdeaProgram(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Target Audience</Label>
                    <Input
                      placeholder="Contoh: Ibu rumah tangga 25-40 tahun"
                      value={ideaAudience}
                      onChange={(e) => setIdeaAudience(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Budget Range</Label>
                    <Input
                      placeholder="Contoh: 500 juta - 1 Milyar"
                      value={ideaBudget}
                      onChange={(e) => setIdeaBudget(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={generateIdeas}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!ideaBrand || !ideaIndustry || !ideaProgram}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Creative Ideas
                </Button>

                {ideasResult && (
                  <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="whitespace-pre-wrap text-sm">
                        {ideasResult}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPETITOR WATCH TAB */}
          <TabsContent value="competitor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Competitor Watch
                </CardTitle>
                <CardDescription>
                  Track dan analyze competitor sponsorship activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fitur Competitor Watch Coming Soon</p>
                  <p className="text-sm mt-2">
                    Track competitor sponsorships, media presence, dan brand strategies
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Analyzed</p>
                  <p className="text-3xl font-bold">127</p>
                </div>
                <Brain className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Ideas Generated</p>
                  <p className="text-3xl font-bold">456</p>
                </div>
                <Lightbulb className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Win Rate</p>
                  <p className="text-3xl font-bold">78%</p>
                </div>
                <Award className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Brands</p>
                  <p className="text-3xl font-bold">89</p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
