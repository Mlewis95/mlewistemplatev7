import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  users: {
    Row: {
      user_id: string;
      name: string;
      email: string;
      password_hash: string;
      role: 'volunteer' | 'manager';
      orientation_completed: boolean;
      total_hours: number;
      profile_photo_url: string | null;
    };
  };
  user_training: {
    Row: {
      training_id: string;
      user_id: string;
      training_level: 'Green' | 'Yellow' | 'Blue' | 'Red' | 'Black';
    };
  };
  volunteer_time: {
    Row: {
      log_id: string;
      user_id: string;
      sign_in_time: string;
      sign_out_time: string | null;
    };
  };
  pets: {
    Row: {
      pet_id: string;
      name: string;
      species: 'dog' | 'cat';
      training_level: 'Green' | 'Yellow' | 'Blue' | 'Red' | 'Black';
      is_fosterable: boolean;
      photo_url: string | null;
      notes: string | null;
    };
  };
  dog_walks: {
    Row: {
      walk_id: string;
      user_id: string;
      dog_id: string;
      walk_date: string;
      time_start: string;
      duration: string;
    };
  };
  tasks: {
    Row: {
      task_id: string;
      title: string;
      description: string | null;
      priority: number;
      notes: string | null;
      created_by: string | null;
      created_at: string;
    };
  };
  messages: {
    Row: {
      message_id: string;
      content: string;
      posted_by: string | null;
      timestamp: string;
    };
  };
  comments: {
    Row: {
      comment_id: string;
      message_id: string;
      posted_by: string | null;
      content: string;
      timestamp: string;
    };
  };
  orientation_schedule: {
    Row: {
      schedule_id: string;
      date: string;
      time: string;
      max_participants: number;
      created_by: string | null;
    };
  };
};