const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function buildClient(token) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing auth token' });
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return res.status(500).json({ error: 'Auth not configured' });
    const client = buildClient(token);
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth verification failed', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Optional auth: sets req.user if token valid, continues otherwise
async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token && SUPABASE_URL && SUPABASE_ANON_KEY) {
      const client = buildClient(token);
      const { data: { user } } = await client.auth.getUser();
      if (user) req.user = user;
    }
  } catch (err) {
    // ignore errors for optional auth
  }
  next();
}

module.exports = { requireAuth, optionalAuth };