# Changelog — enc-logistica

Formato basado en Keep a Changelog y Semantic Versioning.

## [Unreleased]

## [0.9.0] - 2026-10-27

### Added
- Fase 14: Portal Clientes B2B (en desarrollo).
- Tabla `clientes.auth_user_id` vinculada a `auth.users`.
- RLS: cliente B2B puede ver su propio registro y sus paquetes.
- Server actions: `obtenerMiCliente`, `obtenerMisPaquetes`, `vincularClienteAUsuario`, `vincularClienteManual`, `obtenerClientesSinVincular`.
- Portal login (`/portal/login`) y registro (`/portal/register`).
- Dashboard del portal (`/portal`) con lista de paquetes.
- `loginPortal()` y `logoutPortal()` en `lib/auth-actions.ts`.
- `PasswordInput` con toggle mostrar/ocultar (Eye/EyeOff).
- Banner "Nueva versión disponible" cuando el SW se actualiza.
- `APP_VERSION` en `lib/config.ts` (SemVer).

### Changed
- `public/sw.js`: `CACHE_VERSION` de `v1` a `v2`.
- Links cruzados entre login operador y portal cliente.
- Footer con `v0.9.0` en dashboards del operador.

### Security
- Policies RLS `clientes_self_read` y `paquetes_cliente_read`.
- Vincular cliente a usuario: automático (email) o manual (admin).
- Portal B2B NO muestra `retirado_por`, `retirado_por_ci` ni `observaciones` (Ley 6534/2020).

## [0.8.0] - 2026-10-26

### Added
- Fase 13: Reportes por cliente B2B (CSV diario + mensual).
- app/api/reportes/diario/route.ts (CSV diario por cliente y fecha).
- app/api/reportes/mensual/route.ts (CSV mensual por cliente y mes).
- app/dashboard/reportes/page.tsx (UI con tabs y selector).
- components/ReporteForm.tsx (form con tabs, selector cliente, input fecha/mes, botón descarga).
- Link "Reportes" en headers de /dashboard y /dashboard/clientes.

### Security
- Route Handlers con autenticación obligatoria (401 sin sesión).
- RLS de paquetes filtra por user_id.

### Calculations
- tarifa_flete = suma de tarifa_flete de entregados.
- monto_cobro = suma de monto_cobro de entregados.
- comision_cobro = monto_cobro × comision_pct / 100.
- importe_a_rendir = monto_cobro - comision_cobro.
- importe_a_facturar = tarifa_flete (NO descuenta comisión sin regla explícita).

## [0.7.0] - 2026-10-26

### Added
- Fase 13-bis: PWA + responsive mobile-first.
- public/sw.js (Service Worker: network-first público, cache-first assets, network-only dashboard).
- app/offline/page.tsx (fallback offline).
- components/ServiceWorkerRegister.tsx (registro SW).
- components/InstallPrompt.tsx (banner solo mobile).
- Cards en mobile, tabla en desktop.

### Security
- Service Worker NO cachea /dashboard ni /api.

## [0.6.0] - 2026-10-26

### Added
- Fase 13-bis (inicio): PWA básica.

## [0.5.0] - 2026-10-26

### Added
- Fase 12: Gestión clientes B2B.

## [0.4.0] - 2026-10-26

### Added
- Fase 11: Multi-origen.

## [0.3.0] - 2026-10-26

### Added
- Fase 10: tarifa/cobrado/devuelto + tope 2 intentos.

## [0.2.0] - 2026-10-25

### Added
- Fase 9: Ausente + reintento.

## [0.1.0] - 2026-10-24

### Added
- Proyecto creado desde blueprint web-app.