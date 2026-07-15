import { DefaultSession } from "next-auth"

export type User = {
  id: string
  name: string
  email: string
  role: "Supervisor" | "ACS" | "Sales"
  avatar?: string
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    role?: string
  }
}

export type Brief = {
  id: string
  brand_name: string
  industry_category: string
  pic_sales: string
  pic_contact: string
  program: string
  sponsorship_type: string
  objective: string
  target_audience: string
  period: string
  deadline: string
  budget_range: string
  budget_note: string
  notes: string
  attachments: string[]
  status: "new" | "in_review" | "in_progress" | "completed"
  created_at: string
  created_by: string
  // Legacy support
  brandName?: string
  industryCategory?: string
  picSales?: string
  programName?: string
  sponsorshipType?: string
  targetAudience?: string
  budgetRange?: string
  budgetNote?: string
  deadlineDate?: string
  createdAt?: string
  createdBy?: string
}

export type Proposal = {
  id: string
  title: string
  brand_name: string
  program: string
  industry: string
  sponsorship_type: string
  year: number
  status: "new_brief" | "drafting" | "need_input" | "revised" | "ready"
  result?: "won" | "pitched" | "lost" | "template"
  pic_sales: string
  deadline: string
  last_activity: string
  slides_count: number
  created_at: string
  updated_at: string
  // Legacy support
  brandName?: string
  programName?: string
  picSales?: string
  lastActivity?: string
  slidesCount?: number
  createdAt?: string
  updatedAt?: string
}

export type SalesComment = {
  id: string
  proposal_id: string
  user_id: string
  user_name: string
  user_role: "Sales" | "ACS" | "Supervisor"
  content: string
  timestamp: string
  replies?: SalesComment[]
  // Legacy support
  proposalId?: string
  userId?: string
  userName?: string
  userRole?: "Sales" | "ACS" | "Supervisor"
  time?: string
}

export type BrandExplorer = {
  id: string
  brand_name: string
  category: string
  objective: string
  target_audience: string
  program: string
  sponsorship_type: string
  budget_range: string
  notes?: string
  brand_summary?: {
    description: string
    target_audience: string
    brand_value: string
    competitors: string
    persona: string
  }
  insights?: {
    title: string
    description: string
  }[]
  program_fits?: {
    program: string
    match_level: "best" | "good" | "potential"
    description: string
  }[]
  integration_ideas?: {
    type: string
    idea: string
  }[]
  package_recommendation?: {
    name: string
    value: string
    deliverables: string[]
  }
  created_at: string
}

export type CreativeIdea = {
  id: string
  proposal_id?: string
  brand_name: string
  category: "segment" | "product_placement" | "digital" | "social"
  title: string
  description: string
  created_at: string
}

export type LibraryProposal = {
  id: string
  title: string
  brand_name: string
  program: string
  industry: string
  sponsorship_type: string
  year: number
  status: "won" | "pitched" | "lost" | "template"
  last_viewed: string
  thumbnail?: string
  slides_count: number
  tags: string[]
  // Legacy support
  brandName?: string
}

export type Client = {
  id: string
  name: string
  brand_name: string
  email: string
  phone: string
  company: string
  industry: string
  address: string
  notes: string
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  event_type: "deadline" | "meeting" | "milestone" | "presentation" | "other"
  proposal_id?: string
  brief_id?: string
  client_id?: string
  reminder: boolean
  reminder_days_before: number
  created_by?: string
  created_at: string
  updated_at: string
}
