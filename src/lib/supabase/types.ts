export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: 'Supervisor' | 'ACS' | 'Sales'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: 'Supervisor' | 'ACS' | 'Sales'
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: 'Supervisor' | 'ACS' | 'Sales'
        }
      }
      briefs: {
        Row: {
          id: string
          brand_name: string
          industry_category: string | null
          pic_sales: string
          pic_contact: string | null
          program: string
          sponsorship_type: string | null
          objective: string | null
          target_audience: string | null
          period: string | null
          deadline: string | null
          budget_range: string | null
          budget_note: string | null
          notes: string | null
          attachments: string[] | null
          status: 'new' | 'in_review' | 'in_progress' | 'completed'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_name: string
          industry_category?: string | null
          pic_sales: string
          pic_contact?: string | null
          program: string
          sponsorship_type?: string | null
          objective?: string | null
          target_audience?: string | null
          period?: string | null
          deadline?: string | null
          budget_range?: string | null
          budget_note?: string | null
          notes?: string | null
          attachments?: string[] | null
          status?: 'new' | 'in_review' | 'in_progress' | 'completed'
          created_by?: string | null
        }
        Update: {
          brand_name?: string
          industry_category?: string | null
          pic_sales?: string
          pic_contact?: string | null
          program?: string
          sponsorship_type?: string | null
          objective?: string | null
          target_audience?: string | null
          period?: string | null
          deadline?: string | null
          budget_range?: string | null
          budget_note?: string | null
          notes?: string | null
          attachments?: string[] | null
          status?: 'new' | 'in_review' | 'in_progress' | 'completed'
        }
      }
      proposals: {
        Row: {
          id: string
          brief_id: string | null
          title: string
          brand_name: string
          program: string
          industry: string | null
          sponsorship_type: string | null
          year: number
          status: 'new_brief' | 'drafting' | 'need_input' | 'revised' | 'ready'
          result: 'won' | 'pitched' | 'lost' | 'template' | null
          pic_sales: string
          deadline: string | null
          last_activity: string | null
          slides_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brief_id?: string | null
          title: string
          brand_name: string
          program: string
          industry?: string | null
          sponsorship_type?: string | null
          year?: number
          status?: 'new_brief' | 'drafting' | 'need_input' | 'revised' | 'ready'
          result?: 'won' | 'pitched' | 'lost' | 'template' | null
          pic_sales: string
          deadline?: string | null
          last_activity?: string | null
          slides_count?: number
          created_by?: string | null
        }
        Update: {
          brief_id?: string | null
          title?: string
          brand_name?: string
          program?: string
          industry?: string | null
          sponsorship_type?: string | null
          year?: number
          status?: 'new_brief' | 'drafting' | 'need_input' | 'revised' | 'ready'
          result?: 'won' | 'pitched' | 'lost' | 'template' | null
          pic_sales?: string
          deadline?: string | null
          last_activity?: string | null
          slides_count?: number
        }
      }
      sales_comments: {
        Row: {
          id: string
          proposal_id: string
          user_id: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          user_id: string
          content: string
          parent_id?: string | null
        }
        Update: {
          content?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          brand_name: string | null
          email: string | null
          phone: string | null
          company: string | null
          industry: string | null
          address: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand_name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          industry?: string | null
          address?: string | null
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          name?: string
          brand_name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          industry?: string | null
          address?: string | null
          notes?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          event_time: string | null
          event_type: 'deadline' | 'meeting' | 'milestone' | 'presentation' | 'other'
          proposal_id: string | null
          brief_id: string | null
          client_id: string | null
          reminder: boolean
          reminder_days_before: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          event_time?: string | null
          event_type?: 'deadline' | 'meeting' | 'milestone' | 'presentation' | 'other'
          proposal_id?: string | null
          brief_id?: string | null
          client_id?: string | null
          reminder?: boolean
          reminder_days_before?: number
          created_by?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_type?: 'deadline' | 'meeting' | 'milestone' | 'presentation' | 'other'
          proposal_id?: string | null
          brief_id?: string | null
          client_id?: string | null
          reminder?: boolean
          reminder_days_before?: number
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
