-- =============================================================================
-- Manjunatha Residency — schema
--
-- Monthly flow: tenant moves into a unit (tenancy) -> meter is read ->
-- a bill is made (rent + electricity + other) -> payments are recorded.
-- Every unit is a 1BHK house rented whole. No lease agreements.
-- =============================================================================

create extension if not exists btree_gist with schema extensions;

create type public.user_role as enum ('owner', 'manager', 'tenant');
create type public.application_status as enum ('pending', 'approved', 'rejected');
create type public.payment_method as enum ('cash', 'upi', 'bank_transfer', 'cheque');
create type public.maintenance_status as enum ('open', 'in_progress', 'resolved');

-- One row per app login. Created automatically on sign-up (see auth migration).
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null,
  phone      text,
  role       public.user_role not null default 'tenant',
  created_at timestamptz not null default now()
);

create table public.buildings (
  id               bigint generated always as identity primary key,
  name             text not null unique,
  address          text not null,
  manager_id       uuid references public.profiles (id) on delete set null,
  electricity_rate numeric(6, 2) not null default 0 check (electricity_rate >= 0),  -- ₹ per unit
  created_at       timestamptz not null default now()
);

create table public.units (
  id          bigint generated always as identity primary key,
  building_id bigint not null references public.buildings (id),
  unit_number text not null,                                   -- door number
  rent        numeric(10, 2) not null check (rent >= 0),       -- asking rent
  created_at  timestamptz not null default now(),
  unique (building_id, unit_number)
);

-- A person who rents. May not have an app login (profile_id) yet.
create table public.tenants (
  id                bigint generated always as identity primary key,
  profile_id        uuid unique references public.profiles (id) on delete set null,
  full_name         text not null,
  phone             text not null,
  permanent_address text,
  id_proof_path     text,                                      -- Storage path of ID proof scan
  created_at        timestamptz not null default now()
);

create table public.applications (
  id           bigint generated always as identity primary key,
  unit_id      bigint not null references public.units (id),
  profile_id   uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  full_name    text not null,
  phone        text not null,
  move_in_date date,
  message      text,
  status       public.application_status not null default 'pending',
  created_at   timestamptz not null default now()
);

create index applications_unit_idx on public.applications (unit_id);

-- A tenant living in a unit. Current while end_date is null (or in the future).
create table public.tenancies (
  id             bigint generated always as identity primary key,
  unit_id        bigint not null references public.units (id),
  tenant_id      bigint not null references public.tenants (id),
  rent           numeric(10, 2) not null check (rent >= 0),
  deposit        numeric(10, 2) not null default 0 check (deposit >= 0),
  start_date     date not null,
  end_date       date,                                         -- move-out
  deposit_refund numeric(10, 2),                               -- returned at move-out
  created_at     timestamptz not null default now(),
  check (end_date is null or end_date >= start_date),
  check (deposit_refund is null or deposit_refund between 0 and deposit),
  -- no two tenancies of the same unit may overlap
  exclude using gist (unit_id with =, daterange(start_date, end_date, '[]') with &&)
);

create index tenancies_tenant_idx on public.tenancies (tenant_id);

create table public.meter_readings (
  id           bigint generated always as identity primary key,
  unit_id      bigint not null references public.units (id),
  reading      numeric(10, 2) not null check (reading >= 0),
  reading_date date not null default current_date,
  created_at   timestamptz not null default now(),
  unique (unit_id, reading_date)
);

-- One bill per tenancy per month.
create table public.bills (
  id          bigint generated always as identity primary key,
  tenancy_id  bigint not null references public.tenancies (id),
  month       date not null check (extract(day from month) = 1),  -- 1st of the month
  rent        numeric(10, 2) not null check (rent >= 0),
  electricity numeric(10, 2) not null default 0 check (electricity >= 0),
  other       numeric(10, 2) not null default 0 check (other >= 0),
  note        text,                                                -- what "other" is for
  total       numeric(10, 2) generated always as (rent + electricity + other) stored,
  due_date    date not null,
  created_at  timestamptz not null default now(),
  unique (tenancy_id, month)
);

