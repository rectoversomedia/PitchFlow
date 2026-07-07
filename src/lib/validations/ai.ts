import { z } from 'zod'

// ==================== AI ENDPOINT ====================

export const AIActionEnum = z.enum([
  'brandDNA',
  'analyzeBrand',
  'generateIdeas',
  'generateProposal',
  'searchReference',
  'improveText',
  'trendAnalysis',
  'audienceInsights',
  'calculateROI'
])
export type AIAction = z.infer<typeof AIActionEnum>

export const BrandDNAParamsSchema = z.object({
  brandName: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
  competitorBrands: z.array(z.string().max(200)).max(10).optional(),
})

export const AnalyzeBrandParamsSchema = z.object({
  brandName: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
})

export const GenerateIdeasParamsSchema = z.object({
  brandName: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
  programType: z.string().min(1).max(100),
  targetAudience: z.string().max(200).optional(),
  budget: z.string().max(100).optional(),
})

export const GenerateProposalParamsSchema = z.object({
  brandName: z.string().min(1).max(200),
  programName: z.string().min(1).max(200),
  objective: z.string().min(1).max(1000),
  keyMessages: z.array(z.string().max(500)).max(10).optional(),
  budget: z.string().max(100).optional(),
})

export const SearchReferenceParamsSchema = z.object({
  topic: z.string().min(1).max(200),
  industry: z.string().max(100).optional(),
})

export const ImproveTextParamsSchema = z.object({
  text: z.string().min(1).max(10000),
  type: z.string().max(50).optional(),
})

export const TrendAnalysisParamsSchema = z.object({
  industry: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
})

export const AudienceInsightsParamsSchema = z.object({
  industry: z.string().max(100).optional(),
  demographic: z.string().max(100).optional(),
})

export const CalculateROIParamsSchema = z.object({
  budget: z.string().min(1).max(100),
  program: z.string().min(1).max(200),
  expectedReach: z.string().max(100).optional(),
  duration: z.string().max(50).optional(),
})

export const AIRequestSchema = z.object({
  action: AIActionEnum,
  params: z.union([
    BrandDNAParamsSchema,
    AnalyzeBrandParamsSchema,
    GenerateIdeasParamsSchema,
    GenerateProposalParamsSchema,
    SearchReferenceParamsSchema,
    ImproveTextParamsSchema,
    TrendAnalysisParamsSchema,
    AudienceInsightsParamsSchema,
    CalculateROIParamsSchema,
  ])
})

export type AIRequest = z.infer<typeof AIRequestSchema>

// ==================== VALIDATION HELPERS ====================

/**
 * Validate data against a Zod schema and return formatted errors
 */
export function validateRequest<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Format Zod errors for API response
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root'
    if (!formatted[path]) {
      formatted[path] = []
    }
    formatted[path].push(issue.message)
  }

  return formatted
}
