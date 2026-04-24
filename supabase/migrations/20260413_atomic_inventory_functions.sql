create or replace function public.rpc_adjust_stock(
  p_product_id uuid,
  p_delta integer,
  p_movement_type text,
  p_note text default null,
  p_supplier_id uuid default null,
  p_sale_id uuid default null
)
returns void
language plpgsql
as $$
begin
  if p_delta = 0 then
    raise exception 'Stock delta must be non-zero.';
  end if;

  if p_movement_type not in ('stock_in', 'sale', 'adjustment') then
    raise exception 'Unsupported stock movement type: %', p_movement_type;
  end if;

  update public.products
  set stock_quantity = stock_quantity + p_delta
  where id = p_product_id
    and stock_quantity + p_delta >= 0;

  if not found then
    if exists (select 1 from public.products where id = p_product_id) then
      raise exception 'Stock adjustment would reduce quantity below zero.';
    end if;

    raise exception 'Product not found.';
  end if;

  insert into public.stock_movements (
    product_id,
    type,
    quantity,
    note,
    supplier_id,
    sale_id
  )
  values (
    p_product_id,
    p_movement_type,
    p_delta,
    p_note,
    p_supplier_id,
    p_sale_id
  );
end;
$$;

create or replace function public.rpc_create_sale(
  p_customer_name text,
  p_items jsonb
)
returns uuid
language plpgsql
as $$
declare
  v_sale_id uuid;
  v_total_amount numeric := 0;
  v_item record;
begin
  if p_items is null
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) = 0 then
    raise exception 'Sale items are required.';
  end if;

  insert into public.sales (customer_name, total_amount)
  values (nullif(trim(p_customer_name), ''), 0)
  returning id into v_sale_id;

  for v_item in
    select *
    from jsonb_to_recordset(p_items) as item(
      product_id uuid,
      quantity integer,
      unit_price numeric,
      subtotal numeric
    )
  loop
    if v_item.product_id is null then
      raise exception 'Sale item product_id is required.';
    end if;

    if v_item.quantity is null or v_item.quantity <= 0 then
      raise exception 'Sale item quantity must be greater than zero.';
    end if;

    if v_item.unit_price is null or v_item.unit_price < 0 then
      raise exception 'Sale item unit_price must be zero or greater.';
    end if;

    if v_item.subtotal is null or v_item.subtotal <= 0 then
      raise exception 'Sale item subtotal must be greater than zero.';
    end if;

    insert into public.sale_items (
      sale_id,
      product_id,
      quantity,
      unit_price,
      subtotal
    )
    values (
      v_sale_id,
      v_item.product_id,
      v_item.quantity,
      v_item.unit_price,
      v_item.subtotal
    );

    perform public.rpc_adjust_stock(
      v_item.product_id,
      -v_item.quantity,
      'sale',
      format('Sale %s', v_sale_id),
      null,
      v_sale_id
    );

    v_total_amount := v_total_amount + v_item.subtotal;
  end loop;

  update public.sales
  set total_amount = v_total_amount
  where id = v_sale_id;

  return v_sale_id;
end;
$$;
