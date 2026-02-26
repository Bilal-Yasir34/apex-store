import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🛑 THIS IS THE ULTIMATE TEST
console.log("--- SUPABASE DEBUG START ---");
console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_ANON_KEY length:", supabaseAnonKey?.length || "MISSING");
console.log("--- SUPABASE DEBUG END ---");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase keys are undefined. Check your .env file location and VITE_ prefix.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);