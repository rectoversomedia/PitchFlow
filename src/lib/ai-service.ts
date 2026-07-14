/**
 * Unified AI Service for PitchFlow
 * Uses Claude API for all text generation
 * Supports optional DALL-E for image generation
 */

import Anthropic from '@anthropic-ai/sdk'

// ============================================
// Client Initialization
// ============================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ============================================
// Configuration
// ============================================

const DEFAULT_MODEL = 'claude-sonnet-4-20250514'
const DEFAULT_MAX_TOKENS = 4096
const DEFAULT_TEMPERATURE = 0.7

// ============================================
// Message Types
// ============================================

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIResponse {
  success: boolean
  data?: string
  error?: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

// ============================================
// Core AI Functions
// ============================================

/**
 * Send a chat completion request to Claude
 */
export async function chat(
  messages: AIMessage[],
  options: {
    model?: string
    maxTokens?: number
    temperature?: number
    system?: string
  } = {}
): Promise<AIResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      success: false,
      error: 'Claude API key not configured',
    }
  }

  try {
    const model = options.model || DEFAULT_MODEL
    const maxTokens = options.maxTokens || DEFAULT_MAX_TOKENS
    const temperature = options.temperature || DEFAULT_TEMPERATURE

    // Build messages array with system prompt
    const allMessages: Anthropic.MessageParam[] = []

    if (options.system) {
      allMessages.push({
        role: 'user',
        content: `[System Instructions]\n${options.system}\n\n[End System Instructions]`,
      })
    }

    // Convert messages to Anthropic format
    for (const msg of messages) {
      allMessages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    }

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: allMessages,
    })

    // Extract text content from response
    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as any).text)
      .join('\n')

    return {
      success: true,
      data: textContent,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    }
  } catch (error: any) {
    console.error('Claude API error:', error)
    return {
      success: false,
      error: error.message || 'Failed to process AI request',
    }
  }
}

// ============================================
// Pre-built AI Actions
// ============================================

/**
 * Generate creative brand integration ideas
 */
