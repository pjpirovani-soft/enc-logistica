# BITACORA — enc-logistica

## 2026-10-24 — Sesión inicial

- Proyecto creado desde blueprint web-app.
- Documentación base generada.
- Próximo paso: leer SPEC.md y definir features.

**Commits:** (pendiente)

## 2026-10-24 — Creación del MVP de ENC Logística

- Se inicializó el proyecto en clients/enc-logistica usando el blueprint web-app.
- **Base de Datos:** Se creó el proyecto en Supabase (enc-logistica). Se aplicaron las migraciones 002_paquetes_y_perfiles.sql (tablas paquetes y perfiles con RLS).
- **Autenticación:** Se configuró el login y registro. Se desactivó la confirmación de correo en Supabase para pruebas.
- **SMTP:** Se configuró Resend como proveedor SMTP para evitar el límite de correos de Supabase. Se personalizó la plantilla de correo con los colores de la marca.
- **Marca:** Se documentó la identidad visual en docs/proyecto/MANUAL-MARCA.md (Azul #0A2540, Rojo #E63946).
- **UI/UX:** Se rediseñaron las páginas de Login, Registro, Home y Dashboard con la paleta de colores oficial. Se creó el componente PaqueteForm.tsx y la Server Action crearPaquete.
- **Hallazgo:** Se evitó el uso de PowerShell para escribir código React (componentes) debido a problemas de escape con las llaves y template literals. Se usó VS Code directamente.

## 2026-10-25 — Ajustes de Estética, Logos y Correos

- **Logos:** Se estandarizaron los nombres de los archivos de imagen en public/:
  - alas-blanca-transparente.png (fondo transparente, alas blancas). Usado en Login y Registro (fondos oscuros).
  - alas-azul-transparente.png (fondo transparente, alas azules). Usado en el Dashboard (fondo claro).
  - logo-oficial.png (logo completo). Reservado para correos o impresiones.
- **Correos:** Se migró el SMTP de Resend a Gmail (contacto.enclogistica@gmail.com) usando una Contraseña de Aplicación.
- **Plantilla de Correo:** Se personalizó la plantilla en Supabase con los colores de la marca y el logo.
- **Hallazgos:**
  - Al usar Gmail SMTP, Supabase muestra una advertencia de "entregabilidad", pero el envío funciona correctamente.
  - Se configuraron las Redirect URLs en Supabase (https://enc-logistica.vercel.app/**) para que el enlace de confirmación del correo redirija correctamente en producción.

## 2026-10-25 — Cierre de sesión y preparación de dump

- Se integraron los 7 documentos operativos en docs/negocio/.
- Se actualizaron STATUS.md, ARCHITECTURE.md y SESSION-STATE.md.
- **Pendientes detectados:** Falta implementar el estado 'Ausente' (Protocolo de Reintento), campos de observaciones en la entrega, y limpieza de archivos del blueprint.
- Se preparó el volcado de contexto para la próxima sesión.

## 2026-10-25 — Preparación de volcado de contexto

- Se generó un dump completo con la documentación, estado del proyecto y pendientes.

## 2026-10-25 — Fase 9: Estado Ausente + Reintento + Campos de entrega

- **Migración SQL (003):** agregadas a tabla paquetes las columnas observaciones, retirado_por, retirado_por_ci, intentos_entrega, fecha_entrega, fecha_ausente. CHECK de estado ampliado a 4 valores (En Ruta, Entregado, Ausente, Cancelado).
- **Server Actions:** app/actions/paquetes.ts reescrito con crearPaquete (restaurado), marcarEntregado (con C.I. y observaciones), marcarAusente, reintentarEntrega.
- **UI:** nuevo componente components/PaqueteAcciones.tsx (client) con modales inline para Ausente y Entregar. app/dashboard/page.tsx actualizado con badges por estado y fix de encoding.
- **Deploy:** commit 1cf3f1c (feat inicial) + 4cb7c63 (fix crearPaquete). Vercel deployado.
- **Verificación:** paquete TEST-620700 probado end-to-end en producción. Estado final Entregado con retirado_por='Ana Perez', retirado_por_ci='1234567', intentos_entrega=3.
- **Hallazgo:** los scripts de test en consola del navegador necesitan wait de 4s (no 2.5s) para que revalidatePath complete la propagación.

## 2026-10-26 — Fase 10: Tarifa flete, cobrado y devolución

- **Migración SQL (004):** agregadas a paquetes las columnas tarifa_flete (NUMERIC 12,2, default 22000), cobrado (BOOLEAN, default false), devuelto_a_remitente (BOOLEAN, default false). CHECK de estado ampliado a 5 valores (agrega Devuelto).
- **Server Action marcarEntregado:** acepta cobrado boolean. Guarda cobrado en DB.
- **Server Action reintentarEntrega:** tope de 2 intentos. Si intentos_entrega >= 2, pasa a estado Devuelto + devuelto_a_remitente = true.
- **UI PaqueteForm:** agregado input Tarifa Flete con default 22000.
- **UI PaqueteAcciones:** checkbox "Confirma cobro" en modal Entregar (solo si tipo_servicio = Contra Entrega). Botón cambia de "Reintentar entrega" a "Devolver a remitente" cuando intentos >= 2.
- **UI page.tsx:** columna Tipo en la tabla, badge Devuelto rojo, indicador Gs. + OK si cobrado.
- **Commits:** 484676e.
- **Verificado:** prueba en producción con paquete Contra Entrega (TEST-CE-001). Checkbox aparece, error si no se marca, entrega OK con cobro.

## 2026-10-26 — Fase 11: Multi-origen (departamentos, ciudades, clientes)

- **Decisión de negocio:** el modelo original asumía "Cliente Asunción" como texto libre. No soporta paquetes de Ciudad del Este, Encarnación, Concepción, etc. Se aprobó rediseño a hub regional (Opción B).
- **Migración SQL (005):**
  - Tabla departamentos: 18 filas (17 deptos + Asunción).
  - Tabla ciudades: 88 ciudades principales.
  - Tabla clientes: B2B opcional (RUC, teléfono, email, departamento_id, ciudad_id, tarifa_base, activo).
  - Refactor paquetes: agregadas cliente_id (UUID, opcional), departamento_origen (FK), ciudad_origen (FK).
  - Backfill: paquetes existentes asignados a Asunción (depto 1, ciudad 1).
  - Índices en departamento_origen, ciudad_origen, cliente_id.
  - RLS en clientes (authenticated puede leer, crear, actualizar).
- **Server Actions:**
  - Nuevo app/actions/ubicaciones.ts con obtenerDepartamentos() y obtenerCiudadesPorDepartamento().
  - crearPaquete valida departamento_origen y ciudad_origen vía Zod.
- **UI PaqueteForm:** cascada Departamento -> Ciudad. Al cambiar de departamento, carga ciudades vía server action.
- **UI page.tsx:** columna Origen en tabla (ciudad bold arriba, depto gris abajo). Mapa de nombres cargado en el server component.
- **ADR documentados en ARCHITECTURE.md:** ADR-001 (multi-origen), ADR-002 (cliente opcional), ADR-003 (tope 2 intentos).
- **Migraciones versionadas:** 003_fase9, 004_fase10, 005_fase11 en supabase/migrations/.
- **Commits:** fe94f7a.

## 2026-10-26 — Documentación de negocio completa

- **BUSINESS-LOGIC.md:** dominio, reglas de negocio, entidades, flujos, roles.
- **SPEC.md:** objetivo, alcance MVP, funcionalidades, criterios de aceptación.
- **CHANGELOG.md:** historial v0.1.0 a v0.4.0.
- **CLIENTE.md:** Pedro J. Pirovani, historial de cambios de alcance.
- **GLOSARIO.md:** 30+ términos del dominio.
- **Commits:** 9493980.

## 2026-10-26 — Fase 12: Gestión de clientes B2B

- **Migración SQL (006):** agregadas a clientes las columnas comision_pct (NUMERIC 5,2, default 3.00) y max_intentos (SMALLINT, default 2).
- **Server Actions (app/actions/clientes.ts):**
  - obtenerClientes(): lista de clientes activos.
  - crearCliente(input): valida con Zod, inserta con defaults.
  - actualizarCliente(id, input): edita cliente existente.
- **UI nueva:**
  - app/dashboard/clientes/page.tsx: listar clientes (7 columnas) + link "Volver al Dashboard".
  - components/ClienteForm.tsx: form inline con 7 campos, botón "Crear Cliente".
- **UI modificada:**
  - components/PaqueteForm.tsx: selector de cliente con optgroup + "Otro (texto libre)" + "+ Nuevo cliente B2B".
  - app/dashboard/page.tsx: link "Clientes B2B" en header + resolución de nombre de cliente.
  - lib/schemas/paqueteSchema.ts: cliente_id opcional (UUID).
- **Deploy:** commit 9da7788 (falló en Vercel por cache) + 0f6e9e1 (fix: borra huérfanos del blueprint).
- **Verificado:** creación de cliente desde UI OK. Selector de cliente en form OK. Pendiente: crear paquete con cliente B2B en producción.

## 2026-10-26 — Fase 13-bis (inicio): PWA básica

- **Manifest (public/site.webmanifest):**
  - name: "ENC Logística", short_name: "ENC".
  - start_url: "/dashboard", scope: "/".
  - display: "standalone", orientation: "portrait".
  - theme_color: "#0A2540", background_color: "#FFFFFF".
  - icons: 192x192 (any), 512x512 (any), 512x512 (maskable).
- **Metadata (app/layout.tsx):**
  - title: "ENC Logística" con template.
  - manifest: "/site.webmanifest".
  - appleWebApp: capable true, title "ENC".
  - icons: favicon-16/32, android-192, apple-touch.
  - viewport: themeColor #0A2540, userScalable true.
- **Commits:** 2a1098e.
- **Pendiente:** Service Worker + Install Prompt + Responsive mobile-first.

## Deuda técnica pendiente

- Fase 13-bis: Service Worker + Install Prompt + Responsive mobile-first.
- Fase 13: Reportes por cliente + facturación (PDF/Excel).
- Fase 14: Portal B2B con login (solo lectura, luego completo).
- Fase 15: Facturación electrónica (SIFEN).
- Multi-repartidor (campo paquetes.asignado_a).
- Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- Verificar que 001_clientes.sql no rompa si se corre fresh.
- Tests automatizados (Vitest + Playwright).
## 2026-10-26 — Fase 13-bis: PWA + responsive mobile-first (completa)

- **PWA completa:**
  - Service Worker (public/sw.js): network-first para páginas públicas, cache-first para assets estáticos, network-only para /dashboard y /api (datos sensibles).
  - app/offline/page.tsx: fallback cuando no hay red.
  - components/ServiceWorkerRegister.tsx: registra SW al cargar.
  - components/InstallPrompt.tsx: banner de instalación, solo mobile, sessionStorage para no molestar.
- **Responsive mobile-first:**
  - app/dashboard/page.tsx: cards en mobile (<768px), tabla en desktop (>=768px).
  - app/dashboard/clientes/page.tsx: mismo patrón.
  - components/PaqueteForm.tsx: form apilado, inputs grandes (p-3), inputMode numeric.
  - components/PaqueteAcciones.tsx: botones py-3, grid 2 columnas, checkbox w-5 h-5.
  - Headers: stack vertical en mobile, flex-row en desktop.
- **Verificación:** app probada en celular real. Se ve genial. Cards apilados, botones grandes, header stack vertical.
- **Commits:** 2a1098e (PWA manifest), 7b22ff9 (Service Worker + InstallPrompt + offline), 7b657fe (responsive mobile-first).

## 2026-10-26 — Fase 13: Reportes por cliente (CSV diario + mensual)

- **Route Handlers:**
  - app/api/reportes/diario/route.ts: GET ?cliente_id=UUID&fecha=YYYY-MM-DD.
  - app/api/reportes/mensual/route.ts: GET ?cliente_id=UUID&mes=YYYY-MM.
  - Ambos con autenticación obligatoria (401 sin sesión).
  - RLS de paquetes filtra por user_id automáticamente.
- **Cálculos separados (según BUSINESS-LOGIC.md):**
  - tarifa_flete: suma de entregados.
  - monto_cobro: suma de entregados.
  - comision_cobro: monto_cobro × comision_pct / 100.
  - importe_a_rendir: monto_cobro - comision_cobro.
  - importe_a_facturar: tarifa_flete (NO descuenta comisión).
- **UI:**
  - app/dashboard/reportes/page.tsx: página nueva con selector cliente + ReporteForm.
  - components/ReporteForm.tsx: tabs Diario/Mensual, input fecha/mes, botón descarga.
  - Link "Reportes" en headers de /dashboard y /dashboard/clientes.
- **Formato:** CSV (sin dependencias nuevas, como se acordó).
- **PDF:** pendiente para Fase 13-ter.
- **Commits:** 43a680c (diario), b4eff67 (mensual), 9a0b4ee (UI).
- **Verificación:** CSV diario y mensual probados en producción con paquete TEST-620700.

## 2026-10-26 — Auditoría de vulnerabilidades npm

- **CVE-2023-54404 (Zod 3.x):** el `npm audit` reporta 1 vulnerabilidad high en `zod@3.25.76`.
- **Análisis:** el CVE solo es explotable si el código usa `z.array()` sin `.max()` o `.length()`. **La app no usa `z.array()`** en ningún schema (solo `z.object()`, `z.string()`, `z.number()`, `z.enum()`).
- **Decisión:** NO migrar a Zod 4 ahora. El CVE no es explotable en la app. Migración a Zod 4 planificada para Fase 16.
- **Acción:** documentado, sin cambios de código.
