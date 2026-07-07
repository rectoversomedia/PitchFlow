import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { rateLimit, getRateLimitResponse, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// Claude API call helper
async function callClaude(messages: any[], maxTokens: number = 4000) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: messages.map(m => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: m.content
      }))
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API Error: ${error}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .trim()
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    // Check API key
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

    // Rate limiting using user ID (more accurate than IP for logged-in users)
    const identifier = authUser.id || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimitResult = rateLimit(identifier, RATE_LIMITS.ai)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const body = await request.json()
    const { action, params } = body

    // Validate action
    const validActions = [
      'brandDNA',
      'analyzeBrand',
      'generateIdeas',
      'generateProposal',
      'searchReference',
      'improveText',
      'trendAnalysis',
      'audienceInsights',
      'calculateROI'
    ]

    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Valid actions: ${validActions.join(', ')}` },
        { status: 400 }
      )
    }

    let result: string

    // Route to appropriate AI function with sanitized params
    switch (action) {
      case 'brandDNA':
        result = await handleBrandDNA({
          brandName: sanitizeInput(params.brandName || ''),
          industry: sanitizeInput(params.industry || ''),
          competitorBrands: (params.competitorBrands || []).map((b: string) => sanitizeInput(b))
        })
        break
      case 'analyzeBrand':
        result = await handleAnalyzeBrand({
          brandName: sanitizeInput(params.brandName || ''),
          industry: sanitizeInput(params.industry || '')
        })
        break
      case 'generateIdeas':
        result = await handleGenerateIdeas({
          brandName: sanitizeInput(params.brandName || ''),
          industry: sanitizeInput(params.industry || ''),
          programType: sanitizeInput(params.programType || ''),
          targetAudience: params.targetAudience ? sanitizeInput(params.targetAudience) : undefined,
          budget: params.budget ? sanitizeInput(params.budget) : undefined
        })
        break
      case 'generateProposal':
        result = await handleGenerateProposal({
          brandName: sanitizeInput(params.brandName || ''),
          programName: sanitizeInput(params.programName || ''),
          objective: sanitizeInput(params.objective || ''),
          keyMessages: (params.keyMessages || []).map((m: string) => sanitizeInput(m)),
          budget: params.budget ? sanitizeInput(params.budget) : undefined
        })
        break
      case 'searchReference':
        result = await handleSearchReference({
          topic: sanitizeInput(params.topic || ''),
          industry: params.industry ? sanitizeInput(params.industry) : undefined
        })
        break
      case 'improveText':
        result = await handleImproveText({
          text: sanitizeInput(params.text || ''),
          type: params.type ? sanitizeInput(params.type) : undefined
        })
        break
      case 'trendAnalysis':
        result = await handleTrendAnalysis({
          industry: params.industry ? sanitizeInput(params.industry) : undefined,
          category: params.category ? sanitizeInput(params.category) : undefined
        })
        break
      case 'audienceInsights':
        result = await handleAudienceInsights({
          industry: params.industry ? sanitizeInput(params.industry) : undefined,
          demographic: params.demographic ? sanitizeInput(params.demographic) : undefined
        })
        break
      case 'calculateROI':
        result = await handleCalculateROI({
          budget: sanitizeInput(params.budget || ''),
          program: sanitizeInput(params.program || ''),
          expectedReach: params.expectedReach ? sanitizeInput(params.expectedReach) : undefined,
          duration: params.duration ? sanitizeInput(params.duration) : undefined
        })
        break
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    const headers = getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetAt)

    return NextResponse.json(
      { success: true, data: result },
      { headers }
    )
  } catch (error: any) {
    console.error('AI API route error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

// ==================== AI HANDLERS ====================

async function handleBrandDNA(params: { brandName: string; industry: string; competitorBrands?: string[] }) {
  const { brandName, industry, competitorBrands } = params
  const competitors = competitorBrands?.length ? `\nCompetitor Brands: ${competitorBrands.join(', ')}` : ''

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Brand Strategist profesional yang ahli dalam menganalisis brand di pasar Indonesia.
Kamu bisa memberikan insight mendalam tentang positioning, kompetitor, dan strategi yang efektif untuk sponsorship media broadcasting.
Selalu berikan analisis yang actionable dan berbasis data.

Lakukan Deep Brand DNA Analysis untuk brand ${brandName} di industri ${industry}.${competitors}

Sertakan analisis mendalam:
1. **Brand Positioning** - Apa yang membuat brand ini unik?
2. **Brand Personality** - Bagaimana kepribadian brand ini?
3. **Core Values** - Nilai-nilai utama brand
4. **Target Demographics** - Siapa audiens utama?
5. **Brand DNA** - Elemen-elemen esensial yang mendefinisikan brand
6. **Key Competitors** - Siapa kompetitor utama?
7. **Competitive Advantages** - Keunggulan dibanding kompetitor
8. **Sponsorship History** - Rekam jejak sponsorship sebelumnya (jika ada)
9. **Media Consumption** - Where does their audience consume media?
10. **Recommendation** - Saran untuk integrasi sponsorship di media broadcasting

Format jawaban dengan struktur yang rapi, gunakan bullet points dan headers.
Gunakan Bahasa Indonesia yang profesional.`
    }
  ], 4000)
}

