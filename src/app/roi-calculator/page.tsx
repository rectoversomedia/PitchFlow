"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LoadingPage } from "@/components/ui/loading"
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download
} from "lucide-react"

interface ROIResult {
  cpm: number
  cpe: number
  roi: number
  riskLevel: "low" | "medium" | "high"
  justification: string
  recommendation: string
}

export default function ROICalculator() {
  const [loading, setLoading] = useState(false)
  const [brandName, setBrandName] = useState("")
  const [programType, setProgramType] = useState("")
  const [budget, setBudget] = useState("")
  const [duration, setDuration] = useState("")
  const [expectedReach, setExpectedReach] = useState("")
  const [roiResult, setRoiResult] = useState<ROIResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const programTypes = [
    "Sinetron",
    "Reality Show",
    "Variety Show",
    "News Program",
    "Sports Event",
    "Digital Campaign",
    "Podcast",
    "Social Media",
    "Concert"
  ]

  const quickCalculate = () => {
    // Quick calculation based on inputs
    const budgetNum = parseFloat(budget.replace(/[^0-9]/g, '')) || 0
    const reachNum = parseFloat(expectedReach.replace(/[^0-9]/g, '')) || 0

    if (budgetNum && reachNum) {
      const cpm = (budgetNum / reachNum) * 1000
      const estimatedImpressions = reachNum * 30 // Assume 30 days
      const estimatedValue = estimatedImpressions * 0.01 // $0.01 per impression
      const roi = ((estimatedValue - budgetNum) / budgetNum) * 100

      let riskLevel: "low" | "medium" | "high" = "medium"
      if (roi > 50) riskLevel = "low"
      if (roi < 0) riskLevel = "high"

      setRoiResult({
        cpm,
        cpe: cpm / 100,
        roi,
        riskLevel,
        justification: `Based on budget ${budget} and expected reach of ${expectedReach}`,
        recommendation: roi > 30 ? "Highly recommended" : roi > 0 ? "Moderately recommended" : "Not recommended"
      })
    }
  }

  const analyzeROI = async () => {
    if (!brandName || !programType || !budget) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculateROI',
          params: {
            brandName,
            programType,
            budget,
            duration: duration || "3 months",
            expectedReach: expectedReach || "To be determined"
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setAnalysisResult(data.data)
      }
    } catch (error) {
      console.error('ROI analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(1)}B`
    }
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(0)}M`
    }
    if (num >= 1000) {
      return `Rp ${(num / 1000).toFixed(0)}K`
    }
    return `Rp ${num.toFixed(0)}`
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-amber-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-700">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-700">High Risk</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calculator className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold">ROI Calculator</h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <TrendingUp className="w-3 h-3 mr-1" /> AI-Powered
            </Badge>
          </div>
          <p className="text-slate-600">
            Calculate dan analyze sponsorship ROI dengan AI
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Calculator
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> AI Analysis
            </TabsTrigger>
            <TabsTrigger value="benchmark" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" /> Benchmarks
            </TabsTrigger>
          </TabsList>

          {/* CALCULATOR TAB */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Input Details
                  </CardTitle>
                  <CardDescription>
                    Masukkan detail sponsorship untuk calculate ROI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Brand Name</Label>
                    <Input
                      placeholder="Contoh: OPPO"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Program Type</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={programType}
                      onChange={(e) => setProgramType(e.target.value)}
                    >
                      <option value="">Select program type</option>
                      {programTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Budget (IDR)</Label>
                    <Input
                      placeholder="Contoh: 500.000.000 atau 500M"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Duration</Label>
                    <Input
                      placeholder="Contoh: 3 months"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Expected Reach (views/impressions)</Label>
                    <Input
                      placeholder="Contoh: 10.000.000"
                      value={expectedReach}
                      onChange={(e) => setExpectedReach(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={quickCalculate}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate ROI
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {roiResult && (
                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-emerald-700">ROI Analysis</span>
                      {getRiskBadge(roiResult.riskLevel)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* ROI Score */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            strokeWidth="12"
                            stroke="currentColor"
                            fill="none"
                            className="text-slate-200"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            strokeWidth="12"
                            stroke="currentColor"
                            fill="none"
                            className={getRiskColor(roiResult.riskLevel)}
                            strokeDasharray={`${Math.min(Math.abs(roiResult.roi), 100) * 3.52} 352`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div>
                            <p className={`text-3xl font-bold ${roiResult.roi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {roiResult.roi.toFixed(0)}%
                            </p>
                            <p className="text-xs text-slate-500">ROI</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{roiResult.justification}</p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-slate-500">CPM</span>
                        </div>
                        <p className="text-xl font-bold">{formatCurrency(roiResult.cpm)}</p>
                        <p className="text-xs text-slate-400">per 1000 impressions</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-slate-500">CPE</span>
                        </div>
                        <p className="text-xl font-bold">{formatCurrency(roiResult.cpe)}</p>
                        <p className="text-xs text-slate-400">per engagement</p>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className={`p-4 rounded-lg ${
                      roiResult.roi >= 30 ? 'bg-green-50 border border-green-200' :
                      roiResult.roi >= 0 ? 'bg-amber-50 border border-amber-200' :
                      'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {roiResult.roi >= 30 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : roiResult.roi >= 0 ? (
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-semibold">Recommendation</span>
                      </div>
                      <p className="text-sm">{roiResult.recommendation}</p>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* AI ANALYSIS TAB */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  AI Deep ROI Analysis
                </CardTitle>
                <CardDescription>
                  Get detailed ROI analysis dengan AI-powered insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Brand Name</Label>
                      <Input
                        placeholder="Brand"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Program Type</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        value={programType}
                        onChange={(e) => setProgramType(e.target.value)}
                      >
                        <option value="">Select program</option>
                        {programTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Budget</Label>
                      <Input
                        placeholder="Budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        placeholder="Duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={analyzeROI}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading || !brandName || !programType || !budget}
                  >
                    {loading ? (
                      <>
                        <LoadingPage /> Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate AI Analysis
                      </>
                    )}
                  </Button>

                  {analysisResult && (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-4">
                        <div className="whitespace-pre-wrap text-sm">
                          {analysisResult}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BENCHMARKS TAB */}
          <TabsContent value="benchmark" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-500" />
                  Industry Benchmarks
                </CardTitle>
                <CardDescription>
                  Average CPM dan ROI by industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { industry: "Technology", avgCPM: "Rp 45.000", avgROI: "35%", potential: "High" },
                    { industry: "Beauty & Personal Care", avgCPM: "Rp 38.000", avgROI: "42%", potential: "Very High" },
                    { industry: "FMCG", avgCPM: "Rp 25.000", avgROI: "28%", potential: "Medium" },
                    { industry: "Automotive", avgCPM: "Rp 55.000", avgROI: "45%", potential: "High" },
                    { industry: "Fintech", avgCPM: "Rp 65.000", avgROI: "52%", potential: "Very High" },
                    { industry: "Food & Beverage", avgCPM: "Rp 30.000", avgROI: "32%", potential: "Medium" },
                  ].map((benchmark) => (
                    <div key={benchmark.industry} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                      <div>
                        <p className="font-medium">{benchmark.industry}</p>
                        <p className="text-sm text-slate-500">Avg CPM: {benchmark.avgCPM}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={benchmark.potential === "Very High" ? "bg-green-100 text-green-700" :
                          benchmark.potential === "High" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-600"}>
                          {benchmark.avgROI} ROI
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">{benchmark.potential} Potential</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
