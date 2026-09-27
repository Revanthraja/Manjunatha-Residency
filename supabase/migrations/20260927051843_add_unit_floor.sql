-- Floor each house is on. 0 = ground floor.
alter table public.units
  add column floor smallint not null default 0 check (floor >= 0);
