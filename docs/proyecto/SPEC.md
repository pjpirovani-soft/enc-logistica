# SPEC — enc-logistica

**Actualizado:** 2026-10-26

## Objetivo

App de gestión operativa para ENC Logística (última milla en Encarnación, Paraguay). Permite a un repartidor registrar paquetes de clientes B2B de cualquier ciudad del país, entregarlos en Encarnación y Gran Encarnación, gestionar reintentos, cobro contra entrega, y avisar por WhatsApp. La app NO es un e-commerce ni un portal de clientes (eso es Fase 14+).

## Alcance

### Incluido en MVP (completado en Fases 1-11)

- Autenticación con Supabase Auth (email/password).
- Formulario para crear paquetes con cascada Departamento -> Ciudad origen.
- Tabla de paquetes con estado (En Ruta, Ausente, Entregado, Devuelto, Cancelado).
- Botones de acción: Entregar (con C.I.), Cliente Ausente, Reintentar, Devolver.
- Tope de intentos configurable (default 2).
- Cobro contra entrega con checkbox "cobrado".
- Aviso por WhatsApp al cliente B2B.
- Catálogo de 18 departamentos + 88 ciudades.
- Tabla `clientes` B2B (opcional, sin UI todavía).

### Excluido del MVP (Fases futuras)

- Portal B2B (login separado para clientes).
- Facturación electrónica (SIFEN).
- Reportes PDF/Excel por cliente.
- Multi-repartidor con asignación.
- Integración con e-commerce (Shopify, WooCommerce).
- Tracking público para destinatario.
- Cobro automático de tarifa de reintento.

## Funcionalidades

### Portal privado (dashboard)

- Crear paquete (formulario con validación Zod).
- Ver lista de paquetes con filtros (por estado, por origen).
- Entregar paquete (modal con C.I. + observaciones + cobro).
- Marcar ausente (con observación).
- Reintentar entrega (con tope configurable).
- Devolver a remitente.
- Avisar por WhatsApp.

### Portal admin (mismo usuario por ahora)

- Ver todos los paquetes.
- Ver clientes B2B (tabla `clientes`).
- (Futuro) Asignar paquetes a repartidores.

### Portal público

- (No aplica en MVP).
- (Futuro) Tracking público `/tracking/[guia]`.

## Criterios de aceptación

### Crear paquete
- [x] Formulario valida todos los campos con Zod.
- [x] Cascada Departamento -> Ciudad funciona.
- [x] Guarda en DB con estado 'En Ruta'.
- [x] Aparece en la tabla inmediatamente.

### Entregar
- [x] Modal pide C.I. del retirador (obligatorio).
- [x] Si es contra entrega, checkbox "cobrado" obligatorio.
- [x] Actualiza estado a 'Entregado' + fecha_entrega.
- [x] Botón WhatsApp visible.

### Ausente
- [x] Actualiza estado a 'Ausente' + fecha_ausente.
- [x] Permite observación.
- [x] Muestra "Intento #N" en la UI.

### Reintentar
- [x] Si intentos < max_intentos, vuelve a 'En Ruta'.
- [x] Si intentos >= max_intentos, pasa a 'Devuelto'.
- [x] Botón cambia de texto ("Reintentar" vs "Devolver").

### Datos
- [x] RLS: cada repartidor ve solo sus paquetes.
- [x] Departamentos y ciudades son catálogo público (lectura).
- [x] Clientes B2B son lectura para autenticados.

## Fases

1. [x] Diseño y planificación (Fase 1-2)
2. [x] MVP (Fases 3-8)
3. [x] Features operativas (Fases 9-11)
4. [ ] Features avanzadas (Fases 12-15: clientes B2B UI, reportes, portal, multi-repartidor)
5. [ ] Pruebas y lanzamiento comercial
## Portal B2B (Fase 14)

### Incluido en MVP
- **Login separado** para clientes B2B (`/portal/login`).
- **Registro** con vinculación automática por email (`/portal/register`).
- **Dashboard del cliente** con lista de SUS paquetes (`/portal`).
- **KPIs:** total paquetes, entregados, total cobrado, total a facturar.
- **Filtros** por estado (Todos / En Ruta / Entregado / Ausente / Devuelto).
- **Reportes descargables** (CSV diario + mensual) filtrados por su cliente.
- **Protección de datos:** NO se muestran `retirado_por`, `retirado_por_ci`, `observaciones` (Ley 6534/2020).

### Fuera del MVP
- El cliente B2B **NO puede crear paquetes** desde el portal (solo lectura).
- El cliente B2B **NO puede ver paquetes de otros clientes**.
- El destinatario **NO tiene portal público** (tracking en Fase 16).
- El cliente B2B **NO puede editar** sus datos (contacta a ENC Logística).

### Criterios de aceptación
- [x] Login del portal redirige a `/portal` (no a `/dashboard`).
- [x] Registro vincula automáticamente si email coincide con `clientes.email`.
- [x] Si no coincide, mensaje "Contactanos" + email.
- [x] Dashboard muestra solo los paquetes del cliente logueado (RLS + filtro explícito).
- [x] KPIs calculados correctamente.
- [x] Filtros funcionan con URL params (`?filtro=Entregado`).
- [x] Reportes CSV descargables sin datos sensibles.
- [x] Mobile responsive (cards en mobile, tabla en desktop).
- [x] Acentos correctos en toda la UI.

### Dependencias
- Ley 6534/2020 (Protección de Datos Personales).
- RLS de Supabase (clientes_self_read + paquetes_cliente_read).
