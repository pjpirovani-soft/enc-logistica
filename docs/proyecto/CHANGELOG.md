# Changelog — enc-logistica

Formato basado en Keep a Changelog y Semantic Versioning.

## [Unreleased]

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