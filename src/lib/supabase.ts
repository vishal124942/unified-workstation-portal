
import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env';

// Get Supabase credentials with fallback values
const supabaseUrl = "https://hqfnyqrkziuukcfyspat.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZm55cXJreml1dWtjZnlzcGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mzk3OTcsImV4cCI6MjA2MDIxNTc5N30.sh25M_8w6ikm9lYKiJ4NaiiLSZc4RcSSs0KKJgXy4tQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions that match Supabase table structure
export type UserMetadata = {
  id: string;
  username: string;
  role: 'user' | 'admin';
  profile_picture?: string;
  allowed_software?: string[];
  created_at: string;
};

export type WorkItem = {
  id: string;
  user_id: string;
  software: string;
  content: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};
