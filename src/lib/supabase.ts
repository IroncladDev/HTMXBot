import { createClient } from "@supabase/supabase-js";

const { SUPABASE_DB_URL, SUPABASE_SERVICE_ROLE, SUPABASE_ANON_KEY } = process.env;

if (
  typeof SUPABASE_DB_URL !== "string" ||
  typeof SUPABASE_SERVICE_ROLE !== "string" ||
  typeof SUPABASE_ANON_KEY !== "string"
) {
  throw new Error("Invalid environment variable configuration");
}

export const supabase = createClient(
  SUPABASE_DB_URL,
  SUPABASE_SERVICE_ROLE,
);

export const client = createClient(
  SUPABASE_DB_URL,
  SUPABASE_ANON_KEY,
);
