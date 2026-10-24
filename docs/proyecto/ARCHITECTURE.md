# ARCHITECTURE — ENC Logística

## Stack Tecnológico
- **Framework:** Next.js 16 (App Router, Turbopack).
- **Lenguaje:** TypeScript + React 19.
- **Estilos:** Tailwind CSS 4 (con colores personalizados de la marca).
- **Base de Datos:** Supabase (PostgreSQL 15 + RLS).
- **Autenticación:** Supabase Auth (Email/Password).
- **Validación:** Zod (cliente y servidor).
- **Correos:** Resend (SMTP personalizado).

## Estructura de Base de Datos
- **Tabla `perfiles`:** Vinculada a `auth.users`. Guarda el rol (admin/repartidor).
- **Tabla `paquetes`:** Guarda la información de los envíos. Vinculada al `user_id` del repartidor.

## Flujo de Autenticación
1. El usuario se registra en `/register`.
2. Supabase crea el usuario y dispara el trigger `handle_new_user` (crea el perfil con rol 'admin').
3. Resend envía el correo de confirmación con la plantilla personalizada.
4. El usuario inicia sesión en `/login` y es redirigido a `/dashboard`.

## Flujo de Operación (Paquetes)
1. El repartidor llena el formulario en `/dashboard`.
2. Se llama a la Server Action `crearPaquete`.
3. Zod valida los datos.
4. Se inserta el paquete en Supabase (estado: 'En Ruta').
5. Al hacer clic en "Entregar", se actualiza el estado a 'Entregado'.
6. Aparece un botón de WhatsApp para avisar al cliente de Asunción.