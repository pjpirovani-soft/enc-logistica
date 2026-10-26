# BITACORA â€” enc-logistica

## 2026-10-24 â€” Sesion inicial

- Proyecto creado desde blueprint web-app.
- Documentacion base generada.
- Proximo paso: leer SPEC.md y definir features.

**Commits:** (pendiente)

## 2026-10-24 — Creación del MVP de ENC Logística

- Se inicializó el proyecto en `clients/enc-logistica` usando el blueprint `web-app`.
- **Base de Datos:** Se creó el proyecto en Supabase (`enc-logistica`). Se aplicaron las migraciones `002_paquetes_y_perfiles.sql` (tablas `paquetes` y `perfiles` con RLS).
- **Autenticación:** Se configuró el login y registro. Se desactivó la confirmación de correo en Supabase para pruebas.
- **SMTP:** Se configuró Resend como proveedor SMTP para evitar el límite de correos de Supabase. Se personalizó la plantilla de correo con los colores de la marca.
- **Marca:** Se documentó la identidad visual en `docs/proyecto/MANUAL-MARCA.md` (Azul #0A2540, Rojo #E63946).
- **UI/UX:** Se rediseñaron las páginas de Login, Registro, Home y Dashboard con la paleta de colores oficial. Se creó el componente `PaqueteForm.tsx` y la Server Action `crearPaquete`.
- **Hallazgo:** Se evitó el uso de PowerShell para escribir código React (componentes) debido a problemas de escape con las llaves y template literals. Se usó VS Code directamente.

## 2026-10-25 — Ajustes de Estética, Logos y Correos

- **Logos:** Se estandarizaron los nombres de los archivos de imagen en `public/` para evitar confusiones:
  - `alas-blanca-transparente.png` (fondo transparente, alas blancas). Usado en Login y Registro (fondos oscuros).
  - `alas-azul-transparente.png` (fondo transparente, alas azules). Usado en el Dashboard (fondo claro).
  - `logo-oficial.png` (logo completo). Reservado para correos o impresiones.
  - Se eliminó el fondo blanco (cuadrado) que rompía la estética.
- **Correos:** Se migró el SMTP de Resend a **Gmail** (`contacto.enclogistica@gmail.com`) usando una Contraseña de Aplicación, para permitir el envío a cualquier destinatario (Resend solo permitía enviar al correo dueño de la cuenta en su plan gratuito).
- **Plantilla de Correo:** Se personalizó la plantilla en Supabase con los colores de la marca y el logo.
- **Hallazgos:** 
  - Al usar Gmail SMTP, Supabase muestra una advertencia de "entregabilidad", pero el envío funciona correctamente (puede caer en Spam al principio).
  - Se configuraron las **Redirect URLs** en Supabase (`https://enc-logistica.vercel.app/**`) para que el enlace de confirmación del correo redirija correctamente en producción.

## 2026-10-25 — Cierre de sesión y preparación de dump

- Se integraron los 7 documentos operativos en `docs/negocio/`.
- Se actualizaron `STATUS.md`, `ARCHITECTURE.md` y `SESSION-STATE.md`.
- **Pendientes detectados:** Falta implementar el estado 'Ausente' (Protocolo de Reintento), campos de observaciones en la entrega, y limpieza de archivos del blueprint.
- Se preparó el volcado de contexto para la próxima sesión.

## 2026-10-25 — Preparación de volcado de contexto

- Se generó un dump completo con la documentación, estado del proyecto y pendientes.
- El volcado fue copiado automáticamente al portapapeles para iniciar una nueva sesión con contexto completo.

## 2026-10-25 â€” Fase 9: Estado Ausente + Reintento + Campos de entrega

- **MigraciÃ³n SQL:** agregadas a tabla `paquetes` las columnas `observaciones`, `retirado_por`, `retirado_por_ci`, `intentos_entrega`, `fecha_entrega`, `fecha_ausente`. CHECK de `estado` ampliado a 4 valores (`En Ruta`, `Entregado`, `Ausente`, `Cancelado`).
- **Server Actions:** `app/actions/paquetes.ts` reescrito con `crearPaquete` (restaurado), `marcarEntregado` (con C.I. y observaciones), `marcarAusente`, `reintentarEntrega`.
- **UI:** nuevo componente `components/PaqueteAcciones.tsx` (client) con modales inline para Ausente y Entregar. `app/dashboard/page.tsx` actualizado con badges por estado y fix de encoding (adios `LogÃƒÂ­stica`).
- **Deploy:** commit `1cf3f1c` (feat inicial) + `4cb7c63` (fix `crearPaquete`). Vercel deployado.
- **VerificaciÃ³n:** paquete `TEST-620700` probado end-to-end en produccion. Estado final `Entregado` con `retirado_por='Ana Perez'`, `retirado_por_ci='1234567'`, `intentos_entrega=3`.
- **Hallazgo:** los scripts de test en consola del navegador necesitan `wait` de 4s (no 2.5s) para que `revalidatePath` complete la propagacion.
- **Deuda tecnica:** falta Fase 10 (campos de planilla: tipo_servicio enum, precio_cobro, tarifa_flete, comision_cobro, cobrado, foto_enviada, celular). Falta tope de 2 intentos + estado `'Devuelto'`.

## 2026-10-26 â€” Fase 10: Tarifa flete, cobrado y devoluciÃ³n

- **MigraciÃ³n SQL (004):** agregadas a paquetes las columnas tarifa_flete (NUMERIC 12,2, default 22000), cobrado (BOOLEAN, default false), devuelto_a_remitente (BOOLEAN, default false). CHECK de estado ampliado a 5 valores (agrega Devuelto).
- **Server Action marcarEntregado:** acepta cobrado boolean. Guarda cobrado en DB.
- **Server Action reintentarEntrega:** tope de 2 intentos. Si intentos_entrega >= 2, pasa a estado Devuelto + devuelto_a_remitente = true.
- **UI PaqueteForm:** agregado input Tarifa Flete con default 22000.
- **UI PaqueteAcciones:** checkbox "Confirma cobro" en modal Entregar (solo si tipo_servicio = Contra Entrega). Boton cambia de "Reintentar entrega" a "Devolver a remitente" cuando intentos >= 2.
- **UI page.tsx:** columna Tipo en la tabla, badge Devuelto rojo, indicador Gs. + OK si cobrado.
- **Commits:** 484676e.
- **Verificado:** prueba en produccion con paquete Contra Entrega (TEST-CE-001). Checkbox aparece, error si no se marca, entrega OK con cobro.

## 2026-10-26 â€” Fase 11: Multi-origen (departamentos, ciudades, clientes)

- **Decision de negocio:** el modelo original asumia "Cliente Asuncion" como texto libre. No soporta paquetes de Ciudad del Este, Encarnacion, Concepcion, etc. Se aprobo rediseÃ±o a hub regional (Opcion B).
- **Migracion SQL (005):**
  - Tabla departamentos: 18 filas (17 deptos + Asuncion).
  - Tabla ciudades: 88 ciudades principales (no los 250 distritos oficiales, para no over-engineerizar).
  - Tabla clientes: B2B opcional (RUC, telefono, email, departamento_id, ciudad_id, tarifa_base, activo).
  - Refactor paquetes: agregadas cliente_id (UUID, opcional), departamento_origen (FK), ciudad_origen (FK).
  - Backfill: paquetes existentes asignados a Asuncion (depto 1, ciudad 1).
  - Indices en departamento_origen, ciudad_origen, cliente_id.
  - RLS en clientes (authenticated puede leer, crear, actualizar).
- **Server Actions:**
  - Nuevo app/actions/ubicaciones.ts con obtenerDepartamentos() y obtenerCiudadesPorDepartamento().
  - crearPaquete valida departamento_origen y ciudad_origen via Zod.
- **UI PaqueteForm:** cascada Departamento -> Ciudad. Al cambiar de departamento, carga ciudades via server action.
- **UI page.tsx:** columna Origen en tabla (ciudad bold arriba, depto gris abajo). Mapa de nombres cargado en el server component.
- **ADR documentados en ARCHITECTURE.md:** ADR-001 (multi-origen), ADR-002 (cliente opcional), ADR-003 (tope 2 intentos).
- **Migraciones versionadas:** 003_fase9, 004_fase10, 005_fase11 en supabase/migrations/.
- **Commits:** fe94f7a.
- **Deuda tecnica restante:** Fase 12 (refactor cliente_id + UI clientes), Fase 13 (reportes), Fase 14 (portal B2B), limpiar app/dashboard/clientes/.
