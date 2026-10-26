# ARCHITECTURE — ENC Logística

**Actualizado:** 2026-10-26

## Stack Tecnológico
- **Framework:** Next.js 16 (App Router, Turbopack).
- **Lenguaje:** TypeScript + React 19.
- **Estilos:** Tailwind CSS 4.
- **Base de Datos:** Supabase (PostgreSQL 15 + RLS).
- **Autenticación:** Supabase Auth (Email/Password).
- **Validación:** Zod (cliente y servidor).
- **Correos:** Gmail SMTP (contacto.enclogistica@gmail.com).
- **PWA:** Manifest + Service Worker (Fase 13-bis).

## Estructura de Base de Datos

### Tablas maestras
- **perfiles**: rol (admin/repartidor). Vinculada a auth.users.
- **departamentos** (Fase 11): 18 filas.
- **ciudades** (Fase 11): 88 ciudades principales.
- **clientes** (Fase 11 + 12): B2B opcional (RUC, tarifa_base, comision_pct, max_intentos).

### Tablas operativas
- **paquetes**: envíos. Vinculada a user_id y opcionalmente a cliente_id, departamento_origen, ciudad_origen.

## Flujos principales

### Autenticación
1. Registro en /register.
2. Trigger handle_new_user crea perfil 'admin'.
3. Confirmación por Gmail.
4. Login → /dashboard.

### Crear paquete
1. Form con cascada Departamento → Ciudad.
2. Selector de cliente (optgroup + "Otro (texto libre)" + "+ Nuevo cliente B2B").
3. Zod valida.
4. Insert con estado 'En Ruta'.

### Entregar
1. Modal con nombre retirador, C.I., observaciones, checkbox "cobrado" (si contra entrega).
2. Update estado 'Entregado' + fecha_entrega.
3. Botón WhatsApp.

### Reintentar
1. Si intentos < max_intentos (cliente o default 2): vuelve a 'En Ruta' + incrementa.
2. Si intentos >= max_intentos: pasa a 'Devuelto'.

## ADRs

### ADR-001: Multi-origen con departamentos y ciudades
- **Contexto:** Modelo original asumía "Cliente Asunción" texto libre.
- **Decisión:** Tablas departamentos (18) + ciudades (88) + clientes (opcional). Refactor paquetes con departamento_origen, ciudad_origen, cliente_id.
- **Consecuencias:** Cobertura nacional, formulario con cascada.

### ADR-002: Cliente B2B opcional
- **Contexto:** Clientes formales (RUC) e informales.
- **Decisión:** cliente_id opcional. cliente_asuncion (texto) se mantiene.
- **Consecuencias:** Ambos modelos conviven.

### ADR-003: Tope de intentos
- **Contexto:** Protocolo dice "si el segundo intento falla, se devuelve".
- **Decisión:** reintentarEntrega chequea intentos_entrega >= max_intentos (default 2), pasa a 'Devuelto'.
- **Consecuencias:** Trazabilidad de devoluciones.

### ADR-004: Tope de intentos configurable por cliente
- **Contexto:** Algunos clientes B2B pueden necesitar más de 2 intentos.
- **Decisión:** Campo clientes.max_intentos (SMALLINT, default 2, rango 1-5). Si el paquete tiene cliente_id, usar su max_intentos; si no, default 2.
- **Alternativas:** Tope fijo global (menos flexible), tope por paquete (más granular pero más complejo).
- **Consecuencias:** Flexibilidad por cliente. Requiere que reintentarEntrega consulte el cliente.

## Migraciones SQL
- 001_clientes.sql (blueprint legacy)
- 002_paquetes_y_perfiles.sql (Fase 2)
- 003_fase9_ausente_reintento.sql (Fase 9)
- 004_fase10_tarifa_cobrado_devuelto.sql (Fase 10)
- 005_fase11_multi_origen.sql (Fase 11)
- 006_fase12_clientes_comision_intentos.sql (Fase 12)

## PWA
- **Manifest:** public/site.webmanifest (name, short_name, theme_color #0A2540, start_url /dashboard, icons).
- **Metadata:** app/layout.tsx (manifest, appleWebApp, icons, viewport themeColor).
- **Service Worker:** public/sw.js.
  - **Network-first** para páginas públicas (/login, /register, /offline).
  - **Cache-first** para assets estáticos (/_next/static, imágenes, fuentes).
  - **Network-only** para /dashboard y /api (NUNCA cachea datos sensibles).
  - **Offline fallback** para navegación sin red -> /offline.
- **Install Prompt:** components/InstallPrompt.tsx (banner solo en mobile, sessionStorage para no molestar).
- **Registro:** components/ServiceWorkerRegister.tsx (client component).
- **Responsive:** mobile-first con prefijo md: de Tailwind. Cards en mobile, tabla en desktop.