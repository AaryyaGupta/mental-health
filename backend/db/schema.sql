-- =============================================================
-- Zephy Database Schema (Supabase Postgres)
-- Restore version: 2025-09-12
-- NOTE: Run this in the Supabase SQL Editor to (re)create tables.
--       RLS is NOT enabled by default below. Apply policies only
--       AFTER verifying application CRUD works.
-- =============================================================

-- EXTENSIONS (some already enabled in Supabase; safe to ignore errors)
create extension if not exists "pgcrypto"; -- for gen_random_uuid

-- =========================
-- USER PROFILE
-- =========================
create table if not exists public.user_profiles (
	user_id uuid primary key references auth.users(id) on delete cascade,
	nickname text not null,
	avatar text,
	created_at timestamptz default now()
);

create index if not exists user_profiles_created_idx on public.user_profiles(created_at desc);

-- =========================
-- COMMUNITY POSTS & REACTIONS / REPLIES
-- =========================
create table if not exists public.community_posts (
	id bigserial primary key,
	user_id uuid references auth.users(id) on delete set null,
	community text default 'general',
	content text not null,
	support_count int default 0,
	relate_count int default 0,
	helpful_count int default 0,
	created_at timestamptz default now()
);

create index if not exists community_posts_created_idx on public.community_posts(created_at desc);
create index if not exists community_posts_community_idx on public.community_posts(community);

create table if not exists public.post_reactions (
	id bigserial primary key,
	post_id bigint references public.community_posts(id) on delete cascade,
	user_id uuid references auth.users(id) on delete cascade,
	reaction_type text not null check (reaction_type in ('support','relate','helpful')),
	created_at timestamptz default now(),
	unique (post_id, user_id, reaction_type)
);

create index if not exists post_reactions_post_idx on public.post_reactions(post_id);

create table if not exists public.post_replies (
	id bigserial primary key,
	post_id bigint references public.community_posts(id) on delete cascade,
	user_id uuid references auth.users(id) on delete set null,
	content text not null,
	created_at timestamptz default now()
);

create index if not exists post_replies_post_created_idx on public.post_replies(post_id, created_at asc);

-- =========================
-- POLLS / OPTIONS / VOTES
-- =========================
create table if not exists public.polls (
	id bigserial primary key,
	user_id uuid references auth.users(id) on delete set null,
	question text not null,
	type text,
	category text,
	scale_range int,
	status text default 'open',
	created_at timestamptz default now()
);

create index if not exists polls_created_idx on public.polls(created_at desc);

create table if not exists public.poll_options (
	id bigserial primary key,
	poll_id bigint references public.polls(id) on delete cascade,
	option_id text not null,
	text text not null,
	emoji text,
	created_at timestamptz default now(),
	unique (poll_id, option_id)
);

create table if not exists public.poll_votes (
	id bigserial primary key,
	poll_id bigint references public.polls(id) on delete cascade,
	option_id text not null,
	user_id uuid references auth.users(id) on delete cascade,
	created_at timestamptz default now(),
	unique (poll_id, user_id),
	foreign key (poll_id, option_id) references public.poll_options(poll_id, option_id) on delete cascade
);

create index if not exists poll_votes_poll_idx on public.poll_votes(poll_id);

-- =========================
-- FITCHECK ASSESSMENTS
-- =========================
create table if not exists public.fitcheck_assessments (
	id bigserial primary key,
	user_id uuid references auth.users(id) on delete cascade,
	mood int not null check (mood between 1 and 5),
	stress int not null check (stress between 1 and 5),
	energy int not null check (energy between 1 and 5),
	notes text,
	created_at timestamptz default now()
);

create index if not exists fitcheck_user_created_idx on public.fitcheck_assessments(user_id, created_at desc);

-- =========================
-- CHAT SESSIONS & MESSAGES
-- =========================
create table if not exists public.chat_sessions (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references auth.users(id) on delete cascade,
	started_at timestamptz default now()
);

-- Uniqueness per user per day (best-effort via functional index)
create unique index if not exists chat_sessions_user_day_idx
  on public.chat_sessions(user_id, date_trunc('day', started_at));

