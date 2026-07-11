/**
 * Zod Validation Schemas for PitchFlow API
 *
 * This module contains all validation schemas for API routes.
 * Using Zod v4 for runtime validation.
 */

import { z } from 'zod'

// ============================================
// Common Schemas
// ============================================

/**
 * UUID schema for ID validation
 */
export const uuidSchema = z.string().uuid('Invalid ID format')

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * Sort schema
 */
export const sortSchema = z.object({
  field: z.string().default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// ============================================
// Brief Schemas
// ============================================

/**
 * Brief status enum
 */
export const briefStatusSchema = z.enum(['new', 'in_review', 'in_progress', 'completed'])

/**
 * Create brief schema
 */
export const createBriefSchema = z.object({
  brand_name: z.string()
    .min(1, 'Brand name is required')
    .max(200, 'Brand name must be less than 200 characters')
    .trim(),
  pic_sales: z.string()
    .min(1, 'PIC Sales is required')
    .max(100, 'PIC Sales must be less than 100 characters')
    .trim(),
  program: z.string()
    .min(1, 'Program is required')
    .max(200, 'Program must be less than 200 characters')
    .trim(),
  industry_category: z.string().max(100).optional(),
  pic_contact: z.string().max(100).optional(),
  sponsorship_type: z.string().max(100).optional(),
  objective: z.string().max(1000).optional(),
  target_audience: z.string().max(500).optional(),
  period: z.string().max(100).optional(),
  deadline: z.string().max(50).optional(),
  budget_range: z.string().max(100).optional(),
  budget_note: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  attachments: z.array(z.string().url()).max(10).optional(),
})

/**
 * Update brief schema
 */
export const updateBriefSchema = z.object({
  id: uuidSchema,
  brand_name: z.string()
    .min(1, 'Brand name is required')
    .max(200, 'Brand name must be less than 200 characters')
    .trim()
    .optional(),
  pic_sales: z.string()
    .min(1, 'PIC Sales is required')
    .max(100, 'PIC Sales must be less than 100 characters')
    .trim()
    .optional(),
  program: z.string()
    .min(1, 'Program is required')
    .max(200, 'Program must be less than 200 characters')
    .trim()
    .optional(),
  industry_category: z.string().max(100).optional().nullable(),
  pic_contact: z.string().max(100).optional().nullable(),
  sponsorship_type: z.string().max(100).optional().nullable(),
  objective: z.string().max(1000).optional().nullable(),
  target_audience: z.string().max(500).optional().nullable(),
  period: z.string().max(100).optional().nullable(),
  deadline: z.string().max(50).optional().nullable(),
  budget_range: z.string().max(100).optional().nullable(),
  budget_note: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  attachments: z.array(z.string()).max(10).optional(),
  status: briefStatusSchema.optional(),
})

/**
 * Delete brief schema
 */
export const deleteBriefSchema = z.object({
  id: uuidSchema,
})

// ============================================
// Proposal Schemas
// ============================================

/**
 * Proposal status enum
 */
export const proposalStatusSchema = z.enum([
  'new_brief',
  'drafting',
  'need_input',
  'revised',
  'ready'
])

/**
 * Proposal result enum
 */
export const proposalResultSchema = z.enum(['won', 'pitched', 'lost', 'template'])

/**
 * Create proposal schema
 */
export const createProposalSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  brand_name: z.string()
    .min(1, 'Brand name is required')
    .max(200, 'Brand name must be less than 200 characters')
    .trim(),
  pic_sales: z.string()
    .min(1, 'PIC Sales is required')
    .max(100, 'PIC Sales must be less than 100 characters')
    .trim(),
  program: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
  sponsorship_type: z.string().max(100).optional(),
  year: z.coerce.number().int().min(2020).max(2100).optional(),
  status: proposalStatusSchema.optional(),
  result: proposalResultSchema.optional(),
  brief_id: uuidSchema.optional(),
  deadline: z.string().max(50).optional(),
  slides_count: z.coerce.number().int().min(0).optional(),
})

/**
 * Update proposal schema
 */
export const updateProposalSchema = z.object({
  id: uuidSchema,
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .optional(),
  brand_name: z.string()
    .min(1, 'Brand name is required')
    .max(200, 'Brand name must be less than 200 characters')
    .trim()
    .optional(),
  pic_sales: z.string()
    .min(1, 'PIC Sales is required')
    .max(100, 'PIC Sales must be less than 100 characters')
    .trim()
    .optional(),
  program: z.string().max(200).optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  sponsorship_type: z.string().max(100).optional().nullable(),
  year: z.coerce.number().int().min(2020).max(2100).optional().nullable(),
  status: proposalStatusSchema.optional().nullable(),
  result: proposalResultSchema.optional().nullable(),
  deadline: z.string().max(50).optional().nullable(),
  slides_count: z.coerce.number().int().min(0).optional().nullable(),
})

/**
 * Delete proposal schema
 */
export const deleteProposalSchema = z.object({
  id: uuidSchema,
})

// ============================================
// Sales Comment Schemas
// ============================================

/**
 * Create sales comment schema
 */
export const createSalesCommentSchema = z.object({
  proposal_id: uuidSchema,
  content: z.string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment must be less than 2000 characters')
    .trim(),
  parent_id: uuidSchema.optional(),
})

/**
 * User role schema
 */
export const userRoleSchema = z.enum(['Sales', 'ACS', 'Supervisor'])

// ============================================
// AI Schemas
// ============================================

/**
 * AI prompt types
 */
export const aiPromptTypeSchema = z.enum([
  'brief_analysis',
  'brand_explorer',
  'proposal_content',
  'sales_feedback',
])

/**
 * AI request schema
 */
export const aiRequestSchema = z.object({
  type: aiPromptTypeSchema,
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(5000, 'Prompt must be less than 5000 characters')
    .trim(),
  context: z.record(z.unknown()).optional(),
})

// ============================================
// Validation Helper Functions
// ============================================

/**
 * Validate request body against a schema
 */
export function validateBody<T>(
  body: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(body)

  if (!result.success) {
    return { success: false, error: result.error }
  }

  return { success: true, data: result.data }
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Sanitize object strings recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) : item
      )
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

// ============================================
// Type Exports
// ============================================

export type CreateBriefInput = z.infer<typeof createBriefSchema>
export type UpdateBriefInput = z.infer<typeof updateBriefSchema>
export type CreateProposalInput = z.infer<typeof createProposalSchema>
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>
export type CreateSalesCommentInput = z.infer<typeof createSalesCommentSchema>
export type AIRequestInput = z.infer<typeof aiRequestSchema>
