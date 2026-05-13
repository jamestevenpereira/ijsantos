
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text not null,
  category text not null,
  title text,
  created_at timestamptz not null default now()
);

create index portfolio_items_category_idx on public.portfolio_items (category);
create index portfolio_items_created_at_idx on public.portfolio_items (created_at desc);

alter table public.portfolio_items enable row level security;

create policy "Public can read portfolio items"
  on public.portfolio_items for select
  using (true);

create policy "Authenticated can insert portfolio items"
  on public.portfolio_items for insert
  to authenticated
  with check (true);

create policy "Authenticated can delete portfolio items"
  on public.portfolio_items for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "Public can view portfolio files"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "Authenticated can upload portfolio files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio');

create policy "Authenticated can delete portfolio files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio');
