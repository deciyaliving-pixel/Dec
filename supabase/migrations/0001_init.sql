-- StayKhoj core schema
-- Enums mirror shared/src/enums.ts — keep both in sync if you change either.

create type region_slug as enum ('western-ghats-konkan', 'kerala', 'meghalaya-northeast');
create type season as enum ('monsoon', 'winter', 'summer', 'shoulder');
create type mood as enum ('nature-adventure', 'food-culture', 'weekend-escape');
create type field_note_category as enum ('mountains', 'coastlines', 'food-trails', 'weekend-routes');
create type content_status as enum ('draft', 'preview', 'published');
create type reporting_status as enum ('planning_draft', 'verified_firsthand');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  is_editor boolean not null default false,
  created_at timestamptz not null default now()
);

create table authors (
  id text primary key,
  name text not null,
  bio text not null,
  avatar_url text
);

create table regions (
  slug region_slug primary key,
  name text not null,
  tagline text not null,
  summary text not null,
  seasonal_overview text not null,
  hero_image text not null,
  hero_image_alt text not null,
  hero_image_credit jsonb,
  meta_description text not null,
  canonical_url text not null
);

-- Shared editorial columns are duplicated across destinations/field_notes/routes
-- (rather than a single polymorphic table) so Postgres check constraints can enforce
-- the publish-requires-verified-reporting and time-sensitive-requires-last-checked
-- rules per content type with simple, readable CHECKs.

create table destinations (
  id text primary key,
  slug text unique not null,
  title text not null,
  dek text not null,
  region_slugs region_slug[] not null,
  seasons season[] not null,
  moods mood[] not null,
  lat double precision not null,
  lng double precision not null,
  why_go text not null,
  who_it_suits text not null,
  when_to_visit text not null,
  how_long_to_plan text not null,
  how_to_arrive text not null,
  what_to_eat_notice_avoid text not null,
  responsible_travel_notes text not null,
  body text not null,
  hero_image text not null,
  hero_image_alt text not null,
  hero_image_credit jsonb,
  meta_description text not null,
  canonical_url text not null,
  author_id text references authors (id),
  publish_date date not null,
  has_time_sensitive_info boolean not null default false,
  last_checked_date date,
  reporting_status reporting_status not null default 'planning_draft',
  status content_status not null default 'draft',
  is_seed_content boolean not null default false,
  related_destination_slugs text[] not null default '{}',
  related_planning_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destinations_time_sensitive_needs_checked_date
    check (not has_time_sensitive_info or last_checked_date is not null),
  constraint destinations_publish_needs_verified_reporting
    check (status <> 'published' or reporting_status = 'verified_firsthand')
);

create table field_notes (
  id text primary key,
  slug text unique not null,
  title text not null,
  dek text not null,
  category field_note_category not null,
  region_slugs region_slug[] not null,
  seasons season[] not null,
  moods mood[] not null,
  body text not null,
  read_time_minutes integer not null,
  hero_image text not null,
  hero_image_alt text not null,
  hero_image_credit jsonb,
  meta_description text not null,
  canonical_url text not null,
  author_id text references authors (id),
  publish_date date not null,
  has_time_sensitive_info boolean not null default false,
  last_checked_date date,
  reporting_status reporting_status not null default 'planning_draft',
  status content_status not null default 'draft',
  is_seed_content boolean not null default false,
  related_destination_slugs text[] not null default '{}',
  related_planning_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint field_notes_time_sensitive_needs_checked_date
    check (not has_time_sensitive_info or last_checked_date is not null),
  constraint field_notes_publish_needs_verified_reporting
    check (status <> 'published' or reporting_status = 'verified_firsthand')
);

create table routes (
  id text primary key,
  slug text unique not null,
  title text not null,
  dek text not null,
  region_slugs region_slug[] not null,
  seasons season[] not null,
  moods mood[] not null,
  duration_days integer not null,
  stops jsonb not null,
  body text not null,
  hero_image text not null,
  hero_image_alt text not null,
  hero_image_credit jsonb,
  meta_description text not null,
  canonical_url text not null,
  author_id text references authors (id),
  publish_date date not null,
  has_time_sensitive_info boolean not null default false,
  last_checked_date date,
  reporting_status reporting_status not null default 'planning_draft',
  status content_status not null default 'draft',
  is_seed_content boolean not null default false,
  related_destination_slugs text[] not null default '{}',
  related_planning_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint routes_time_sensitive_needs_checked_date
    check (not has_time_sensitive_info or last_checked_date is not null),
  constraint routes_publish_needs_verified_reporting
    check (status <> 'published' or reporting_status = 'verified_firsthand')
);

create table favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  destination_slug text not null references destinations (slug) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_slug)
);

create table newsletter_signups (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Row Level Security -------------------------------------------------------

alter table profiles enable row level security;
alter table authors enable row level security;
alter table regions enable row level security;
alter table destinations enable row level security;
alter table field_notes enable row level security;
alter table routes enable row level security;
alter table favorites enable row level security;
alter table newsletter_signups enable row level security;

create policy "public can read authors" on authors for select using (true);
create policy "public can read regions" on regions for select using (true);

-- Draft/preview content must never be reachable by anonymous readers — only
-- published rows are exposed to the anon role; editors (is_editor = true) can read
-- and write everything through the service-backed Studio API.
create policy "public can read published destinations" on destinations
  for select using (status = 'published');
create policy "public can read published field_notes" on field_notes
  for select using (status = 'published');
create policy "public can read published routes" on routes
  for select using (status = 'published');

create policy "editors can read all destinations" on destinations
  for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor));
create policy "editors can read all field_notes" on field_notes
  for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor));
create policy "editors can read all routes" on routes
  for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor));

create policy "editors can write destinations" on destinations
  for all using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor));
create policy "editors can write field_notes" on field_notes
  for all using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor));
create policy "editors can write routes" on routes
  for all using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_editor));

create policy "users manage own favorites" on favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage own profile" on profiles
  for select using (auth.uid() = id);
create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "anyone can sign up for the newsletter" on newsletter_signups
  for insert with check (true);

-- Keep profiles in sync with new auth users.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
