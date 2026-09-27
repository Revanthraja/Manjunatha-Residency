-- The original policy only checked that the bill row exists (always true),
-- not that the caller may see it — any signed-in user could read every
-- tenant's payments. Restrict it the same way bills.select is restricted.
drop policy "read with bill" on public.payments;

create policy "staff or own read" on public.payments
  for select to authenticated
  using (
    exists (
      select 1 from public.bills b
      where b.id = payments.bill_id
        and (public.manages_tenancy(b.tenancy_id) or public.is_my_tenancy(b.tenancy_id))
    )
  );
