-- vacant_units() needs to return the floor too, so applicants can see it
-- (units.floor was added after this function was first created).
drop function public.vacant_units();

create function public.vacant_units()
returns table (unit_id bigint, building text, unit_number text, floor smallint, rent numeric)
language sql stable security definer set search_path = ''
as $$
  select u.id, b.name, u.unit_number, u.floor, u.rent
  from public.units u
  join public.buildings b on b.id = u.building_id
  where not exists (select 1 from public.tenancies ty
                    where ty.unit_id = u.id
                      and (ty.end_date is null or ty.end_date >= current_date))
  order by b.name, u.floor, u.unit_number
$$;

grant execute on function public.vacant_units() to anon, authenticated;
