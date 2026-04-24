update public.profiles
set role = 'admin'
where role is distinct from 'admin';

alter table public.profiles
  alter column role set default 'admin';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role = 'admin');
