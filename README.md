# Zephy - Student Wellness & Support Hub 🏫

Zephy is a privacy‑first mental wellness companion for students: anonymous community support, quick wellness check‑ins, pulse polls, and an empathetic AI – backed by a secure, persistent backend.

## 🌟 Core Features

| Area | Summary |
|------|---------|
| Communities | Themed spaces with anonymous posts & replies (nickname + avatar only) |
| Polls | Emoji, multi‑choice, scale & yes/no polls with deduped votes |
| Fit Check | Mood / stress / energy tracking with history |
| AI Chat | Contextual, rate‑limited, day‑session memory |
| Auth | Supabase (email + Google) with minimal profile layer |
| Security | Sanitization, rate limiting, (optional) RLS policies |

## 🔒 Privacy & Trust Model

| Aspect | Approach |
|--------|---------|
| Authentication | Supabase Auth JWT |
| Profiles | Separate table; only nickname + avatar exposed |
| Data Storage | Postgres (Supabase) persistent tables |
| API Keys | Service role key only server-side; anon key client |
| Sanitization | All user text HTML‑escaped & length bounded |
| Rate Limiting | Chat endpoint per user/IP window |
| Planned | Enable RLS policies (see schema.sql) |

## 🛠️ Tech Stack

- Frontend: Vanilla HTML/CSS/JS, multi‑page, centralized `api.js`
- Backend: Node.js + Express routes (communities, polls, fitcheck, chat)
- DB: Supabase Postgres (schema in `backend/db/schema.sql`)
- Auth: Supabase email/password + Google OAuth
- AI: OpenAI `gpt-4o-mini`
- Security: JWT middleware, input sanitization (`sanitize.js`), rate limiter (`rateLimit.js`), recommended RLS SQL

## 📐 Schema Overview

Primary tables: `user_profiles`, `community_posts`, `post_reactions`, `post_replies`, `polls`, `poll_options`, `poll_votes`, `fitcheck_assessments`, `chat_sessions`, `chat_messages`, `audit_logs`.


### Prerequisites

- Node.js 18+
- Supabase project (URL, anon key, service role key)
- OpenAI API key

### Install & Run

1. Clone & install

   ```bash
   git clone https://github.com/your-username/sih-mental-health.git
   cd sih-mental-health
   npm install
   ```
2. Create `.env` (server only stores service key)
   
   ```env
   SUPABASE_URL=... 
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   OPENAI_API_KEY=...
   CHAT_RATE_WINDOW_MS=60000
   CHAT_RATE_MAX=20
   PORT=5000
   ```

3. Apply SQL: run `backend/db/schema.sql` in Supabase SQL editor (optionally uncomment RLS blocks)  
4. Start server
   
   ```bash
   cd backend
### Supabase CLI Setup and Migrations

To set up the Supabase CLI, follow these steps:

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize your Supabase project:
   ```bash
   supabase init
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

4. To view your database:
   ```bash
   supabase db remote
   ```
   node Server.js
   ```

5. Open `http://localhost:5000`

### Frontend Only Mode

Open `frontend/index.html` directly (limited – persistence & chat need backend).

## 📁 Key Structure

```txt
backend/
  Server.js
  routes/{chat.js,communities.js,fitcheck.js}
  middleware/{auth.js,rateLimit.js}
  utils/{ai.js,supabase.js,sanitize.js}
  db/schema.sql
frontend/
  index.html ... chat.html ... scripts & assets
```

## 🔧 Customization

Poll option presets, community lists, and FitCheck task logic can be updated in their respective frontend scripts. RLS policies can be refined in `schema.sql`.

## 🧪 Test Checklist

- Post create → reaction toggle → reply
- Poll create → vote (repeat vote ignored)
- FitCheck insert → history retrieval
- Chat history persists (auth user)
- Rate limit returns 429 when exceeded
- Sanitization: `<script>` rendered escaped

## 🛡️ Security Notes

- Never ship the service role key to the client.
- After enabling RLS: retest all CRUD via anon key.
- Consider adding moderation & audit log writers.

## 💡 Roadmap

- Chat pagination (“Load earlier messages”)
- Enable & enforce RLS (production)
- Reaction pre-fetch for initial UI state
- AI moderation pipeline (toxicity / crisis detection)
- WebSocket real‑time updates
- PWA / mobile shell

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| 401 on API | Check Supabase keys / JWT token expiration |
| 429 on chat | You hit rate limit window; wait & retry |
| Missing data | Confirm schema applied & env vars loaded |
| AI failures | Validate OPENAI_API_KEY + network connectivity |

## 🤝 Contributing

1. Fork
2. Branch: `feat/your-feature`
3. Commit small, descriptive changes
4. PR with context & screenshots

## 📜 License

MIT

---

Made with 💜 for student mental wellness. Your privacy matters.
