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
