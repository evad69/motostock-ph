create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id text primary key,
  name text not null,
  contact_number text not null,
  address text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  sku text not null unique,
  photo_url text not null default '',
  brand_id text references public.brands (id) on delete restrict,
  category_id text references public.categories (id) on delete restrict,
  motorcycle_model text,
  cost_price numeric(12,2) not null default 0,
  selling_price numeric(12,2) not null default 0,
  stock_quantity integer not null default 0,
  reorder_level integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  total_amount numeric(12,2) not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales (id) on delete cascade,
  product_id text not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0)
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products (id) on delete cascade,
  type text not null check (type in ('stock_in', 'sale', 'adjustment')),
  quantity integer not null check (quantity <> 0),
  note text,
  supplier_id text references public.suppliers (id) on delete set null,
  sale_id uuid references public.sales (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_brand_id on public.products (brand_id);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_archived on public.products (is_archived);
create index if not exists idx_sale_items_sale_id on public.sale_items (sale_id);
create index if not exists idx_sale_items_product_id on public.sale_items (product_id);
create index if not exists idx_sales_created_at on public.sales (created_at desc);
create index if not exists idx_stock_movements_product_id on public.stock_movements (product_id);
create index if not exists idx_stock_movements_sale_id on public.stock_movements (sale_id);
create index if not exists idx_stock_movements_supplier_id on public.stock_movements (supplier_id);
create index if not exists idx_stock_movements_created_at on public.stock_movements (created_at desc);