async function handleAnalyzeBrand(params: { brandName: string; industry: string }) {
  const { brandName, industry } = params

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Brand Strategist yang ahli dalam menganalisis brand di pasar Indonesia.
Kamu tahu persis dinamika pasar dan consumer behavior di Indonesia.

Buatkan Brand Analysis singkat untuk ${brandName} di industri ${industry} untuk keperluan sponsorship media broadcasting.

Sertakan:
1. Brand Overview - Deskripsi singkat brand
2. Target Audience - Siapa audiens utama?
3. Key Messages - Pesan utama brand
4. Previous Media Activities - Aktivitas media sebelumnya
5. Sponsorship Fit - Kenapa media broadcasting cocok untuk brand ini?

Format jawaban dalam Bahasa Indonesia yang profesional dan concise (maksimal 500 kata).`
    }
  ], 2000)
}

async function handleGenerateIdeas(params: {
  brandName: string
  industry: string
  programType: string
  targetAudience?: string
  budget?: string
}) {
  const { brandName, industry, programType, targetAudience, budget } = params

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Creative Director berpengalaman di industri media broadcasting Indonesia.
Kamu ahli dalam membuat ide integrasi brand yang kreatif, inovatif, engaging, dan sesuai dengan konteks Indonesia.
Selalu berikan ide yang actionable dan bisa langsung diimplementasikan.

Buatkan 5 ide integrasi kreatif untuk brand ${brandName} (${industry})
yang akan menjadi sponsor di program ${programType}.

Target audiens: ${targetAudience || 'Umum'}
Budget: ${budget || 'Flexible'}

Setiap ide harus mencakup:
1. **Nama Konsep** - Judul kreatif untuk integrasi ini
2. **Konsep Utama** - Penjelasan singkat ide
3. **Implementasi** - Detail cara implementasi di program
4. **Benefit untuk Brand** - Keuntungan yang didapat brand
5. **Estimated Impact** - Dampak yang diharapkan

Format jawaban dalam Bahasa Indonesia dengan struktur yang rapi.
Prioritaskan ide yang unique, engaging, dan feasible untuk diproduksi.`
    }
  ], 3000)
}

async function handleGenerateProposal(params: {
  brandName: string
  programName: string
  objective: string
  keyMessages?: string[]
  budget?: string
}) {
  const { brandName, programName, objective, keyMessages, budget } = params
  const messages = keyMessages?.length ? `\nKey Messages:\n${keyMessages.map((m: string, i: number) => `${i + 1}. ${m}`).join('\n')}` : ''

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah expert dalam membuat proposal sponsorship untuk industri media broadcasting Indonesia.
Kamu tahu persis format dan struktur yang menarik untuk client brand.
Selalu gunakan data dan insight yang relevan untuk Indonesia.
Gunakan Bahasa Indonesia yang profesional dan persuasive.

Buatkan konten proposal sponsorship yang profesional untuk:

**Brand:** ${brandName}
**Program:** ${programName}
**Objective:** ${objective}
${messages}
**Budget:** ${budget || 'To be discussed'}

Konten harus mencakup:
1. **Executive Summary** - Ringkasan singkat proposal
2. **Why This Program** - Alasan kenapa program ini tepat untuk brand
3. **Audience Insight** - Data dan insight tentang audiens program
4. **Integration Concept** - Konsep integrasi yang proposed
5. **Investment Details** - Detail investasi yang dibutuhkan
6. **Timeline** - Timeline implementasi
7. **Call to Action** - Langkah selanjutnya

Buat dalam format yang professional dan persuasive untuk pitch ke client.`
    }
  ], 4000)
}

async function handleSearchReference(params: { topic: string; industry?: string }) {
  const { topic, industry } = params

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Research Analyst yang ahli dalam mencari referensi dan best practices untuk sponsorship dan brand integration di Indonesia.
Kamu selalu memberikan contoh yang spesifik dan actionable.

Cari referensi dan best practices untuk:

**Topik:** ${topic}
**Industri:** ${industry || 'Umum'}

Sertakan:
1. **Successful Campaigns** - Contoh campaign yang sukses (brand spesifik)
2. **Key Learnings** - Pelajaran penting dari campaign tersebut
3. **Latest Trends** - Trend terbaru di bidang ini
4. **Recommended Approach** - Saran pendekatan yang efektif
5. **Do's and Don'ts** - Hal yang sebaiknya dilakukan dan dihindari

Gunakan contoh yang spesifik dari brand-brand terkenal di Indonesia.
Format jawaban dalam Bahasa Indonesia.`
    }
  ], 3000)
}

