-- Services: admin-managed list of makeup services shown on the site
create table if not exists public.services (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  category text not null,
  description text,
  features text[] not null default '{}',
  price_from numeric(10,2),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists idx_services_active_sort on public.services(is_active, sort_order);

-- Testimonials: admin-managed social proof
create table if not exists public.testimonials (
  id bigint generated always as identity primary key,
  client_name text not null,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  service_slug text,
  is_featured boolean not null default true,
  sort_order int not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists idx_testimonials_featured_sort on public.testimonials(is_featured, sort_order);

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

create or replace trigger update_services_updated_at
  before update on public.services
  for each row
  execute function update_updated_at_column();

create or replace trigger update_testimonials_updated_at
  before update on public.testimonials
  for each row
  execute function update_updated_at_column();

-- RLS policies for production security
alter table public.availability enable row level security;
alter table public.bookings enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;

-- Read availability publicly
create policy "Public read availability" on public.availability for select using (true);

-- Only service role can modify availability
create policy "Service role can modify availability" on public.availability
  for all to service_role using (true) with check (true);

-- Bookings policies
create policy "Service role can manage bookings" on public.bookings
  for all to service_role using (true) with check (true);

-- Services policies: public can read active services; service role manages
create policy "Public read active services" on public.services
  for select using (is_active = true);
create policy "Service role can manage services" on public.services
  for all to service_role using (true) with check (true);

-- Testimonials policies: public can read featured; service role manages
create policy "Public read featured testimonials" on public.testimonials
  for select using (is_featured = true);
create policy "Service role can manage testimonials" on public.testimonials
  for all to service_role using (true) with check (true);

-- Optional: Allow users to read their own bookings (if implementing user auth later)
-- create policy "Users can read own bookings" on public.bookings 
--   for select using (auth.email() = email);

