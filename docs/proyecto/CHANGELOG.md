# Changelog — enc-logistica

Formato basado en Keep a Changelog y Semantic Versioning.

## [Unreleased]

## [1.3.1] - 2026-10-29

### Fixed
- **H-04 (Rate Limiting):** Movido el límite de intentos directamente a las Server Actions (`login` y `loginPortal`) en `lib/auth-actions.ts`. Esto evita la evasión vía POST y usa la tabla `rate_limits` en Supabase.
- **H-06 (Zod):** Actualizado `package.json` a `"zod": "3.25.76"` (versión parcheada).

### Added
- Migración 011: Tabla `rate_limits` para Rate Limiting persistente.


## [1.3.0] - 2026-10-29

### Added
- Fase 19: Cierre de Auditoría de Seguridad.
- Migración 009: Corrección del Trigger `handle_new_user` (ahora asigna `repartidor` en vez de `admin`).
- Migración 010: Revocación de privilegios excesivos en tablas de catálogo.
- Migración 011: Tabla `rate_limits` para Rate Limiting distribuido en Supabase.
- Rate Limiting real en API Route de contacto (HTTP 429 después de 3 intentos).
- Tests E2E con Playwright (5 tests de humo).

### Fixed
- H-01: Trigger de asignación de rol admin.
- H-02: Políticas RLS permisivas en tabla `clientes`.
- H-03: Privilegios de `anon` y `authenticated` en tablas.
- H-04: Rate Limiting en Login (ahora persistente, no en memoria).
- H-05: Logs de contacto con datos personales.
- H-06: Documentado como "Mitigado por superficie nula" (Zod sin `z.array()`).


## [1.2.0] - 2026-10-28

### Added
- Fase 17: Formulario de Contacto en `/contacto` (con API Route `/api/contacto`).
- Centro de Ayuda para Operador (`/dashboard/ayuda`) y Cliente B2B (`/portal/ayuda`).
- Links cruzados entre los logins de Operador (`/login`) y Cliente (`/portal/login`).
- Botón "Solicitar Cotización" en la landing (redirige a `/contacto`).
- CTA visual de WhatsApp y Email al final del PDF comercial.

### Fixed
- RLS en tablas `departamentos` y `ciudades` (Migración 008) para permitir lectura a usuarios autenticados.
- Diseño de KPI cards en el PDF comercial.
- Eliminación de caracteres extraños y sección duplicada en el PDF.

## [1.1.0] - 2026-10-28

### Added
- Fase 16: Términos y Condiciones + Política de Privacidad (Ley 6534/2020).
- Página /privacidad con 11 secciones y /terminos con 13 secciones.
- lib/legal.ts con datos legales centralizados (Luciana, RUC, contacto).
- components/Footer.tsx con datos legales y links.

## [1.0.0] - 2026-10-28

### Added
- Fase 14: Portal Clientes B2B completo (login, dashboard, reportes, invitación).
- Tabla clientes.auth_user_id vinculada a auth.users.
- RLS para el portal B2B.

## [0.9.0] - 2026-10-27

### Added
- Fase 14: Portal Clientes B2B (en desarrollo).
- loginPortal() y logoutPortal() en lib/auth-actions.ts.