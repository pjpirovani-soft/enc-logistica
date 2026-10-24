# Convenciones de Código — enc-logistica

## Estructura de carpetas

- app/ — rutas Next.js
- components/ — React, 1 archivo por componente
- lib/ — utilidades, schemas Zod, server actions
- lib/supabase/ — client.ts, server.ts
- supabase/migrations/ — SQL numeradas 001_, 002_
- public/ — assets estáticos

## Naming

- Componentes: PascalCase (ClienteForm.tsx)
- Funciones: camelCase (crearCliente)
- Constantes: SCREAMING_SNAKE_CASE (MAX_INTENTOS)
- Tablas Supabase: snake_case plural (clientes, productos)
- Rutas: kebab-case (/dashboard/clientes)
- Env vars: SCREAMING_SNAKE_CASE (NEXT_PUBLIC_SUPABASE_URL)

## TypeScript

- strict: true siempre.
- No any. Si no sabés el tipo, usá unknown y narrow.
- Zod para validación en cliente y servidor.
- Tipos derivados: type ClienteInput = z.infer<typeof clienteSchema>.

## React

- Server Components por defecto. 'use client' solo cuando hay estado/eventos.
- Forms: Server Actions con action={fn} cuando sea posible.
- Error handling: try/finally para loading, no try/catch silencioso.

## Supabase (reglas completas en SEGURIDAD.md)

## Tests (reglas completas en TESTS.md)

## Git

- Encoding: ver ENCODING.md. UTF-8 sin BOM, LF puro.

- Conventional Commits: feat:, fix:, docs:, chore:, test:.
- Un commit por feature. No mezclar.
- Mensaje en español, sin acentos en el subject.
- Ver TESTS.md para estrategia completa (unitarios, RLS, E2E).
- Tests deben pasar antes de commit.

- RLS habilitado en todas las tablas con datos de usuario.
- Ver SEGURIDAD.md para políticas, service_role, auth.

