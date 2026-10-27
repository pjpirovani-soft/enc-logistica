# BUSINESS-LOGIC — enc-logistica

**Actualizado:** 2026-10-26

## Dominio

Servicio de logística de última milla con base en Encarnación, Paraguay. Funciona como hub regional: recibe paquetes de clientes B2B (tiendas online, distribuidoras) de cualquier ciudad del país y entrega puerta a puerta en Encarnación y Gran Encarnación (Cambyretá, Capitán Miranda, San Juan del Paraná). Cobro contra entrega disponible. El fundador actúa como primer repartidor con Toyota Ractis 2009.

## Reglas de negocio

### Reintentos
- **Tope de intentos:** configurable por cliente B2B (campo `clientes.max_intentos`, default 2). Ver ADR-004.
- **Flujo:** En Ruta -> Ausente (1er intento falla) -> Reintento (2do intento) -> Ausente -> Devuelto.
- **Tarifa de reintento:** actualmente NO se cobra (decisión MVP). Futuro: configurable por cliente.
- **Estado Devuelto:** manual, caso por caso. El repartidor decide si cobra o no el flete.

### Tarifas
- **tarifa_base:** default Gs. 22.000 (Encarnación urbana).
- **Override por paquete:** el repartidor puede sobrescribir la tarifa al crear cada paquete.
- **Escalonado por volumen:** NO implementado. Futuro (Fase 13+): 22.000 si <20/mes, 18.000 si 20-50, 17.000 si >50.
- **Comisión contra entrega:** 3% por default, configurable por cliente (`clientes.comision_pct`).

### Cobro contra entrega
- Se registra `monto_cobro` al crear el paquete.
- Al entregar, se confirma `cobrado = true` con checkbox obligatorio.
- La comisión del 3% se calcula al cierre (manual por ahora, automático en Fase 13).

### Notificaciones
- **Cliente B2B:** WhatsApp al confirmar entrega.
- **Destinatario:** WhatsApp al confirmar entrega (mensaje separado). Hoy solo hay botón manual para B2B.
- **Cliente B2B en ausencia:** WhatsApp con observaciones y decisión de reintento.

### Facturación
- La app NO emite facturas legales (SIFEN/DNIT). Solo registra `tarifa_flete`, `monto_cobro`, `comision_cobro`.
- La factura legal se emite en sistema contable externo (a definir con RUC).
- Reportes: la app puede exportar CSV/Excel con los datos para facturar.

### Geografía
- **Origen:** cualquier departamento de Paraguay (18 deptos + 88 ciudades cargadas).
- **Destino:** Encarnación y Gran Encarnación (Cambyretá, Capitán Miranda, San Juan del Paraná).
- **Ampliación futura:** destino a cualquier ciudad cuando el negocio lo justifique.

## Entidades principales

| Entidad | Descripción | Campos clave |
|---|---|---|
| `perfiles` | Roles (admin/repartidor). Vinculada a auth.users. | id, role |
| `departamentos` | 18 departamentos de Paraguay. | id, nombre |
| `ciudades` | 88 ciudades principales. | id, nombre, departamento_id |
| `clientes` | Clientes B2B (opcional). | id, nombre, ruc, telefono, email, departamento_id, ciudad_id, tarifa_base, comision_pct, max_intentos, activo |
| `paquetes` | Envíos. | id, nro_guia, cliente_asuncion, cliente_id, destinatario, direccion, telefono, departamento_origen, ciudad_origen, tipo_servicio, monto_cobro, tarifa_flete, cobrado, estado, intentos_entrega, retirado_por, retirado_por_ci, fecha_entrega, fecha_ausente, observaciones, devuelto_a_remitente |

## Flujos clave

### Crear paquete
1. Repartidor llena formulario: N° guía, cliente, depto/ciudad origen, destinatario, dirección, teléfono, tipo servicio, monto cobro, tarifa flete.
2. Server Action `crearPaquete` valida con Zod.
3. Se inserta con `estado = 'En Ruta'`.

### Entregar
1. Repartidor llega al domicilio.
2. Clic "Entregar" -> modal con nombre retirador, C.I., observaciones, checkbox "cobrado" (si contra entrega).
3. Se actualiza `estado = 'Entregado'` + `fecha_entrega` + campos.
4. Aparece botón WhatsApp para avisar al B2B.

### Ausente
1. Cliente no está -> clic "Cliente Ausente".
2. Se pide observación opcional.
3. Se actualiza `estado = 'Ausente'` + `fecha_ausente`.

### Reintentar
1. Día siguiente, clic "Reintentar entrega".
2. Si `intentos_entrega < max_intentos` -> vuelve a 'En Ruta' + incrementa contador.
3. Si `intentos_entrega >= max_intentos` -> pasa a 'Devuelto' + `devuelto_a_remitente = true`.

## Roles y permisos

### Repartidor (rol actual, único)
- Ver todos sus paquetes (RLS: `user_id = auth.uid()`).
- Crear, actualizar, borrar sus propios paquetes.
- Ver clientes B2B (todos, por ahora).
- Ver departamentos y ciudades (catálogo estático).

### Admin (futuro, mismo usuario por ahora)
- Todo lo del repartidor.
- Asignar paquetes a otros repartidores (Fase 14+).
- Ver reportes financieros.

### Multi-repartidor (Fase 14+)
- Agregar campo `paquetes.asignado_a` (UUID).
- RLS: el repartidor solo ve sus paquetes asignados.
- El admin asigna y reasigna.

## Decisiones abiertas (VERIFICAR)

- ¿La app emite factura legal o solo registro? -> **Registro. Factura en sistema contable externo.**
- ¿El WhatsApp al destinatario es manual o automático? -> **Manual por ahora, automático en Fase 13.**
- ¿La comisión se calcula al entregar o al facturar? -> **Al facturar (Fase 13). Por ahora solo se guarda `monto_cobro`.**
## Protección de Datos (Ley 6534/2020)

### Portal B2B — Qué datos se muestran al cliente

**Política:** el portal del cliente B2B **NO muestra** datos personales del destinatario que estén protegidos por la Ley 6534/2020 de Protección de Datos Personales.

**Datos que SÍ se muestran:**
- `nro_guia`, `destinatario` (nombre), `direccion`, `estado`, `tipo_servicio`, `monto_cobro`, `cobrado`, `tarifa_flete`, `fecha_entrega`, `fecha_ausente`, `created_at`.

**Datos que NO se muestran:**
- `retirado_por` (nombre completo del que retiró).
- `retirado_por_ci` (C.I. del retirador — dato sensible).
- `observaciones` (notas internas del operador).
- `intentos_entrega` (dato operativo interno).
- `user_id` (ID del operador).

**Justificación:**
- La Ley 6534/2020 protege los datos personales del destinatario. El cliente B2B **no es el titular** de esos datos.
- El cliente B2B sí tiene derecho a saber el **estado del paquete** (Código Civil, contrato de transporte) y el **monto a facturar** (Ley 4868/2013, comercio electrónico).
- Si un cliente B2B **necesita** `retirado_por` o `retirado_por_ci` para auditoría, debe solicitarlo **con consentimiento explícito del destinatario** y documentarlo en el contrato.

**Implementación:** `app/portal/page.tsx` filtra los campos a mostrar. La server action `obtenerMisPaquetes()` en `app/actions/portal.ts` también podría filtrar (defensa en profundidad).
