import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Vote = {
  id: string;
  artist_name: string;
  song_name: string;
  decade: string;
  image_url: string | null;
  voter_name: string;
  city: string;
  instagram: string | null;
  is_custom: boolean;
  territory: string | null;
  created_at: string;
};
