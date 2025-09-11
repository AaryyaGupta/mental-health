-- Initial migration: matches current schema.sql (excluding policy comments)
-- Generated: 2025-09-12

create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
	user_id uuid primary key references auth.users(id) on delete cascade,
	nickname text not null,
	avatar text,
	created_at timestamptz default now()
);
create index if not exists user_profiles_created_idx on public.user_profiles(created_at desc);

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

create table if not exists public.chat_sessions (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references auth.users(id) on delete cascade,
	started_at timestamptz default now()
);
create unique index if not exists chat_sessions_user_day_idx on public.chat_sessions(user_id, date_trunc('day', started_at));

create table if not exists public.chat_messages (
	id bigserial primary key,
	session_id uuid references public.chat_sessions(id) on delete cascade,
	user_id uuid references auth.users(id) on delete set null,
	role text not null check (role in ('user','assistant','system')),
	content text not null,
	created_at timestamptz default now()
);
create index if not exists chat_messages_session_created_idx on public.chat_messages(session_id, created_at asc);

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

create or replace view public.post_reaction_totals as
select p.id as post_id,
       p.support_count,
       p.relate_count,
       p.helpful_count,
       (p.support_count + p.relate_count + p.helpful_count) as total_reactions
from public.community_posts p;
