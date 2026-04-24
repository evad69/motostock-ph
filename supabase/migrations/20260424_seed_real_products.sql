insert into public.categories (id, name)
values
  ('ignition', 'Ignition'),
  ('electrical', 'Electrical'),
  ('brakes', 'Brakes'),
  ('lubricants', 'Lubricants'),
  ('filters', 'Filters'),
  ('drivetrain', 'Drivetrain')
on conflict (id) do update
set name = excluded.name;

insert into public.brands (id, name)
values
  ('ngk', 'NGK'),
  ('denso', 'Denso'),
  ('motolite', 'Motolite'),
  ('yamaha-genuine-parts', 'Yamaha Genuine Parts'),
  ('honda-genuine-parts', 'Honda Genuine Parts'),
  ('castrol', 'Castrol'),
  ('did', 'DID')
on conflict (id) do update
set name = excluded.name;

insert into public.products (
  id,
  name,
  sku,
  photo_url,
  brand_id,
  category_id,
  motorcycle_model,
  cost_price,
  selling_price,
  stock_quantity,
  reorder_level,
  is_archived
)
values
  (
    'ngk-spark-plug-cr7hsa',
    'NGK Spark Plug CR7HSA',
    'NGK-CR7HSA',
    '',
    'ngk',
    'ignition',
    'Honda Wave 110, Honda XRM 125, Yamaha Mio Sporty',
    95.00,
    145.00,
    36,
    10,
    false
  ),
  (
    'denso-spark-plug-u20epr9',
    'Denso Spark Plug U20EPR9',
    'DNS-U20EPR9',
    '',
    'denso',
    'ignition',
    'Suzuki Raider 150 Carb, Honda TMX 155',
    105.00,
    155.00,
    24,
    8,
    false
  ),
  (
    'motolite-battery-ytx7l-bs',
    'Motolite Battery YTX7L-BS',
    'MTL-YTX7LBS',
    '',
    'motolite',
    'electrical',
    'Honda Click 125, Yamaha Mio Gear, Suzuki Burgman Street',
    1450.00,
    1950.00,
    8,
    3,
    false
  ),
  (
    'yamaha-mio-front-brake-shoe-set',
    'Yamaha Mio Front Brake Shoe Set',
    'YGP-MIO-FBS',
    '',
    'yamaha-genuine-parts',
    'brakes',
    'Yamaha Mio Sporty, Mio Soul i, Mio i 125',
    240.00,
    380.00,
    18,
    6,
    false
  ),
  (
    'honda-click-front-brake-pad-set',
    'Honda Click Front Brake Pad Set',
    'HGP-CLK-FBP',
    '',
    'honda-genuine-parts',
    'brakes',
    'Honda Click 125, Click 150, Vario 160',
    320.00,
    480.00,
    14,
    5,
    false
  ),
  (
    'castrol-power1-4t-20w40-1l',
    'Castrol Power1 4T 20W-40 1L',
    'CST-PWR1-20W40',
    '',
    'castrol',
    'lubricants',
    'Universal 4-stroke motorcycles and scooters',
    255.00,
    355.00,
    30,
    12,
    false
  ),
  (
    'yamaha-mio-air-filter-element',
    'Yamaha Mio Air Filter Element',
    'YGP-MIO-AFE',
    '',
    'yamaha-genuine-parts',
    'filters',
    'Yamaha Mio Sporty, Mio Soul i, Mio i 125',
    120.00,
    185.00,
    20,
    6,
    false
  ),
  (
    'honda-wave-fuel-filter',
    'Honda Wave Fuel Filter',
    'HGP-WAV-FF',
    '',
    'honda-genuine-parts',
    'filters',
    'Honda Wave 110, Wave 125, XRM 125',
    75.00,
    120.00,
    22,
    8,
    false
  ),
  (
    'did-428h-drive-chain-120l',
    'DID 428H Drive Chain 120L',
    'DID-428H-120L',
    '',
    'did',
    'drivetrain',
    'Honda TMX 125, Suzuki GD110, Yamaha YTX 125',
    520.00,
    760.00,
    12,
    4,
    false
  ),
  (
    'yamaha-mio-v-belt',
    'Yamaha Mio V-Belt',
    'YGP-MIO-VBLT',
    '',
    'yamaha-genuine-parts',
    'drivetrain',
    'Yamaha Mio Sporty, Mio Soul i, Mio Gear',
    410.00,
    620.00,
    10,
    4,
    false
  ),
  (
    'honda-click-throttle-cable',
    'Honda Click Throttle Cable',
    'HGP-CLK-TC',
    '',
    'honda-genuine-parts',
    'electrical',
    'Honda Click 125, Click 150',
    145.00,
    220.00,
    16,
    5,
    false
  ),
  (
    'ngk-spark-plug-cap-lb05f',
    'NGK Spark Plug Cap LB05F',
    'NGK-LB05F',
    '',
    'ngk',
    'ignition',
    'Universal underbone and scooter applications',
    110.00,
    165.00,
    15,
    5,
    false
  )
on conflict (id) do update
set
  name = excluded.name,
  sku = excluded.sku,
  photo_url = excluded.photo_url,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  motorcycle_model = excluded.motorcycle_model,
  cost_price = excluded.cost_price,
  selling_price = excluded.selling_price,
  stock_quantity = excluded.stock_quantity,
  reorder_level = excluded.reorder_level,
  is_archived = excluded.is_archived;
