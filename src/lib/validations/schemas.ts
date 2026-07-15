import { z } from 'zod'

// ==================== BRIEFS ====================

export const BriefStatusEnum = z.enum(['new', 'in_review', 'in_progress', 'completed'])
export type BriefStatus = z.infer<typeof BriefStatusEnum>

export const CreateBriefSchema = z.object({
  brand_name: z.string()
    .min(1, "Brand name is required")
    .max(200, "Brand name must be less than 200 characters"),
  pic_sales: z.string()
    .min(1, "PIC Sales is required")
    .max(200, "PIC Sales must be less than 200 characters"),
  program: z.string()
    .min(1, "Program is required")
    .max(200, "Program must be less than 200 characters"),
  industry_category: z.string()
    .max(100, "Industry category must be less than 100 characters")
    .optional(),
  pic_contact: z.string()
    .max(100, "PIC Contact must be less than 100 characters")
    .optional(),
  sponsorship_type: z.string()
    .max(100, "Sponsorship type must be less than 100 characters")
    .optional(),
  objective: z.string()
    .max(1000, "Objective must be less than 1000 characters")
    .optional(),
  target_audience: z.string()
    .max(500, "Target audience must be less than 500 characters")
    .optional(),
  period: z.string()
    .max(100, "Period must be less than 100 characters")
    .optional(),
  deadline: z.string()
    .max(10, "Deadline must be a valid date")
    .optional(),
  budget_range: z.string()
    .max(100, "Budget range must be less than 100 characters")
    .optional(),
  budget_note: z.string()
    .max(500, "Budget note must be less than 500 characters")
    .optional(),
  notes: z.string()
    .max(2000, "Notes must be less than 2000 characters")
    .optional(),
  attachments: z.array(z.string().url())
    .max(20, "Maximum 20 attachments allowed")
    .optional(),
})

export const UpdateBriefSchema = CreateBriefSchema.extend({
  id: z.string().uuid("Invalid brief ID"),
  status: BriefStatusEnum.optional(),
})

export const BriefIdParamSchema = z.object({
  id: z.string().uuid("Invalid brief ID")
})

export type CreateBriefInput = z.infer<typeof CreateBriefSchema>
export type UpdateBriefInput = z.infer<typeof UpdateBriefSchema>

// ==================== CLIENTS ====================

export const CreateClientSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  brand_name: z.string()
    .max(200, "Brand name must be less than 200 characters")
    .optional(),
  email: z.string()
    .email("Invalid email format")
    .max(200, "Email must be less than 200 characters")
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .max(30, "Phone must be less than 30 characters")
    .optional(),
  company: z.string()
    .max(200, "Company must be less than 200 characters")
    .optional(),
  industry: z.string()
    .max(100, "Industry must be less than 100 characters")
    .optional(),
  address: z.string()
    .max(500, "Address must be less than 500 characters")
    .optional(),
  notes: z.string()
    .max(2000, "Notes must be less than 2000 characters")
    .optional(),
})

export const UpdateClientSchema = CreateClientSchema.extend({
  id: z.string().uuid("Invalid client ID"),
  name: z.string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters")
    .optional(),
})

export const ClientIdParamSchema = z.object({
  id: z.string().uuid("Invalid client ID")
})

export type CreateClientInput = z.infer<typeof CreateClientSchema>
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>

// ==================== PROPOSALS ====================

export const ProposalStatusEnum = z.enum(['new_brief', 'drafting', 'need_input', 'revised', 'ready'])
export type ProposalStatus = z.infer<typeof ProposalStatusEnum>

export const ProposalResultEnum = z.enum(['won', 'pitched', 'lost', 'template'])
export type ProposalResult = z.infer<typeof ProposalResultEnum>

export const CreateProposalSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters"),
  brand_name: z.string()
    .min(1, "Brand name is required")
    .max(200, "Brand name must be less than 200 characters"),
  pic_sales: z.string()
    .min(1, "PIC Sales is required")
    .max(200, "PIC Sales must be less than 200 characters"),
  program: z.string()
    .max(200, "Program must be less than 200 characters")
    .optional(),
  industry: z.string()
    .max(100, "Industry must be less than 100 characters")
    .optional(),
  sponsorship_type: z.string()
    .max(100, "Sponsorship type must be less than 100 characters")
    .optional(),
  year: z.number()
    .int("Year must be an integer")
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Year must be 2100 or earlier")
    .optional(),
  status: ProposalStatusEnum
    .optional(),
  brief_id: z.string()
    .uuid("Invalid brief ID")
    .optional(),
  result: ProposalResultEnum
    .optional(),
  deadline: z.string()
    .max(10, "Deadline must be a valid date")
    .optional(),
  slides_count: z.number()
    .int("Slides count must be an integer")
    .min(0, "Slides count cannot be negative")
    .max(500, "Slides count must be 500 or less")
    .optional(),
})

export const UpdateProposalSchema = CreateProposalSchema.extend({
  id: z.string().uuid("Invalid proposal ID"),
  title: z.string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters")
    .optional(),
  brand_name: z.string()
    .min(1, "Brand name is required")
    .max(200, "Brand name must be less than 200 characters")
    .optional(),
  pic_sales: z.string()
    .min(1, "PIC Sales is required")
    .max(200, "PIC Sales must be less than 200 characters")
    .optional(),
})

export const ProposalIdParamSchema = z.object({
  id: z.string().uuid("Invalid proposal ID")
})

export type CreateProposalInput = z.infer<typeof CreateProposalSchema>
export type UpdateProposalInput = z.infer<typeof UpdateProposalSchema>

// ==================== EVENTS ====================

export const EventTypeEnum = z.enum(['deadline', 'meeting', 'milestone', 'presentation', 'other'])
export type EventType = z.infer<typeof EventTypeEnum>

export const CreateEventSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  event_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  event_time: z.string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format")
    .optional(),
  event_type: EventTypeEnum
    .optional(),
  proposal_id: z.string()
    .uuid("Invalid proposal ID")
    .optional(),
  brief_id: z.string()
    .uuid("Invalid brief ID")
    .optional(),
  client_id: z.string()
    .uuid("Invalid client ID")
    .optional(),
  reminder: z.boolean()
    .optional(),
  reminder_days_before: z.number()
    .int("Reminder days must be an integer")
    .min(0, "Reminder days cannot be negative")
    .max(30, "Reminder days must be 30 or less")
    .optional(),
})

export const UpdateEventSchema = CreateEventSchema.extend({
  id: z.string().uuid("Invalid event ID"),
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  event_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
})

export const EventIdParamSchema = z.object({
  id: z.string().uuid("Invalid event ID")
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>

// ==================== SALES COMMENTS ====================

export const CreateSalesCommentSchema = z.object({
  proposal_id: z.string()
    .uuid("Invalid proposal ID"),
  content: z.string()
    .min(1, "Content is required")
    .max(10000, "Comment must be less than 10000 characters"),
  parent_id: z.string()
    .uuid("Invalid parent comment ID")
    .optional(),
})

export const SalesCommentIdParamSchema = z.object({
  id: z.string().uuid("Invalid comment ID")
})

export type CreateSalesCommentInput = z.infer<typeof CreateSalesCommentSchema>
