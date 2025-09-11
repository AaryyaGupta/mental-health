// Server-side Supabase client (service role) for persistence
// NOTE: The service role key must NEVER be exposed to the browser.
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // secure server key

if (!SUPABASE_URL) {
  console.warn('[supabase] SUPABASE_URL is not set. Database features will fail.');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[supabase] SUPABASE_SERVICE_ROLE_KEY is not set. Database features will fail.');
}

const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

module.exports = supabase;