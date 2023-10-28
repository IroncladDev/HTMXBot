import { createClient } from "@supabase/supabase-js";

// const supabase = createClient("https://advlrdhtekhrndguqvdj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdmxyZGh0ZWtocm5kZ3VxdmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0ODM2NDIsImV4cCI6MjAxMzA1OTY0Mn0.ZrAExHx6L_jtsa5_C6KpLdcZHZU73xhDS5bnw1Cs7eA")

// Before usage, please uncomment below and remove `supabase` defined above.

if (typeof process.env.SUPABASE_DB_URL !== "string") {
  throw new Error("Missing environment variable SUPABASE_DB_URL");
}

if (typeof process.env.SUPABASE_SERVICE_ROLE !== "string") {
  throw new Error("Missing environment variable SUPABASE_SERVICE_ROLE");
}

const supabase = createClient(
  process.env.SUPABASE_DB_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);

export default supabase;
