// Server-side only - never expose to client
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface AIRequestParams {
  model?: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  max_tokens?: number
  temperature?: number
}

interface ImageRequestParams {
  model?: string
  prompt: string
  n?: number
  size?: string
  style?: string
  quality?: string
}

// Generic chat completion
async function chatCompletion(params: AIRequestParams) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: params.model || 'gpt-4o',
      messages: params.messages,
      max_tokens: params.max_tokens || 2000,
      temperature: params.temperature || 0.7,
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API Error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Generate image with DALL-E
async function generateImageFromDALLE(params: ImageRequestParams) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: params.model || 'dall-e-3',
      prompt: params.prompt,
      n: params.n || 1,
      size: params.size || '1024x1024',
      style: params.style || 'vivid',
      quality: params.quality || 'standard',
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API Error: ${error}`)
  }

  const data = await response.json()
  return data.data[0].url
}

// AI Functions

export async function generateCreativeIdeas(params: {
  brandName: string
  industry: string
  programType: string
  targetAudience: string
  budget?: string
}): Promise<string> {
  return chatCompletion({
    messages: [
      {
        role: 'system',
        content: `Kamu adalah Creative Director berpengalaman di industri media broadcasting Indonesia.
Kamu ahli dalam membuat ide integrasi brand yang kreatif, inovatif, dan sesuai dengan konteks Indonesia.
Selalu berikan ide yang actionable dan bisa langsung diimplementasikan.`
      },
      {
        role: 'user',
        content: `Buatkan 5 ide integrasi kreatif untuk brand ${params.brandName} (${params.industry})
yang akan menjadi sponsor di program ${params.programType}.

Target audiens: ${params.targetAudience}
Budget: ${params.budget || 'Flexible'}

Setiap ide harus mencakup:
1. Konsep utama
2. Penjelasan singkat implementasi
3. Potensi benefit untuk brand

Format jawaban dalam Bahasa Indonesia dengan struktur yang rapi.`
      }
    ],
    max_tokens: 2000,
    temperature: 0.8,
  })
}

export async function generateProposalContent(params: {
  brandName: string
  programName: string
  objective: string
  keyMessages: string[]
  budget: string
}): Promise<string> {
  return chatCompletion({
    messages: [
      {
        role: 'system',
        content: `Kamu adalah expert dalam membuat proposal sponsorship untuk industri media broadcasting Indonesia.
Kamu tahu persis format dan struktur yang menarik untuk client brand.
Selalu gunakan data dan insight yang relevan untuk Indonesia.`
      },
      {
        role: 'user',
        content: `Buatkan konten proposal sponsorship yang profesional untuk:

Brand: ${params.brandName}
Program: ${params.programName}
Objective: ${params.objective}
Key Messages: ${params.keyMessages.join(', ')}
Budget: ${params.budget}

Konten harus mencakup:
1. Executive Summary
2. Why This Program
3. Audience Insight
4. Integration Concept
5. Investment Details

Gunakan Bahasa Indonesia yang profesional dan persuasive.`
      }
    ],
    max_tokens: 3000,
    temperature: 0.7,
  })
}

export async function generateImagePrompt(brandName: string, concept: string): Promise<string> {
  return chatCompletion({
    messages: [
      {
        role: 'system',
        content: 'Kamu adalah expert dalam membuat prompt untuk AI image generation. Buat prompt yang detail dan visual.'
      },
      {
        role: 'user',
        content: `Buatkan prompt untuk DALL-E image generation untuk brand integration concept berikut:

Brand: ${brandName}
Concept: ${concept}

Prompt harus:
1. Detail dan spesifik
2. Include lighting, composition, style
3. Suitable untuk corporate/professional use
4. Dalam Bahasa Inggris

Contoh format: "A professional photography of [description], warm lighting, 4K, corporate style, Indonesian context"`
      }
    ],
    max_tokens: 500,
    temperature: 0.7,
  })
}

export async function generateImage(description: string): Promise<string> {
  return generateImageFromDALLE({
    prompt: description,
    style: 'vivid',
    quality: 'standard',
  })
}

export async function analyzeBrand(brandName: string, industry: string): Promise<string> {
  return chatCompletion({
    messages: [
      {
        role: 'system',
        content: `Kamu adalah Brand Strategist yang ahli dalam menganalisis brand di pasar Indonesia.
Kamu bisa memberikan insight mendalam tentang positioning, kompetitor, dan strategi yang efektif.`
      },
      {
        role: 'user',
        content: `Analisis brand ${brandName} di industri ${industry} untuk keperluan sponsorship media broadcasting.

Sertakan:
1. Brand Positioning
2. Key Competitors
3. Target Demographics
4. Previous Sponsorship History
5. Recommendation untuk media integration

Gunakan Bahasa Indonesia dengan insight yang actionable.`
      }
    ],
    max_tokens: 2500,
    temperature: 0.6,
  })
}

export async function improveProposalText(text: string): Promise<string> {
  return chatCompletion({
    messages: [
      {
        role: 'system',
        content: `Kamu adalah Proposal Writer profesional yang ahli dalam membuat proposal sponsorship yang persuasive.
Kamu akan improve teks proposal yang sudah ada agar lebih compelling dan profesional.`
      },
      {
        role: 'user',
        content: `Improve proposal text berikut agar lebih professional dan persuasive:

${text}

Improve:
1. Bahasa dan struktur kalimat
2. Key messaging
3. Call-to-action
4. Overall persuasive power

Pertahankan inti pesan, hanya improve execution.`
      }
    ],
    max_tokens: 2500,
    temperature: 0.7,
  })
}

export async function searchReference(params: {
  topic: string
  industry: string
}): Promise<string> {
  return chatCompletion({
    messages: [
      {
        role: 'system',
        content: `Kamu adalah Research Analyst yang ahli dalam mencari referensi dan best practices untuk sponsorship dan brand integration di Indonesia.`
      },
      {
        role: 'user',
        content: `Cari referensi dan best practices untuk:

Topik: ${params.topic}
Industri: ${params.industry}

Sertakan:
1. Contoh successful campaigns
2. Key learnings
3. Trend terbaru
4. Recommended approach

Gunakan Bahasa Indonesia dengan contoh yang spesifik.`
      }
    ],
    max_tokens: 2500,
    temperature: 0.7,
  })
}

// Client-side helper for calling the API
export async function callAIAction(action: string, params: any) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, params }),
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'AI request failed')
  }

  return data.data
}
