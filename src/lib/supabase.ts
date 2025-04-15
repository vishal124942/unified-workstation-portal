
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