export async function generateCreativeIdeas(params: {
  brandName: string
  industry: string
  programType: string
  targetAudience?: string
  budget?: string
}): Promise<AIResponse> {
  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Creative Director berpengalaman di industri media broadcasting Indonesia.
Kamu ahli dalam membuat ide integrasi brand yang kreatif, inovatif, engaging, dan sesuai dengan konteks Indonesia.
Selalu berikan ide yang actionable dan bisa langsung diimplementasikan.

Buatkan 5 ide integrasi kreatif untuk brand ${params.brandName} (${params.industry})
yang akan menjadi sponsor di program ${params.programType}.

Target audiens: ${params.targetAudience || 'Umum'}
Budget: ${params.budget || 'Flexible'}

Setiap ide harus mencakup:
1. **Nama Konsep** - Judul kreatif untuk integrasi ini
2. **Konsep Utama** - Penjelasan singkat ide
3. **Implementasi** - Detail cara implementasi di program
4. **Benefit untuk Brand** - Keuntungan yang didapat brand
5. **Estimated Impact** - Dampak yang diharapkan

Format jawaban dalam Bahasa Indonesia dengan struktur yang rapi.
Prioritaskan ide yang unique, engaging, dan feasible untuk diproduksi.`,
      },
    ],
    {
      maxTokens: 3000,
      temperature: 0.8,
    }
  )
}

/**
 * Generate proposal content
 */
export async function generateProposalContent(params: {
  brandName: string
  programName: string
  objective: string
  keyMessages?: string[]
  budget?: string
}): Promise<AIResponse> {
  const messages = params.keyMessages?.length
    ? `\nKey Messages:\n${params.keyMessages.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
    : ''

  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah expert dalam membuat proposal sponsorship untuk industri media broadcasting Indonesia.
Kamu tahu persis format dan struktur yang menarik untuk client brand.
Selalu gunakan data dan insight yang relevan untuk Indonesia.
Gunakan Bahasa Indonesia yang profesional dan persuasive.

Buatkan konten proposal sponsorship yang profesional untuk:

**Brand:** ${params.brandName}
**Program:** ${params.programName}
**Objective:** ${params.objective}
${messages}
**Budget:** ${params.budget || 'To be discussed'}

Konten harus mencakup:
1. **Executive Summary** - Ringkasan singkat proposal
2. **Why This Program** - Alasan kenapa program ini tepat untuk brand
3. **Audience Insight** - Data dan insight tentang audiens program
4. **Integration Concept** - Konsep integrasi yang proposed
5. **Investment Details** - Detail investasi yang dibutuhkan
6. **Timeline** - Timeline implementasi
7. **Call to Action** - Langkah selanjutnya

Buat dalam format yang professional dan persuasive untuk pitch ke client.`,
      },
    ],
    {
      maxTokens: 4000,
      temperature: 0.7,
    }
  )
}

/**
 * Deep brand DNA analysis
 */
export async function analyzeBrandDNA(params: {
  brandName: string
  industry: string
  competitorBrands?: string[]
}): Promise<AIResponse> {
  const competitors = params.competitorBrands?.length
    ? `\nCompetitor Brands: ${params.competitorBrands.join(', ')}`
    : ''

  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Brand Strategist profesional yang ahli dalam menganalisis brand di pasar Indonesia.
Kamu bisa memberikan insight mendalam tentang positioning, kompetitor, dan strategi yang efektif untuk sponsorship media broadcasting.
Selalu berikan analisis yang actionable dan berbasis data.

Lakukan Deep Brand DNA Analysis untuk brand ${params.brandName} di industri ${params.industry}.${competitors}

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
Gunakan Bahasa Indonesia yang profesional.`,
      },
    ],
    {
      maxTokens: 4000,
      temperature: 0.6,
    }
  )
}

/**
 * Quick brand analysis
 */
export async function analyzeBrand(params: {
  brandName: string
  industry: string
}): Promise<AIResponse> {
  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Brand Strategist yang ahli dalam menganalisis brand di pasar Indonesia.
Kamu tahu persis dinamika pasar dan consumer behavior di Indonesia.

Buatkan Brand Analysis singkat untuk ${params.brandName} di industri ${params.industry} untuk keperluan sponsorship media broadcasting.

Sertakan:
1. **Brand Overview** - Deskripsi singkat brand
2. **Target Audience** - Siapa audiens utama?
3. **Key Messages** - Pesan utama brand
4. **Previous Media Activities** - Aktivitas media sebelumnya
5. **Sponsorship Fit** - Kenapa media broadcasting cocok untuk brand ini?

Format jawaban dalam Bahasa Indonesia yang profesional dan concise (maksimal 500 kata).`,
      },
    ],
    {
      maxTokens: 2000,
      temperature: 0.7,
    }
  )
}

/**
 * Search for reference cases
 */
export async function searchReference(params: {
  topic: string
  industry?: string
}): Promise<AIResponse> {
  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Research Analyst yang ahli dalam mencari referensi dan best practices untuk sponsorship dan brand integration di Indonesia.
Kamu selalu memberikan contoh yang spesifik dan actionable.

Cari referensi dan best practices untuk:

**Topik:** ${params.topic}
**Industri:** ${params.industry || 'Umum'}

Sertakan:
1. **Successful Campaigns** - Contoh campaign yang sukses (brand spesifik)
2. **Key Learnings** - Pelajaran penting dari campaign tersebut
3. **Latest Trends** - Tren terbaru di bidang ini
4. **Recommended Approach** - Saran pendekatan yang efektif
5. **Do's and Don'ts** - Hal yang sebaiknya dilakukan dan dihindari

Gunakan contoh yang spesifik dari brand-brand terkenal di Indonesia.
Format jawaban dalam Bahasa Indonesia.`,
      },
    ],
    {
      maxTokens: 3000,
      temperature: 0.7,
    }
  )
}

