-- Hannah's Calendar App — Supabase Schema
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default '',
  role text not null default 'parent' check (role in ('parent', 'child')),
  family_id uuid,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Families
create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Mi Familia',
  invite_code text unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  theme text not null default 'pink' check (theme in ('pink', 'blue')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Add FK from profiles to families
alter table public.profiles
  add constraint profiles_family_fk foreign key (family_id) references public.families(id);

-- 3. Children (managed by parents, don't need auth accounts)
create table public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  theme text not null default 'pink' check (theme in ('pink', 'blue')),
  created_at timestamptz not null default now()
);

-- 4. Routines (template blocks: morning, afternoon, night)
create table public.routines (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  block_id text not null, -- 'manana', 'tarde', 'noche'
  title text not null,
  icon text not null default 'sun',
  bg_color text not null default 'bg-morning-yellow',
  accent_color text not null default 'border-yellow-400',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 5. Activities (belong to a routine block)
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  name_es text not null,
  name_en text not null default '',
  icon text not null default 'star',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. Completions (daily activity tracking)
create table public.completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  completed_date date not null default current_date,
  tokens_earned int not null default 1,
  created_at timestamptz not null default now(),
  unique(child_id, activity_id, completed_date)
);

-- 7. Token transactions (full history)
create table public.token_transactions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  amount int not null, -- positive = earned, negative = spent/consequence
  reason text not null, -- 'activity', 'routine_bonus', 'day_bonus', 'redemption', 'consequence'
  reference_id uuid, -- activity_id or reward_id
  created_at timestamptz not null default now()
);

-- 8. Rewards catalog (per family)
create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name_es text not null,
  icon text not null default 'gift',
  price int not null default 5,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 9. Redemptions
create table public.redemptions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  reward_id uuid not null references public.rewards(id) on delete cascade,
  tokens_spent int not null,
  redeemed_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.routines enable row level security;
alter table public.activities enable row level security;
alter table public.completions enable row level security;
alter table public.token_transactions enable row level security;
alter table public.rewards enable row level security;
alter table public.redemptions enable row level security;

-- Profiles: users see their own + family members
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can view family members" on public.profiles
  for select using (
    family_id in (select family_id from public.profiles where id = auth.uid())
  );

-- Families: members can view, creator can update
create policy "Family members can view" on public.families
  for select using (
    id in (select family_id from public.profiles where id = auth.uid())
  );

create policy "Creator can update family" on public.families
  for update using (created_by = auth.uid());

create policy "Authenticated users can create families" on public.families
  for insert with check (auth.uid() is not null);

-- Children: family members can CRUD
create policy "Family members can view children" on public.children
  for select using (
    family_id in (select family_id from public.profiles where id = auth.uid())
  );

create policy "Family members can manage children" on public.children
  for all using (
    family_id in (select family_id from public.profiles where id = auth.uid())
  );

-- Routines: via child's family
create policy "Family can manage routines" on public.routines
  for all using (
    child_id in (
      select c.id from public.children c
      join public.profiles p on p.family_id = c.family_id
      where p.id = auth.uid()
    )
  );

-- Activities: via routine's child's family
create policy "Family can manage activities" on public.activities
  for all using (
    routine_id in (
      select r.id from public.routines r
      join public.children c on c.id = r.child_id
      join public.profiles p on p.family_id = c.family_id
      where p.id = auth.uid()
    )
  );

-- Completions: via child's family
create policy "Family can manage completions" on public.completions
  for all using (
    child_id in (
      select c.id from public.children c
      join public.profiles p on p.family_id = c.family_id
      where p.id = auth.uid()
    )
  );

-- Token transactions: via child's family
create policy "Family can view token transactions" on public.token_transactions
  for all using (
    child_id in (
      select c.id from public.children c
      join public.profiles p on p.family_id = c.family_id
      where p.id = auth.uid()
    )
  );

-- Rewards: family members
create policy "Family can manage rewards" on public.rewards
  for all using (
    family_id in (select family_id from public.profiles where id = auth.uid())
  );

-- Redemptions: via child's family
create policy "Family can manage redemptions" on public.redemptions
  for all using (
    child_id in (
      select c.id from public.children c
      join public.profiles p on p.family_id = c.family_id
      where p.id = auth.uid()
    )
  );

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Get token balance for a child (sum of all transactions)
create or replace function public.get_token_balance(p_child_id uuid)
returns int as $$
  select coalesce(sum(amount), 0)::int
  from public.token_transactions
  where child_id = p_child_id;
$$ language sql security definer;
