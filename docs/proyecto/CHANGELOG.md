# Changelog — enc-logistica

Formato basado en Keep a Changelog y Semantic Versioning.

## [Unreleased]

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