-- Payment history. The id doubles as the receipt number.
create table public.payments (
  id          bigint generated always as identity primary key,
  bill_id     bigint not null references public.bills (id),
  amount      numeric(10, 2) not null check (amount > 0),
  method      public.payment_method not null,
  paid_on     date not null default current_date,
  reference   text,                                            -- UPI / cheque / bank ref
  received_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now()
);

create index payments_bill_idx on public.payments (bill_id);

create table public.maintenance_requests (
  id          bigint generated always as identity primary key,
  unit_id     bigint not null references public.units (id),
  raised_by   uuid references public.profiles (id) on delete set null default auth.uid(),
  description text not null,
  photo_path  text,
  status      public.maintenance_status not null default 'open',
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index maintenance_requests_unit_idx on public.maintenance_requests (unit_id);

create table public.expenses (
  id          bigint generated always as identity primary key,
  building_id bigint not null references public.buildings (id),
  category    text not null,                                   -- e.g. Repairs, Water, Salary, Tax
  amount      numeric(10, 2) not null check (amount > 0),
  spent_on    date not null default current_date,
  note        text,
  created_at  timestamptz not null default now()
);

create index expenses_building_idx on public.expenses (building_id, spent_on);

-- -----------------------------------------------------------------------------
-- Each bill with what has been paid and what is left.
-- -----------------------------------------------------------------------------
create view public.bill_summary
with (security_invoker = true) as
select
  b.id                                    as bill_id,
  b.tenancy_id,
  b.month,
  b.total,
  b.due_date,
  coalesce(sum(p.amount), 0)              as paid,
  b.total - coalesce(sum(p.amount), 0)    as balance,
  case
    when b.total - coalesce(sum(p.amount), 0) <= 0 then 'paid'
    when current_date > b.due_date then 'overdue'
    when sum(p.amount) > 0 then 'partial'
    else 'unpaid'
  end                                     as status
from public.bills b
left join public.payments p on p.bill_id = b.id
group by b.id;

-- -----------------------------------------------------------------------------
-- Make a month's bill: records the meter reading and charges
-- (reading - previous reading) x building rate as electricity.
-- -----------------------------------------------------------------------------
create function public.create_bill(
  p_tenancy_id    bigint,
  p_month         date,
  p_meter_reading numeric default null,
  p_other         numeric default 0,
  p_note          text default null
)
returns public.bills
language plpgsql
set search_path = ''
as $$
declare
  v_tenancy     public.tenancies;
  v_rate        numeric;
  v_previous    numeric;
  v_electricity numeric := 0;
  v_month       date := date_trunc('month', p_month)::date;
  v_bill        public.bills;
begin
  select * into v_tenancy from public.tenancies where id = p_tenancy_id;
  if v_tenancy.id is null then
    raise exception 'Tenancy % not found', p_tenancy_id;
  end if;

  if p_meter_reading is not null then
    select mr.reading into v_previous
    from public.meter_readings mr
    where mr.unit_id = v_tenancy.unit_id and mr.reading_date < current_date
    order by mr.reading_date desc
    limit 1;

    if p_meter_reading < v_previous then
      raise exception 'Reading % is lower than the previous reading %', p_meter_reading, v_previous;
    end if;

    insert into public.meter_readings (unit_id, reading)
    values (v_tenancy.unit_id, p_meter_reading)
    on conflict (unit_id, reading_date) do update set reading = excluded.reading;

    select b.electricity_rate into v_rate
    from public.units u join public.buildings b on b.id = u.building_id
    where u.id = v_tenancy.unit_id;

    -- first ever reading is just the starting point
    v_electricity := coalesce((p_meter_reading - v_previous) * v_rate, 0);
  end if;

  insert into public.bills (tenancy_id, month, rent, electricity, other, note, due_date)
  values (p_tenancy_id, v_month, v_tenancy.rent, round(v_electricity, 2),
          coalesce(p_other, 0), p_note, v_month + 4)  -- due on the 5th
  returning * into v_bill;

  return v_bill;
end;
$$;
