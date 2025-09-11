// Simple in-memory rate limiter (per process) for lightweight protection.
// Not suitable for multi-instance production without shared store.

const WINDOW_MS = parseInt(process.env.CHAT_RATE_WINDOW_MS || '300000', 10); // default 5 min
const MAX_REQUESTS = parseInt(process.env.CHAT_RATE_MAX || '30', 10); // default 30 messages per window

// Store: key => { count, windowStart }
const buckets = new Map();

function rateLimitChat(req, res, next) {
  const now = Date.now();
  // Prefer authenticated user id, fallback to IP
  const key = (req.user && req.user.id) || req.ip || 'anonymous';
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({ error: 'Rate limit exceeded. Please wait before sending more messages.' });
  }
  // Expose remaining quota
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - bucket.count));
  res.setHeader('X-RateLimit-Reset', Math.floor((bucket.windowStart + WINDOW_MS) / 1000));
  next();
}

module.exports = { rateLimitChat };