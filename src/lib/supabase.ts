import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      pets: {
        Row: {
          id: number
          name: string
          type: 'dog' | 'cat'
          age: string
          size: string
          gender: string
          breed: string
          weight: string
          energy_level: string
          time_at_shelter: string
          description: string
          long_description: string
          photos: string[]
          good_with: string[]
          medical_info: string
          special_needs: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          type: 'dog' | 'cat'
          age: string
          size: string
          gender: string
          breed: string
          weight: string
          energy_level: string
          time_at_shelter: string
          description: string
          long_description: string
          photos: string[]
          good_with: string[]
          medical_info: string
          special_needs: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: 'dog' | 'cat'
          age?: string
          size?: string
          gender?: string
          breed?: string
          weight?: string
          energy_level?: string
          time_at_shelter?: string
          description?: string
          long_description?: string
          photos?: string[]
          good_with?: string[]
          medical_info?: string
          special_needs?: string
          created_at?: string
          updated_at?: string
        }
      }
      volunteers: {
        Row: {
          id: number
          email: string
          first_name: string
          last_name: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          first_name: string
          last_name: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      volunteer_sessions: {
        Row: {
          id: number
          volunteer_id: number
          session_date: string
          session_time: string
          status: 'scheduled' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          volunteer_id: number
          session_date: string
          session_time: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          volunteer_id?: number
          session_date?: string
          session_time?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 