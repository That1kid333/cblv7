-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable Row Level Security
alter table drivers enable row level security;
alter table riders enable row level security;
alter table rides enable row level security;
alter table messages enable row level security;

-- Create drivers table
create table drivers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  phone text not null,
  photo text,
  location_id text not null,
  vehicle jsonb not null,
  available boolean default false,
  rating numeric(3,2) default 5.0,
  base_rate numeric(10,2) not null,
  airport_rate numeric(10,2) not null,
  long_distance_rate numeric(10,2) not null,
  subscription jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create riders table
create table riders (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  phone text not null,
  location_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create rides table
create table rides (
  id uuid default uuid_generate_v4() primary key,
  rider_id uuid references riders(id) not null,
  driver_id uuid references drivers(id),
  location_id text not null,
  pickup_location text not null,
  dropoff_location text not null,
  scheduled_time timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  fare numeric(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  ride_id uuid references rides(id) not null,
  sender_type text not null check (sender_type in ('driver', 'rider')),
  sender_id uuid not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_drivers_location on drivers(location_id);
create index idx_drivers_available on drivers(available);
create index idx_rides_status on rides(status);
create index idx_rides_driver on rides(driver_id);
create index idx_rides_rider on rides(rider_id);
create index idx_messages_ride on messages(ride_id);

-- Create RLS policies
-- Drivers policies
create policy "Drivers can view their own profile"
  on drivers for select
  using (auth.uid()::text = id::text);

create policy "Drivers can update their own profile"
  on drivers for update
  using (auth.uid()::text = id::text);

-- Rides policies
create policy "Riders can view their rides"
  on rides for select
  using (rider_id::text = auth.uid()::text);

create policy "Drivers can view assigned rides"
  on rides for select
  using (driver_id::text = auth.uid()::text);

create policy "Anyone can create a ride"
  on rides for insert
  with check (true);

-- Messages policies
create policy "Participants can view ride messages"
  on messages for select
  using (
    exists (
      select 1 from rides
      where rides.id = messages.ride_id
      and (rides.driver_id::text = auth.uid()::text or rides.rider_id::text = auth.uid()::text)
    )
  );

create policy "Participants can create messages"
  on messages for insert
  with check (
    exists (
      select 1 from rides
      where rides.id = messages.ride_id
      and (rides.driver_id::text = auth.uid()::text or rides.rider_id::text = auth.uid()::text)
    )
  );

-- Create functions
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger set_drivers_updated_at
  before update on drivers
  for each row
  execute function update_updated_at_column();

create trigger set_riders_updated_at
  before update on riders
  for each row
  execute function update_updated_at_column();

create trigger set_rides_updated_at
  before update on rides
  for each row
  execute function update_updated_at_column();