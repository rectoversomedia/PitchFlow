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
  Users,
  User,
  Target,
  TrendingUp,
  Heart,
  ShoppingCart,
  Smartphone,
  Tv,
  Radio,
  MessageCircle,
  Play,
  Video,
  Globe,
  Download
} from "lucide-react"

interface AudienceSegment {
  name: string
  percentage: number
  ageRange: string
  gender: string
  interests: string[]
}

interface MediaConsumption {
  platform: string
  percentage: number
  icon: React.ReactNode
  dailyHours: string
}

export default function AudienceInsights() {
  const [loading, setLoading] = useState(false)
  const [brandName, setBrandName] = useState("")
  const [targetAge, setTargetAge] = useState("")
  const [targetGender, setTargetGender] = useState("")
  const [location, setLocation] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const [quickBrand, setQuickBrand] = useState("")
  const [quickResult, setQuickResult] = useState<string | null>(null)

  const analyzeAudience = async () => {
    if (!brandName) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'audienceInsights',
          params: {
            brandName,
            targetAge: targetAge || "18-45",
            targetGender: targetGender || "All",
            location: location || "Indonesia"
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setResult(data.data)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickAnalyze = async () => {
    if (!quickBrand) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'audienceInsights',
          params: {
            brandName: quickBrand,
            targetAge: "18-45",
            targetGender: "All",
            location: "Indonesia"
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setQuickResult(data.data)
      }
    } catch (error) {
      console.error('Quick analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for demo
  const mockSegments: AudienceSegment[] = [
    {
      name: "Young Professionals",
      percentage: 35,
      ageRange: "25-35",
      gender: "All",
      interests: ["Career", "Technology", "Lifestyle"]
    },
    {
      name: "Digital Natives",
      percentage: 28,
      ageRange: "18-24",
      gender: "All",
      interests: ["Social Media", "Gaming", "Entertainment"]
    },
    {
      name: "Family Builders",
      percentage: 22,
      ageRange: "30-45",
      gender: "All",
      interests: ["Family", "Home", "Education"]
    },
    {
      name: "Mature Segment",
      percentage: 15,
      ageRange: "45-60",
      gender: "All",
      interests: ["Health", "Finance", "Travel"]
    }
  ]

  const mockMediaConsumption: MediaConsumption[] = [
    { platform: "YouTube", percentage: 85, icon: <Play className="w-5 h-5 text-red-500" />, dailyHours: "2.5 hrs" },
    { platform: "Instagram", percentage: 78, icon: <MessageCircle className="w-5 h-5 text-pink-500" />, dailyHours: "2.0 hrs" },
    { platform: "TikTok", percentage: 72, icon: <Video className="w-5 h-5 text-black" />, dailyHours: "1.8 hrs" },
    { platform: "TV", percentage: 65, icon: <Tv className="w-5 h-5 text-blue-500" />, dailyHours: "3.0 hrs" },
    { platform: "Facebook", percentage: 58, icon: <Globe className="w-5 h-5 text-blue-600" />, dailyHours: "1.2 hrs" },
    { platform: "Podcast", percentage: 35, icon: <Radio className="w-5 h-5 text-orange-500" />, dailyHours: "0.8 hrs" },
  ]

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold">Audience Insights</h1>
            <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
              <Target className="w-3 h-3 mr-1" /> AI-Powered
            </Badge>
          </div>
          <p className="text-slate-600">
            Deep audience analysis untuk target market yang lebih tepat
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Insights
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center gap-2">
              <Target className="w-4 h-4" /> Segments
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Tv className="w-4 h-4" /> Media
            </TabsTrigger>
            <TabsTrigger value="psychographics" className="flex items-center gap-2">
              <Heart className="w-4 h-4" /> Psychographics
            </TabsTrigger>
          </TabsList>

          {/* INSIGHTS TAB */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-500" />
                    Audience Analysis
                  </CardTitle>
                  <CardDescription>
                    Generate deep audience insights dengan AI
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Target Age</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        value={targetAge}
                        onChange={(e) => setTargetAge(e.target.value)}
                      >
                        <option value="">Pilih age</option>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45-54">45-54</option>
                        <option value="55+">55+</option>
                      </select>
                    </div>
                    <div>
                      <Label>Target Gender</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        value={targetGender}
                        onChange={(e) => setTargetGender(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      placeholder="Contoh: Jakarta, Indonesia"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={analyzeAudience}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                    disabled={loading || !brandName}
                  >
                    {loading ? <LoadingPage /> : null}
                    <Target className="w-4 h-4 mr-2" />
                    Analyze Audience
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {result && (
                <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-cyan-700">
                        Audience Report
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" /> Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">
                      {result}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Analyze */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Quick Audience Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Brand name"
                      value={quickBrand}
                      onChange={(e) => setQuickBrand(e.target.value)}
                    />
                  </div>
                  <Button onClick={quickAnalyze} variant="outline">
                    Quick Analyze
                  </Button>
                </div>
                {quickResult && (
                  <Card className="mt-4 bg-green-50 border-green-200">
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

          {/* SEGMENTS TAB */}
          <TabsContent value="segments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Segments</CardTitle>
                <CardDescription>
                  Breakdown demografis audience berdasarkan data pasar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSegments.map((segment) => (
                    <div key={segment.name} className="p-4 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{segment.name}</h4>
                          <p className="text-sm text-slate-500">
                            Age: {segment.ageRange} • {segment.gender}
                          </p>
                        </div>
                        <Badge className="bg-cyan-100 text-cyan-700">
                          {segment.percentage}%
                        </Badge>
                      </div>
                      <Progress value={segment.percentage} className="h-2" />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {segment.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MEDIA TAB */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Consumption</CardTitle>
                <CardDescription>
                  Platform mana yang audience gunakan setiap hari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMediaConsumption.map((media) => (
                    <div key={media.platform} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {media.icon}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{media.platform}</span>
                            <span className="text-sm text-slate-500">{media.dailyHours}/day</span>
                          </div>
                          <Progress value={media.percentage} className="h-2" />
                        </div>
                      </div>
                      <Badge className="bg-cyan-100 text-cyan-700">
                        {media.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PSYCHOGRAPHICS TAB */}
          <TabsContent value="psychographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Psychographic Profile</CardTitle>
                <CardDescription>
                  Mindset, values, dan behavior patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Psychographic analysis available after audience input</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
