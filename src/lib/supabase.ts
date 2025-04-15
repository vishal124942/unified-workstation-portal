
import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env';

// Get Supabase credentials with fallback values
const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

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
