-- 1. Crear la tabla de perfiles
create table public.perfiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  rol text default 'repartidor' check (rol in ('admin', 'repartidor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Crear la tabla de paquetes
create table public.paquetes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  nro_guia text not null,
  cliente_asuncion text not null,
  destinatario text not null,
  direccion text not null,
  telefono text,
  estado text not null default 'En Ruta' check (estado in ('En Ruta', 'Entregado', 'Devuelto', 'Rechazado')),
  tipo_servicio text not null default 'Normal' check (tipo_servicio in ('Normal', 'Contra Entrega')),
  monto_cobro numeric(10, 2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habilitar RLS en ambas tablas
alter table public.perfiles enable row level security;
alter table public.paquetes enable row level security;

-- 4. Políticas de seguridad para perfiles
create policy "Los usuarios pueden ver su propio perfil" on public.perfiles
  for select using (auth.uid() = id);

-- 5. Políticas de seguridad para paquetes
create policy "Ver solo mis paquetes" on public.paquetes
  for select using (auth.uid() = user_id);

create policy "Insertar mis paquetes" on public.paquetes
  for insert with check (auth.uid() = user_id);

create policy "Actualizar mis paquetes" on public.paquetes
  for update using (auth.uid() = user_id);

create policy "Borrar mis paquetes" on public.paquetes
  for delete using (auth.uid() = user_id);

-- 6. Crear el trigger para nuevos usuarios
create or replace function public.handle_new_user()
returns trigger as C:\Users\Admin\proyectos\studio-pjpirovani-soft\clients\enc-logistica
begin
  insert into public.perfiles (id, email, rol)
  values (new.id, new.email, 'admin');
  return new;
end;
C:\Users\Admin\proyectos\studio-pjpirovani-soft\clients\enc-logistica language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();