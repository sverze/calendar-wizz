import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../types/supabase";

export const createClient = () => {
  // This will automatically use the environment variables from .env.local:
  // NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
  return createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
};

// Helper function to get the API URL and headers for direct REST API calls
export const getSupabaseApiConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return {
    apiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    apiKey: apiKey,
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Prefer': 'return=representation'
    }
  };
};
