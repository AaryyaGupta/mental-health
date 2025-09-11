// Supabase Configuration
// Values should be injected at build/deploy time for security. Fallback to placeholders if not defined.
const SUPABASE_URL = window.__SUPABASE_URL__ || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY__ || 'YOUR_SUPABASE_ANON_KEY';

// Google OAuth Configuration (Only client ID should be exposed on frontend)
const GOOGLE_CLIENT_ID = '891008477136-1qc3e18att5oa09jfjoq2cqvi091u302.apps.googleusercontent.com';
// Removed client secret from frontend for security. Keep it server-side only.

// Initialize Supabase client
if (!SUPABASE_URL || SUPABASE_URL.startsWith('YOUR_')) {
	console.warn('[Supabase] Missing SUPABASE_URL. Set window.__SUPABASE_URL__ before loading config.js');
}
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.startsWith('YOUR_')) {
	console.warn('[Supabase] Missing SUPABASE_ANON_KEY. Set window.__SUPABASE_ANON_KEY__ before loading config.js');
}

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
window.googleConfig = { clientId: GOOGLE_CLIENT_ID };
