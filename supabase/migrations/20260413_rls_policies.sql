alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
  or exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
)
with check (
  auth.uid() = id
  or exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "profiles_insert_self_or_admin" on public.profiles;
create policy "profiles_insert_self_or_admin"
on public.profiles
for insert
to authenticated
with check (
  auth.uid() = id
  or exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "categories_read_authenticated" on public.categories;
create policy "categories_read_authenticated"
on public.categories
for select
to authenticated
using (true);

drop policy if exists "categories_admin_insert" on public.categories;
create policy "categories_admin_insert"
on public.categories
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update"
on public.categories
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete"
on public.categories
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "brands_read_authenticated" on public.brands;
create policy "brands_read_authenticated"
on public.brands
for select
to authenticated
using (true);

drop policy if exists "brands_admin_insert" on public.brands;
create policy "brands_admin_insert"
on public.brands
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "brands_admin_update" on public.brands;
create policy "brands_admin_update"
on public.brands
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "brands_admin_delete" on public.brands;
create policy "brands_admin_delete"
on public.brands
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "suppliers_read_authenticated" on public.suppliers;
create policy "suppliers_read_authenticated"
on public.suppliers
for select
to authenticated
using (true);

drop policy if exists "suppliers_admin_insert" on public.suppliers;
create policy "suppliers_admin_insert"
on public.suppliers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "suppliers_admin_update" on public.suppliers;
create policy "suppliers_admin_update"
on public.suppliers
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "suppliers_admin_delete" on public.suppliers;
create policy "suppliers_admin_delete"
on public.suppliers
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "products_read_authenticated" on public.products;
create policy "products_read_authenticated"
on public.products
for select
to authenticated
using (true);

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
on public.products
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
on public.products
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role = 'admin'
  )
);

drop policy if exists "stock_movements_read_authenticated" on public.stock_movements;
create policy "stock_movements_read_authenticated"
on public.stock_movements
for select
to authenticated
using (true);

drop policy if exists "stock_movements_staff_or_admin_insert" on public.stock_movements;
create policy "stock_movements_staff_or_admin_insert"
on public.stock_movements
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role in ('admin', 'staff')
  )
);

drop policy if exists "sales_read_authenticated" on public.sales;
create policy "sales_read_authenticated"
on public.sales
for select
to authenticated
using (true);

drop policy if exists "sales_staff_or_admin_insert" on public.sales;
create policy "sales_staff_or_admin_insert"
on public.sales
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role in ('admin', 'staff')
  )
);

drop policy if exists "sale_items_read_authenticated" on public.sale_items;
create policy "sale_items_read_authenticated"
on public.sale_items
for select
to authenticated
using (true);

drop policy if exists "sale_items_staff_or_admin_insert" on public.sale_items;
create policy "sale_items_staff_or_admin_insert"
on public.sale_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles as current_profile
    where current_profile.id = auth.uid()
      and current_profile.role in ('admin', 'staff')
  )
);
