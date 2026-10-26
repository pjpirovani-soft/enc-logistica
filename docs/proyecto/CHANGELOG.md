# Changelog — enc-logistica

Formato basado en Keep a Changelog y Semantic Versioning.

## [Unreleased]

## [0.7.0] - 2026-10-26

### Added
- Fase 13-bis: PWA + responsive mobile-first.
- public/sw.js (Service Worker: network-first público, cache-first assets, network-only dashboard).
- app/offline/page.tsx (fallback offline).
- components/ServiceWorkerRegister.tsx (registro del SW).
- components/InstallPrompt.tsx (banner de instalación solo en mobile).
- app/dashboard/page.tsx: cards en mobile, tabla en desktop.
- app/dashboard/clientes/page.tsx: cards en mobile, tabla en desktop.
- components/PaqueteForm.tsx: form apilado en mobile, inputs grandes.
- components/PaqueteAcciones.tsx: botones touch-friendly (py-3), grid 2 columnas.

### Changed
- app/layout.tsx: monta SW + InstallPrompt.
- Responsive: mobile-first con prefijo md: para desktop.

### Security
- Service Worker NO cachea /dashboard ni /api (network-only).
- Datos de paquetes/clientes siempre desde red (frescos).

## [0.6.0] - 2026-10-26

### Added
- Fase 13-bis (inicio): PWA básica.
- public/site.webmanifest con name, short_name, theme_color, start_url, icons.
- app/layout.tsx con metadata PWA + Viewport themeColor.

## [0.5.0] - 2026-10-26

### Added
- Fase 12: gestión de clientes B2B.
- app/actions/clientes.ts con obtenerClientes, crearCliente, actualizarCliente.
- app/dashboard/clientes/page.tsx (listar + crear).
- components/ClienteForm.tsx (form inline).
- Selector de cliente en PaqueteForm.
- Migración SQL 006: comision_pct + max_intentos en clientes.

### Removed
- app/dashboard/clientes/[id]/page.tsx (huérfano del blueprint).
- app/dashboard/clientes/nuevo/page.tsx (huérfano del blueprint).
- components/ClienteForm.test.tsx (huérfano del blueprint).

### Fixed
- Vercel build fallido por archivos huérfanos (cache viejo). Commit 0f6e9e1.

## [0.4.0] - 2026-10-26

### Added
- Fase 11: Multi-origen (departamentos, ciudades, clientes B2B).
- Cascada Departamento -> Ciudad.
- Columna Origen en tabla de paquetes.
- ADRs documentados.
- Migración SQL 005.

## [0.3.0] - 2026-10-26

### Added
- Fase 10: tarifa_flete, cobrado, devuelto_a_remitente.
- Tope de 2 intentos.
- Estado Devuelto en CHECK.
- Checkbox Confirma cobro.
- Migración SQL 004.

## [0.2.0] - 2026-10-25

### Added
- Fase 9: Estado Ausente + flujo de reintento.
- Campos observaciones, retirado_por, retirado_por_ci, intentos_entrega, fecha_entrega, fecha_ausente.
- Componente PaqueteAcciones.tsx.
- Migración SQL 003.

### Fixed
- Encoding del dashboard.
- crearPaquete restaurado.

## [0.1.0] - 2026-10-24

### Added
- Proyecto creado desde blueprint web-app.
- Fases 1-8: auth, UI, lógica básica, deploy, documentos de negocio.