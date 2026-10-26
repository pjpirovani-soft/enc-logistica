# ARCHITECTURE — ENC Logística

**Actualizado:** 2026-10-26

## Stack Tecnológico
- **Framework:** Next.js 16 (App Router, Turbopack).
- **Lenguaje:** TypeScript + React 19.
- **Estilos:** Tailwind CSS 4 (con colores personalizados de la marca).
- **Base de Datos:** Supabase (PostgreSQL 15 + RLS).
- **Autenticación:** Supabase Auth (Email/Password).
- **Validación:** Zod (cliente y servidor).
- **Correos:** Gmail SMTP (cuenta contacto.enclogistica@gmail.com) con Contraseña de Aplicación.

## Estructura de Base de Datos

### Tablas maestras
- **perfiles**: vinculada a auth.users. Guarda rol (admin/repartidor).
- **departamentos** (Fase 11): 18 filas (17 deptos + Asunción). Catálogo estático.
- **ciudades** (Fase 11): 88 ciudades principales. FK a departamentos.
- **clientes** (Fase 11): clientes B2B. Opcional, para trazabilidad y facturación.

### Tablas operativas
- **paquetes**: envíos. Vinculada a user_id (repartidor) y opcionalmente a cliente_id, departamento_origen, ciudad_origen.

## Flujo de Autenticación
1. Usuario se registra en /register.
2. Supabase crea usuario + trigger handle_new_user crea perfil 'admin'.
3. Gmail envía correo de confirmación.
4. Usuario inicia sesión en /login, redirigido a /dashboard.

## Flujo de Operación (Paquetes)
1. Repartidor llena formulario en /dashboard.
2. Fase 11: selecciona Departamento Origen y Ciudad Origen (cascada).
3. Se llama Server Action crearPaquete.
4. Zod valida (incluye departamento_origen, ciudad_origen).
5. Se inserta en Supabase (estado: 'En Ruta').
6. Al hacer clic en "Entregar", se piden: nombre retirador, C.I., observaciones, checkbox "cobrado" (si contra entrega).
7. Se actualiza estado a 'Entregado' + campos de entrega.
8. Aparece botón WhatsApp para avisar al cliente.

## Flujo de Reintento (Fase 9 + 10)
1. Repartidor marca "Cliente Ausente": estado 'Ausente' + fecha_ausente.
2. Al reintentar, si intentos_entrega < 2: vuelve a 'En Ruta' + incrementa contador.
3. Si intentos_entrega >= 2: pasa a 'Devuelto' + devuelto_a_remitente = true.

## Modelo de Datos (Fase 11)
Departamentos (18) → Ciudades (88) → Clientes B2B (opcional) → Paquetes (con departamento_origen, ciudad_origen, cliente_id).

## ADRs (Architecture Decision Records)

### ADR-001: Multi-origen con departamentos y ciudades
- **Contexto:** El modelo original asumía "Cliente Asunción" como texto libre. No soporta paquetes de otras ciudades.
- **Decisión:** Crear tablas departamentos (18) + ciudades (88) + clientes (B2B opcional). Refactor paquetes con departamento_origen, ciudad_origen, cliente_id.
- **Alternativas descartadas:** Texto libre (no permite reportes por zona), 250 distritos (over-engineering).
- **Consecuencias:** Cobertura nacional real. Migración a Asunción. Formulario con cascada.

### ADR-002: Cliente B2B opcional
- **Contexto:** Clientes formales (RUC) e informales (un amigo que manda 1 paquete).
- **Decisión:** cliente_id opcional. cliente_asuncion (texto) se mantiene.
- **Consecuencias:** Ambos modelos conviven. Reportes serios usan cliente_id.

### ADR-003: Tope de 2 intentos
- **Contexto:** Protocolo dice "si el segundo intento falla, se devuelve".
- **Decisión:** reintentarEntrega chequea intentos_entrega >= 2, pasa a 'Devuelto'.
- **Consecuencias:** Trazabilidad de devoluciones.

## Documentos de Negocio
Operativa y comercial en docs/negocio/.

## Migraciones SQL
- 001_clientes.sql (blueprint legacy)
- 002_paquetes_y_perfiles.sql (Fase 2)
- 003_fase9_ausente_reintento.sql (Fase 9)
- 004_fase10_tarifa_cobrado_devuelto.sql (Fase 10)
- 005_fase11_multi_origen.sql (Fase 11)