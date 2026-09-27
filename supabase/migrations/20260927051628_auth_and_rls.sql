-- =============================================================================
-- Manjunatha Residency — sign-up hook and row level security
--
-- owner   : everything
-- manager : units, tenancies, bills, payments, repairs, expenses of the
--           buildings where buildings.manager_id = them; all tenant records
-- tenant  : their own tenancy, bills, payments, readings; raise repairs
-- anyone signed in: see vacant units and apply
-- Only the owner can delete.
-- =============================================================================

-- New login -> profile with role 'tenant'. Make the first owner once in the
-- SQL editor: update public.profiles set role = 'owner' where id = '...';
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.phone);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Access helpers (security definer so policies don't recurse through RLS)
-- -----------------------------------------------------------------------------
create function public.my_role()
returns public.user_role
language sql stable security definer set search_path = ''
as $$ select role from public.profiles where id = auth.uid() $$;

create function public.is_owner()
returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce(public.my_role() = 'owner', false) $$;

create function public.is_staff()
returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce(public.my_role() in ('owner', 'manager'), false) $$;

create function public.manages_building(p_building_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.is_owner()
      or exists (select 1 from public.buildings b
                 where b.id = p_building_id and b.manager_id = auth.uid()
                   and public.my_role() = 'manager')
$$;

create function public.manages_unit(p_unit_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.manages_building((select building_id from public.units where id = p_unit_id))
$$;

create function public.manages_tenancy(p_tenancy_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.manages_unit((select unit_id from public.tenancies where id = p_tenancy_id))
$$;

create function public.is_my_tenancy(p_tenancy_id bigint)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.tenancies ty
                 join public.tenants t on t.id = ty.tenant_id
                 where ty.id = p_tenancy_id and t.profile_id = auth.uid())
$$;

-- Unit the signed-in tenant lives in today (null if none).
create function public.my_current_unit()
returns bigint
language sql stable security definer set search_path = ''
as $$
  select ty.unit_id
  from public.tenancies ty
  join public.tenants t on t.id = ty.tenant_id
  where t.profile_id = auth.uid()
    and ty.start_date <= current_date
    and (ty.end_date is null or ty.end_date >= current_date)
$$;

-- Only the owner can change roles.
create function public.guard_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_owner() then
    raise exception 'Only the owner can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_role_change();

-- Vacant units, for people applying (they can't see tenancies).
create function public.vacant_units()
returns table (unit_id bigint, building text, unit_number text, rent numeric)
language sql stable security definer set search_path = ''
as $$
  select u.id, b.name, u.unit_number, u.rent
  from public.units u
  join public.buildings b on b.id = u.building_id
  where not exists (select 1 from public.tenancies ty
                    where ty.unit_id = u.id
                      and (ty.end_date is null or ty.end_date >= current_date))
  order by b.name, u.unit_number
$$;

-- -----------------------------------------------------------------------------
-- Policies
-- -----------------------------------------------------------------------------
alter table public.profiles             enable row level security;
alter table public.buildings            enable row level security;
alter table public.units                enable row level security;
alter table public.tenants              enable row level security;
alter table public.applications         enable row level security;
alter table public.tenancies            enable row level security;
alter table public.meter_readings       enable row level security;
alter table public.bills                enable row level security;
alter table public.payments             enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.expenses             enable row level security;

-- profiles
create policy "read own, staff read all" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_staff());
create policy "update own, owner updates all" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_owner()) with check (id = auth.uid() or public.is_owner());

-- buildings
create policy "signed-in read" on public.buildings
  for select to authenticated using (true);
create policy "owner insert" on public.buildings
  for insert to authenticated with check (public.is_owner());
create policy "owner update" on public.buildings
  for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner delete" on public.buildings
  for delete to authenticated using (public.is_owner());

-- units
create policy "signed-in read" on public.units
  for select to authenticated using (true);
create policy "staff insert" on public.units
  for insert to authenticated with check (public.manages_building(building_id));
create policy "staff update" on public.units
  for update to authenticated
  using (public.manages_building(building_id)) with check (public.manages_building(building_id));
create policy "owner delete" on public.units
  for delete to authenticated using (public.is_owner());

-- tenants
create policy "staff or self read" on public.tenants
  for select to authenticated using (public.is_staff() or profile_id = auth.uid());
create policy "staff insert" on public.tenants
  for insert to authenticated with check (public.is_staff());
create policy "staff update" on public.tenants
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "owner delete" on public.tenants
  for delete to authenticated using (public.is_owner());

-- applications
create policy "applicant or staff read" on public.applications
  for select to authenticated using (profile_id = auth.uid() or public.manages_unit(unit_id));
create policy "anyone signed in applies" on public.applications
  for insert to authenticated with check (profile_id = auth.uid() and status = 'pending');
create policy "staff update" on public.applications
  for update to authenticated
  using (public.manages_unit(unit_id)) with check (public.manages_unit(unit_id));
create policy "owner delete" on public.applications
  for delete to authenticated using (public.is_owner());

-- tenancies
create policy "staff or own read" on public.tenancies
  for select to authenticated using (public.manages_unit(unit_id) or public.is_my_tenancy(id));
create policy "staff insert" on public.tenancies
  for insert to authenticated with check (public.manages_unit(unit_id));
create policy "staff update" on public.tenancies
  for update to authenticated
  using (public.manages_unit(unit_id)) with check (public.manages_unit(unit_id));
create policy "owner delete" on public.tenancies
  for delete to authenticated using (public.is_owner());

-- meter_readings: tenants see readings taken during their own stay
create policy "staff or own stay read" on public.meter_readings
  for select to authenticated
  using (
    public.manages_unit(unit_id)
    or exists (select 1 from public.tenancies ty
               where ty.unit_id = meter_readings.unit_id
                 and public.is_my_tenancy(ty.id)
                 and meter_readings.reading_date between ty.start_date
                                                     and coalesce(ty.end_date, 'infinity'::date))
  );
create policy "staff insert" on public.meter_readings
  for insert to authenticated with check (public.manages_unit(unit_id));
create policy "staff update" on public.meter_readings
  for update to authenticated
  using (public.manages_unit(unit_id)) with check (public.manages_unit(unit_id));
create policy "owner delete" on public.meter_readings
  for delete to authenticated using (public.is_owner());

-- bills
create policy "staff or own read" on public.bills
  for select to authenticated
  using (public.manages_tenancy(tenancy_id) or public.is_my_tenancy(tenancy_id));
create policy "staff insert" on public.bills
  for insert to authenticated with check (public.manages_tenancy(tenancy_id));
create policy "staff update" on public.bills
  for update to authenticated
  using (public.manages_tenancy(tenancy_id)) with check (public.manages_tenancy(tenancy_id));
create policy "owner delete" on public.bills
  for delete to authenticated using (public.is_owner());

-- payments: visible with the bill; only staff record them
create policy "read with bill" on public.payments
  for select to authenticated
  using (exists (select 1 from public.bills b where b.id = payments.bill_id));
create policy "staff insert" on public.payments
  for insert to authenticated
  with check (public.manages_tenancy((select tenancy_id from public.bills where id = payments.bill_id)));
create policy "staff update" on public.payments
  for update to authenticated
  using (public.manages_tenancy((select tenancy_id from public.bills where id = payments.bill_id)))
  with check (public.manages_tenancy((select tenancy_id from public.bills where id = payments.bill_id)));
create policy "owner delete" on public.payments
  for delete to authenticated using (public.is_owner());

-- maintenance_requests
create policy "staff, raiser or current tenant read" on public.maintenance_requests
  for select to authenticated
  using (public.manages_unit(unit_id) or raised_by = auth.uid() or unit_id = public.my_current_unit());
create policy "staff or current tenant raise" on public.maintenance_requests
  for insert to authenticated
  with check (public.manages_unit(unit_id)
              or (raised_by = auth.uid() and status = 'open' and unit_id = public.my_current_unit()));
create policy "staff update" on public.maintenance_requests
  for update to authenticated
  using (public.manages_unit(unit_id)) with check (public.manages_unit(unit_id));
create policy "owner delete" on public.maintenance_requests
  for delete to authenticated using (public.is_owner());

-- expenses
create policy "staff read" on public.expenses
  for select to authenticated using (public.manages_building(building_id));
create policy "staff insert" on public.expenses
  for insert to authenticated with check (public.manages_building(building_id));
create policy "staff update" on public.expenses
  for update to authenticated
  using (public.manages_building(building_id)) with check (public.manages_building(building_id));
create policy "owner delete" on public.expenses
  for delete to authenticated using (public.is_owner());

-- -----------------------------------------------------------------------------
-- Function permissions
-- -----------------------------------------------------------------------------
revoke execute on function public.create_bill(bigint, date, numeric, numeric, text) from public, anon;
grant execute on function public.create_bill(bigint, date, numeric, numeric, text) to authenticated;
grant execute on function public.vacant_units() to anon, authenticated;
