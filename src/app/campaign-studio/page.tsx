"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { LoadingPage } from "@/components/ui/loading"
import {
  Sparkles,
  Video,
  ImageIcon,
  FileText,
  Calendar,
  Palette,
  Music,
  Mic,
  Copy,
  Download,
  Share2,
  Wand2,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Send
} from "lucide-react"

interface GeneratedContent {
  id: string
  type: "script" | "storyboard" | "social" | "package"
  title: string
  content: string
  createdAt: Date
}

export default function CampaignStudio() {
  const [loading, setLoading] = useState(false)
  const [activeTool, setActiveTool] = useState("package")

  // Package Designer State
  const [pkgBrand, setPkgBrand] = useState("")
  const [pkgProgram, setPkgProgram] = useState("")
  const [pkgObjective, setPkgObjective] = useState("")
  const [pkgBudget, setPkgBudget] = useState("")
  const [pkgPackage, setPkgPackage] = useState<string | null>(null)

  // Script Writer State
  const [scriptBrand, setScriptBrand] = useState("")
  const [scriptProgram, setScriptProgram] = useState("")
  const [scriptConcept, setScriptConcept] = useState("")
  const [scriptDuration, setScriptDuration] = useState("60")
  const [generatedScript, setGeneratedScript] = useState<string | null>(null)

  // Storyboard State
  const [storyboardBrand, setStoryboardBrand] = useState("")
  const [storyboardConcept, setStoryboardConcept] = useState("")
  const [generatedStoryboard, setGeneratedStoryboard] = useState<string | null>(null)

  // Social Post State
  const [socialBrand, setSocialBrand] = useState("")
  const [socialContent, setSocialContent] = useState("")
  const [socialPlatform, setSocialPlatform] = useState("instagram")
  const [generatedSocial, setGeneratedSocial] = useState<string | null>(null)

  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([])

  const packageOptions = [
    {
      id: "bronze",
      name: "Bronze Package",
      price: "50-100 juta",
      deliverables: ["Logo placement", "Brand mention", "1 social post"],
      color: "amber"
    },
    {
      id: "silver",
      name: "Silver Package",
      price: "100-250 juta",
      deliverables: ["Segment integration", "Product demo", "5 social posts", "PR mentions"],
      color: "slate"
    },
    {
      id: "gold",
      name: "Gold Package",
      price: "250-500 juta",
      deliverables: ["Full episode integration", "Custom segment", "10 social posts", "Event activation", "Co-branded content"],
      color: "yellow"
    },
    {
      id: "platinum",
      name: "Platinum Package",
      price: "500 juta +",
      deliverables: ["Title sponsorship", "Full production", "Digital extension", "Event rights", "Year-round activation"],
      color: "purple"
    }
  ]

  const generateScript = async () => {
    if (!scriptBrand || !scriptProgram) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateProposal',
          params: {
            brandName: scriptBrand,
            programName: scriptProgram,
            objective: scriptConcept || "Brand awareness",
            keyMessages: ["Quality", "Innovation", "Trust"],
            budget: pkgBudget || "Flexible"
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedScript(data.data)
        setGeneratedContents(prev => [...prev, {
          id: Date.now().toString(),
          type: "script",
          title: `Script - ${scriptBrand}`,
          content: data.data,
          createdAt: new Date()
        }])
      }
    } catch (error) {
      console.error('Script generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateStoryboard = async () => {
    if (!storyboardBrand || !storyboardConcept) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateImagePrompt',
          params: {
            brandName: storyboardBrand,
            concept: storyboardConcept
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedStoryboard(data.data)
        setGeneratedContents(prev => [...prev, {
          id: Date.now().toString(),
          type: "storyboard",
          title: `Storyboard - ${storyboardBrand}`,
          content: data.data,
          createdAt: new Date()
        }])
      }
    } catch (error) {
      console.error('Storyboard generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSocialPost = async () => {
    if (!socialBrand || !socialContent) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improveText',
          params: {
            text: `Create social media content for ${socialBrand}: ${socialContent}`
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedSocial(data.data)
        setGeneratedContents(prev => [...prev, {
          id: Date.now().toString(),
          type: "social",
          title: `Social Post - ${socialBrand}`,
          content: data.data,
          createdAt: new Date()
        }])
      }
    } catch (error) {
      console.error('Social generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
            <h1 className="text-3xl font-bold">Campaign Studio</h1>
            <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
              <Wand2 className="w-3 h-3 mr-1" /> AI-Powered
            </Badge>
          </div>
          <p className="text-slate-600">
            Generate sponsorship packages, scripts, storyboards, dan content dengan AI
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTool} onValueChange={setActiveTool} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="package" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Package
            </TabsTrigger>
            <TabsTrigger value="script" className="flex items-center gap-2">
              <Video className="w-4 h-4" /> Script
            </TabsTrigger>
            <TabsTrigger value="storyboard" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Storyboard
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Social
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> History
            </TabsTrigger>
          </TabsList>

          {/* PACKAGE DESIGNER */}
          <TabsContent value="package" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Sponsorship Package Designer
                  </CardTitle>
                  <CardDescription>
                    Design paket sponsorship dengan deliverable yang menarik
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Brand Name</Label>
                    <Input
                      placeholder="Contoh: OPPO"
                      value={pkgBrand}
                      onChange={(e) => setPkgBrand(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program Type</Label>
                    <Input
                      placeholder="Contoh: Sinetron Ramadan"
                      value={pkgProgram}
                      onChange={(e) => setPkgProgram(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Objective</Label>
                    <Input
                      placeholder="Contoh: Increase brand awareness"
                      value={pkgObjective}
                      onChange={(e) => setPkgObjective(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Budget Range</Label>
                    <Input
                      placeholder="Contoh: 100-250 juta"
                      value={pkgBudget}
                      onChange={(e) => setPkgBudget(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Select Package Tier
                </h3>
                {packageOptions.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      pkgPackage === pkg.id ? `border-${pkg.color}-500 ring-2 ring-${pkg.color}-200` : ''
                    }`}
                    onClick={() => setPkgPackage(pkg.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{pkg.name}</h4>
                        <Badge variant="outline">{pkg.price}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pkg.deliverables.map((d) => (
                          <Badge key={d} variant="secondary" className="text-xs">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* SCRIPT WRITER */}
          <TabsContent value="script" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-500" />
                  AI Script Writer
                </CardTitle>
                <CardDescription>
                  Generate sponsorship script dengan AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Brand Name</Label>
                    <Input
                      placeholder="Brand"
                      value={scriptBrand}
                      onChange={(e) => setScriptBrand(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program</Label>
                    <Input
                      placeholder="Program"
                      value={scriptProgram}
                      onChange={(e) => setScriptProgram(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Concept / Key Message</Label>
                  <Textarea
                    placeholder="Describe the sponsorship concept..."
                    value={scriptConcept}
                    onChange={(e) => setScriptConcept(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={scriptDuration}
                    onChange={(e) => setScriptDuration(e.target.value)}
                  />
                </div>

                <Button
                  onClick={generateScript}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading || !scriptBrand || !scriptProgram}
                >
                  {loading ? <LoadingPage /> : null}
                  <Video className="w-4 h-4 mr-2" />
                  Generate Script
                </Button>

                {generatedScript && (
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-red-100 text-red-700">Generated Script</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-1" /> Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Export
                          </Button>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">
                        {generatedScript}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* STORYBOARD */}
          <TabsContent value="storyboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                  AI Storyboard Generator
                </CardTitle>
                <CardDescription>
                  Generate visual storyboard prompts untuk production
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Brand Name</Label>
                    <Input
                      placeholder="Brand"
                      value={storyboardBrand}
                      onChange={(e) => setStoryboardBrand(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Concept</Label>
                    <Input
                      placeholder="Integration concept"
                      value={storyboardConcept}
                      onChange={(e) => setStoryboardConcept(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={generateStoryboard}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !storyboardBrand || !storyboardConcept}
                >
                  {loading ? <LoadingPage /> : null}
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Storyboard Prompts
                </Button>

                {generatedStoryboard && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="whitespace-pre-wrap text-sm">
                        {generatedStoryboard}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SOCIAL CONTENT */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-500" />
                  AI Social Content Generator
                </CardTitle>
                <CardDescription>
                  Generate social media content dan captions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Brand Name</Label>
                  <Input
                    placeholder="Brand"
                    value={socialBrand}
                    onChange={(e) => setSocialBrand(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Content Brief</Label>
                  <Textarea
                    placeholder="Describe the content you want to create..."
                    value={socialContent}
                    onChange={(e) => setSocialContent(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Platform</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["instagram", "twitter", "tiktok", "facebook", "linkedin"].map((p) => (
                      <Badge
                        key={p}
                        variant={socialPlatform === p ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => setSocialPlatform(p)}
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateSocialPost}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading || !socialBrand || !socialContent}
                >
                  {loading ? <LoadingPage /> : null}
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>

                {generatedSocial && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="whitespace-pre-wrap text-sm">
                        {generatedSocial}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* HISTORY */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500" />
                  Generated Content History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedContents.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No content generated yet</p>
                    <p className="text-sm mt-2">
                      Generated scripts, storyboards, dan packages akan muncul di sini
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedContents.map((content) => (
                      <div key={content.id} className="p-4 border rounded-lg hover:bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {content.type}
                            </Badge>
                            <span className="font-medium">{content.title}</span>
                          </div>
                          <span className="text-sm text-slate-500">
                            {content.createdAt.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {content.content.substring(0, 200)}...
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-1" /> Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Export
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