/**
 * Improve text/proposal content
 */
export async function improveText(params: {
  text: string
  type?: string
}): Promise<AIResponse> {
  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Proposal Writer profesional yang ahli dalam membuat proposal sponsorship yang persuasive.
Kamu akan improve teks yang sudah ada agar lebih compelling, profesional, dan persuasive.
Pertahankan inti pesan, hanya improve execution.

Improve teks proposal berikut agar lebih professional dan persuasive:

**Type:** ${params.type || 'Proposal'}
**Original Text:**
${params.text}

Improve:
1. Bahasa dan struktur kalimat - buat lebih smooth dan professional
2. Key messaging - strengthen pesan utama
3. Call-to-action - buat lebih compelling
4. Overall persuasive power - tingkatkan kemampuan persuasi
5. Formatting - rapikan struktur jika perlu

Return hasil improved text dalam Bahasa Indonesia.`,
      },
    ],
    {
      maxTokens: 2500,
      temperature: 0.7,
    }
  )
}

/**
 * Trend analysis for market insights
 */
export async function trendAnalysis(params: {
  industry?: string
  category?: string
}): Promise<AIResponse> {
  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Market Research Analyst yang ahli dalam menganalisis tren pasar dan media di Indonesia.
Kamu selalu up-to-date dengan perkembangan terbaru dan bisa memberikan insight yang actionable.

Buatkan Trend Analysis untuk pasar sponsorship media broadcasting Indonesia.

**Industri:** ${params.industry || 'Umum'}
**Kategori:** ${params.category || 'Sponsorship'}

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
Format jawaban dalam Bahasa Indonesia yang professional.`,
      },
    ],
    {
      maxTokens: 4000,
      temperature: 0.6,
    }
  )
}

/**
 * Audience insights
 */
export async function audienceInsights(params: {
  industry?: string
  demographic?: string
}): Promise<AIResponse> {
  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Audience Research Expert yang ahli dalam menganalisis perilaku dan preferensi audiens di Indonesia.
Kamu tahu persis karakteristik berbagai segmen audiens dan bagaimana mereka consuming media.

Buatkan Audience Insights untuk:

**Industri:** ${params.industry || 'Umum'}
**Demographic:** ${params.demographic || 'Umum'}

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
Format jawaban dalam Bahasa Indonesia yang professional.`,
      },
    ],
    {
      maxTokens: 4000,
      temperature: 0.6,
    }
  )
}

/**
 * ROI calculation and analysis
 */
export async function calculateROI(params: {
  budget: string
  program: string
  expectedReach?: string
  duration?: string
}): Promise<AIResponse> {
  return chat(
    [
      {
        role: 'user',
        content: `Kamu adalah Marketing Analytics Expert yang ahli dalam menghitung ROI dan membuat business case untuk sponsorship.
Kamu tahu standar industri dan best practices dalam mengukur efektivitas sponsorship.

Buatkan ROI Analysis dan Business Case untuk sponsorship proposal:

**Budget:** ${params.budget}
**Program:** ${params.program}
**Expected Reach:** ${params.expectedReach || 'Standard reach untuk program'}
**Duration:** ${params.duration || 'Standard duration'}

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
Format jawaban dalam Bahasa Indonesia yang professional dan persuasive.`,
      },
    ],
    {
      maxTokens: 4000,
      temperature: 0.5,
    }
  )
}

// ============================================
// Client-side Helper
// ============================================

/**
 * Call AI action from client-side
 */
export async function callAIAction(
  action: string,
  params: Record<string, any>
): Promise<AIResponse> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, params }),
  })

  const data = await response.json()

  if (!data.success) {
    return {
      success: false,
      error: data.error || 'AI request failed',
    }
  }

  return {
    success: true,
    data: data.data,
  }
}
