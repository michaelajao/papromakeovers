-- Availability: per-date list of open time slots (e.g., ["09:00","11:00",...])
create table if not exists public.availability (
  date date primary key,
  slots text[] not null default '{}'::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Bookings: each confirmed booking; prevent duplicates via unique(date,time)
create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  service text not null,
  name text not null,
  email text not null,
  phone text not null,
  notes text default '',
  date date not null,
  time text not null,
  status text default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed', 'no_show')),
  price numeric(10,2),
  constraint bookings_unique_slot unique (date, time),
  constraint valid_email check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
  constraint valid_phone check (phone ~ '^[\+]?[0-9\s\-\(\)]{10,}$'),
  constraint valid_time check (time ~ '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
);

-- Performance indexes
create index if not exists idx_availability_date on public.availability(date);
create index if not exists idx_bookings_date on public.bookings(date);
create index if not exists idx_bookings_email on public.bookings(email);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_created_at on public.bookings(created_at);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for auto-updating timestamps
create or replace trigger update_availability_updated_at
  before update on public.availability
  for each row
  execute function update_updated_at_column();

create or replace trigger update_bookings_updated_at
  before update on public.bookings
  for each row
  execute function update_updated_at_column();

-- RLS policies for production security
alter table public.availability enable row level security;
alter table public.bookings enable row level security;

-- Read availability publicly
create policy "Public read availability" on public.availability for select using (true);

-- Only service role can modify availability
create policy "Service role can modify availability" on public.availability 
  for all to service_role using (true) with check (true);

-- Bookings policies
create policy "Service role can manage bookings" on public.bookings 
  for all to service_role using (true) with check (true);

-- Optional: Allow users to read their own bookings (if implementing user auth later)
-- create policy "Users can read own bookings" on public.bookings 
--   for select using (auth.email() = email);