async function handleImproveText(params: { text: string; type?: string }) {
  const { text, type } = params

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Proposal Writer profesional yang ahli dalam membuat proposal sponsorship yang persuasive.
Kamu akan improve teks yang sudah ada agar lebih compelling, profesional, dan persuasive.
Pertahankan inti pesan, hanya improve execution.

Improve teks proposal berikut agar lebih professional dan persuasive:

**Type:** ${type || 'Proposal'}
**Original Text:**
${text}

Improve:
1. Bahasa dan struktur kalimat - buat lebih smooth dan professional
2. Key messaging - strengthen pesan utama
3. Call-to-action - buat lebih compelling
4. Overall persuasive power - tingkatkan kemampuan persuasi
5. Formatting - rapikan struktur jika perlu

Return hasil improved text dalam Bahasa Indonesia.`
    }
  ], 2500)
}

async function handleTrendAnalysis(params: { industry?: string; category?: string }) {
  const { industry, category } = params

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Market Research Analyst yang ahli dalam menganalisis tren pasar dan media di Indonesia.
Kamu selalu up-to-date dengan perkembangan terbaru dan bisa memberikan insight yang actionable.

Buatkan Trend Analysis untuk pasar sponsorship media broadcasting Indonesia.

**Industri:** ${industry || 'Umum'}
**Kategori:** ${category || 'Sponsorship'}

Sertakan:
1. **Current Trends** - Tren yang sedang happening sekarang
2. **Emerging Opportunities** - Opportunity baru yang muncul
3. **Audience Behavior Shifts** - Perubahan perilaku audiens
4. **Platform Preferences** - Preferensi platform media
5. **Budget Trends** - Tren budget sponsorship
6. **Success Metrics** - Metrics yang penting untuk diukur
7. **Predictions** - Prediksi untuk 6-12 bulan ke depan
8. **Recommendations** - Saran actionable untuk tim sales

Gunakan data dan contoh spesifik dari pasar Indonesia.
Format jawaban dalam Bahasa Indonesia yang professional.`
    }
  ], 4000)
}

async function handleAudienceInsights(params: { industry?: string; demographic?: string }) {
  const { industry, demographic } = params

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Audience Research Expert yang ahli dalam menganalisis perilaku dan preferensi audiens di Indonesia.
Kamu tahu persis karakteristik berbagai segmen audiens dan bagaimana mereka consuming media.

Buatkan Audience Insights untuk:

**Industri:** ${industry || 'Umum'}
**Demographic:** ${demographic || 'Umum'}

Sertakan:
1. **Demographic Overview** - Gambaran demografis
2. **Media Consumption Habits** - Kebiasaan consuming media
3. **Platform Preferences** - Platform favorit
4. **Content Preferences** - Jenis konten yang disukai
5. **Peak Hours** - Waktu-waktu prime untuk reach
6. **Engagement Patterns** - Pola engagement
7. **Purchase Behavior** - Perilaku purchasing
8. **Brand Touchpoints** - Touchpoints yang efektif
9. **Recommendations** - Saran untuk targeting

Gunakan data yang relevan untuk pasar Indonesia.
Format jawaban dalam Bahasa Indonesia yang professional.`
    }
  ], 4000)
}

async function handleCalculateROI(params: {
  budget: string
  program: string
  expectedReach?: string
  duration?: string
}) {
  const { budget, program, expectedReach, duration } = params

  return callClaude([
    {
      role: 'user',
      content: `Kamu adalah Marketing Analytics Expert yang ahli dalam menghitung ROI dan membuat business case untuk sponsorship.
Kamu tahu standar industri dan best practices dalam mengukur efektivitas sponsorship.

Buatkan ROI Analysis dan Business Case untuk sponsorship proposal:

**Budget:** ${budget}
**Program:** ${program}
**Expected Reach:** ${expectedReach || 'Standard reach untuk program'}
**Duration:** ${duration || 'Standard duration'}

Sertakan:
1. **Investment Summary** - Ringkasan investasi
2. **Expected Reach & Frequency** - Estimasi jangkauan
3. **Cost Per Reach (CPR)** - Kalkulasi CPR
4. **Cost Per Thousand (CPM)** - Kalkulasi CPM
5. **Brand Awareness Lift** - Estimasi peningkatan brand awareness
6. **Engagement Metrics** - Metrics engagement yang bisa diharapkan
7. **Conversion Potential** - Potensi konversi
8. **Competitive Benchmark** - Perbandingan dengan competitor
9. **ROI Projection** - Proyeksi ROI
10. **Key Takeaways** - Poin-poin penting untuk pitch

Gunakan angka-angka yang realistic dan defensible.
Format jawaban dalam Bahasa Indonesia yang professional dan persuasive.`
    }
  ], 4000)
}
