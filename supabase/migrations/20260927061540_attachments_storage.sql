-- Private bucket for tenant ID-proof scans and repair photos.
-- Paths: id-proofs/<tenant_id>/<file>, repairs/<unit_id>/<file>
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "staff manage id-proofs"
  on storage.objects for all to authenticated
  using (bucket_id = 'attachments' and (storage.foldername(name))[1] = 'id-proofs' and public.is_staff())
  with check (bucket_id = 'attachments' and (storage.foldername(name))[1] = 'id-proofs' and public.is_staff());

create policy "signed-in read repair photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'attachments' and (storage.foldername(name))[1] = 'repairs');

create policy "signed-in upload repair photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'attachments' and (storage.foldername(name))[1] = 'repairs');

create policy "owner delete attachments"
  on storage.objects for delete to authenticated
  using (bucket_id = 'attachments' and public.is_owner());
