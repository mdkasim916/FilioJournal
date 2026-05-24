import { createClient } from "@supabase/supabase-js";

// Vite requires environment variables to start with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to check if a value is a valid non-empty string and not "undefined"
const isValidConfig = (val) =>
  Boolean(val) && val !== "undefined" && val !== "null";

export const hasSupabaseConfig =
  isValidConfig(supabaseUrl) && isValidConfig(supabaseAnonKey);

if (!hasSupabaseConfig && import.meta.env.DEV) {
  console.warn(
    "Supabase configuration is missing. Check your .env file and ensure " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.",
  );
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
