-- Behind the Mask: anonymous guide feedback.
-- Run once in the Supabase SQL editor (or via `supabase db push`).
-- Stores only three allowlisted answers and consent. No names, emails, IPs,
-- user agents, cookies or device identifiers are stored.

create table if not exists public.guide_feedback (
  id uuid primary key default gen_random_uuid(),
  usefulness text not null check (usefulness in ('very_useful', 'somewhat_useful', 'not_very_useful', 'not_useful_at_all')),
  learning text not null check (learning in ('yes_definitely', 'yes_a_little', 'no_not_really', 'no_nothing_new')),
  intention text not null check (intention in ('definitely', 'probably', 'probably_not', 'definitely_not')),
  consent boolean not null check (consent = true),
  created_at timestamptz not null default now()
);

create index if not exists guide_feedback_created_at_idx on public.guide_feedback (created_at);

-- Row Level Security: enabled with NO policies, so anon/authenticated roles
-- cannot read or write rows. Only the server-side secret key (service_role,
-- which bypasses RLS) can access the table.
alter table public.guide_feedback enable row level security;

revoke all on table public.guide_feedback from anon, authenticated;

-- Aggregated counts only. Individual rows are never returned to any client.
-- Executed only by the server-side report script using the secret key.
create or replace function public.guide_feedback_counts()
returns table (question text, answer text, total bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select 'usefulness'::text, usefulness, count(*)::bigint from public.guide_feedback group by usefulness
  union all
  select 'learning'::text, learning, count(*)::bigint from public.guide_feedback group by learning
  union all
  select 'intention'::text, intention, count(*)::bigint from public.guide_feedback group by intention;
$$;

revoke all on function public.guide_feedback_counts() from public, anon, authenticated;
grant execute on function public.guide_feedback_counts() to service_role;