create table if not exists public.chat_messages (
	id bigserial primary key,
	session_id uuid references public.chat_sessions(id) on delete cascade,
	user_id uuid references auth.users(id) on delete set null,
	role text not null check (role in ('user','assistant','system')),
	content text not null,
	created_at timestamptz default now()
);

create index if not exists chat_messages_session_created_idx on public.chat_messages(session_id, created_at asc);

-- =========================
-- AUDIT LOGS (future use)
-- =========================
create table if not exists public.audit_logs (
	id bigserial primary key,
	user_id uuid,
	action text not null,
	entity_type text,
	entity_id text,
	meta jsonb,
	created_at timestamptz default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

-- =========================
-- OPTIONAL VIEW (example aggregation placeholder)
-- =========================
create or replace view public.post_reaction_totals as
select p.id as post_id,
	   p.support_count,
	   p.relate_count,
	   p.helpful_count,
	   (p.support_count + p.relate_count + p.helpful_count) as total_reactions
from public.community_posts p;

-- =============================================================
-- RECOMMENDED RLS POLICY TEMPLATES (DO NOT RUN UNTIL READY)
-- =============================================================
-- Enable RLS (uncomment to apply)
-- alter table public.user_profiles enable row level security;
-- alter table public.community_posts enable row level security;
-- alter table public.post_replies enable row level security;
-- alter table public.post_reactions enable row level security;
-- alter table public.polls enable row level security;
-- alter table public.poll_options enable row level security;
-- alter table public.poll_votes enable row level security;
-- alter table public.fitcheck_assessments enable row level security;
-- alter table public.chat_sessions enable row level security;
-- alter table public.chat_messages enable row level security;

-- User profiles
-- create policy "Select own profile" on public.user_profiles for select using (auth.uid() = user_id);
-- create policy "Insert own profile" on public.user_profiles for insert with check (auth.uid() = user_id);
-- create policy "Update own profile" on public.user_profiles for update using (auth.uid() = user_id);

-- Community posts
-- create policy "Read posts" on public.community_posts for select using (true);
-- create policy "Insert post" on public.community_posts for insert with check (auth.uid() = user_id);
-- create policy "Delete own post" on public.community_posts for delete using (auth.uid() = user_id);

-- Post replies
-- create policy "Read replies" on public.post_replies for select using (true);
-- create policy "Insert reply" on public.post_replies for insert with check (auth.uid() = user_id);
-- create policy "Delete own reply" on public.post_replies for delete using (auth.uid() = user_id);

-- Reactions
-- create policy "Read reactions" on public.post_reactions for select using (true);
-- create policy "Insert reaction" on public.post_reactions for insert with check (auth.uid() = user_id);
-- create policy "Delete own reaction" on public.post_reactions for delete using (auth.uid() = user_id);

-- Polls / options / votes
-- create policy "Read polls" on public.polls for select using (true);
-- create policy "Insert poll" on public.polls for insert with check (auth.uid() = user_id);
-- create policy "Delete own poll" on public.polls for delete using (auth.uid() = user_id);
-- create policy "Read poll options" on public.poll_options for select using (true);
-- create policy "Insert poll option" on public.poll_options for insert with check (
--   exists (select 1 from public.polls p where p.id = poll_id and p.user_id = auth.uid())
-- );
-- create policy "Read poll votes" on public.poll_votes for select using (true);
-- create policy "Insert poll vote" on public.poll_votes for insert with check (auth.uid() = user_id);
-- create policy "Delete own poll vote" on public.poll_votes for delete using (auth.uid() = user_id);

-- FitCheck
-- create policy "Read own assessments" on public.fitcheck_assessments for select using (auth.uid() = user_id);
-- create policy "Insert assessment" on public.fitcheck_assessments for insert with check (auth.uid() = user_id);

-- Chat sessions & messages
-- create policy "Read own chat sessions" on public.chat_sessions for select using (auth.uid() = user_id);
-- create policy "Insert chat session" on public.chat_sessions for insert with check (auth.uid() = user_id);
-- create policy "Read session messages" on public.chat_messages for select using (
--   exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = auth.uid())
-- );
-- create policy "Insert user message" on public.chat_messages for insert with check (
--   (role = 'user' and user_id = auth.uid() and exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = auth.uid()))
--   or (role = 'assistant')
-- );

-- =============================================================
-- END SCHEMA
-- =============================================================