# Manual del Cliente B2B — ENC Logística

| **Campo** | **Valor** |
|-----------|-----------|
| **Documento** | Manual de Usuario — Cliente B2B |
| **Versión** | 1.0.0 |
| **Fecha de emisión** | 2026-10-28 |
| **Última revisión** | 2026-10-28 |
| **Autor** | Pedro José Pirovani |
| **Aprobado por** | Luciana Noelia Da Silva |
| **Clasificación** | Comercial — Confidencial |
| **Aplica a** | Portal B2B (`/portal/*`) |

---

## Tabla de contenidos

1. [Bienvenido](#1-bienvenido)
2. [Convenciones tipográficas](#2-convenciones-tipográficas)
3. [Requisitos previos](#3-requisitos-previos)
4. [Registro en el portal](#4-registro-en-el-portal)
5. [Iniciar sesión](#5-iniciar-sesión)
6. [Dashboard del cliente](#6-dashboard-del-cliente)
7. [Descargar reportes](#7-descargar-reportes)
8. [PWA en el celular](#8-pwa-en-el-celular)
9. [Problemas comunes](#9-problemas-comunes)
10. [Glosario](#10-glosario)
11. [Soporte y contacto](#11-soporte-y-contacto)
12. [Control de cambios](#12-control-de-cambios)

---

## 1. Bienvenido

### 1.1. ¿Qué es el portal B2B?

El **portal B2B** es la plataforma donde podés:

- Ver el estado de tus envíos en tiempo real.
- Descargar reportes diarios y mensuales.
- Confirmar entregas y cobros contra entrega.
- Todo desde tu computadora o celular.

### 1.2. ¿A quién está dirigido?

A **clientes B2B** de ENC Logística: tiendas online, distribuidoras, empresas que envían paquetes a Encarnación y Gran Encarnación.

### 1.3. ¿Cómo obtengo acceso?

1. **Contactás a ENC Logística** por WhatsApp o email.
2. **Te cargamos como cliente** en el sistema.
3. **Te enviamos una invitación** por WhatsApp con un link de registro.
4. **Te registrás** con el mismo email que nos diste.
5. **¡Listo!** Ya podés acceder al portal.

---

## 2. Convenciones tipográficas

| **Elemento** | **Convención** | **Ejemplo** |
|--------------|----------------|-------------|
| Botones | **Negrita** | Clic en **Ingresar** |
| Enlaces | *Cursiva* o subrayado | Ir a */portal/login* |
| Campos de formulario | `Código` | Ingresá tu `email` |
| Rutas / URLs | `Código` | `https://enc-logistica.vercel.app` |
| Mensajes del sistema | "Comillas dobles" | Aparece "Reporte descargado con éxito" |
| Notas | Bloque > | > **Nota:** texto |

---

## 3. Requisitos previos

Antes de registrarte, verificá que tenés:

- **Un email válido** (el mismo que nos diste al contratar el servicio).
- **Un navegador actualizado** (Chrome, Firefox, Safari, Edge).
- **Conexión a internet.**
- **Tu RUC** (para facturación).

---

## 4. Registro en el portal

### 4.1. Abrir el link de invitación

**Objetivo:** acceder al formulario de registro.

**Pasos:**

1. Abrí el link que te enviamos por WhatsApp. Tiene este formato:
   https://enc-logistica.vercel.app/portal/register?email=tu-email@ejemplo.com
2. El formulario se abre con tu **email pre-cargado**.

### 4.2. Completar el registro

**Pasos:**

1. Verificá que el `email` sea correcto (el mismo que nos diste).
2. Ingresá una **contraseña** (mínimo 6 caracteres).
3. Marcá el checkbox **"Acepto los términos y condiciones y la política de privacidad"**.
4. Hacé clic en **Crear Cuenta**.

**Resultado esperado:**
- Mensaje "¡Cuenta creada y vinculada! Redirigiendo al portal...".
- Redirección automática a `/portal`.

**Solución de problemas:**

| **Síntoma** | **Causa** | **Solución** |
|-------------|-----------|--------------|
| "Tu email no coincide con ningún cliente registrado" | Usaste un email distinto al que nos diste | Contactanos para actualizar tu email. |
| "La contraseña debe tener al menos 6 caracteres" | Contraseña muy corta | Usá una contraseña más larga. |
| No aparece el checkbox de términos | Cache del navegador | Recargá con `Ctrl+Shift+R`. |

---

## 5. Iniciar sesión

### 5.1. Login

**Objetivo:** acceder al portal con tu cuenta.

**Pasos:**

1. Andá a `https://enc-logistica.vercel.app/portal/login`.
2. Ingresá tu `email` y `contraseña`.
3. Hacé clic en **Ingresar**.

**Resultado esperado:**
- Redirección a `/portal`.
- Ves el dashboard con tus paquetes.

**Solución de problemas:**

| **Síntoma** | **Causa** | **Solución** |
|-------------|-----------|--------------|
| "Email o contraseña inválidos" | Credenciales incorrectas | Verificá mayúsculas y espacios. Si persiste, contactanos. |
| Redirige a `/dashboard` | Te logueaste en `/login` (panel del operador) | Andá a `/portal/login` (portal B2B). |

### 5.2. Cerrar sesión

**Pasos:**

1. En el header, hacé clic en **Cerrar Sesión**.
2. Te redirige a `/portal/login`.

> **Advertencia:** cerrá sesión siempre que uses una computadora compartida.

---

## 6. Dashboard del cliente

### 6.1. Visión general

El dashboard (`/portal`) muestra:

- **KPIs (4 tarjetas):** total de paquetes, paquetes entregados, total cobrado, total a facturar.
- **Filtros por estado:** Todos, En Ruta, Entregados, Ausentes, Devueltos.
- **Lista de paquetes:** con guía, destinatario, dirección, estado, tipo, monto, fecha.

### 6.2. Filtrar paquetes

**Pasos:**

1. Hacé clic en uno de los filtros (ej: **Entregados**).
2. La lista se actualiza con los paquetes de ese estado.
3. La URL cambia a `/portal?filtro=Entregado`.

**Para volver a todos:** clic en **Todos**.

### 6.3. Interpretar los estados

| **Estado** | **Significado** |
|------------|-----------------|
| **En Ruta** | El paquete está en poder del repartidor. |
| **Entregado** | El destinatario recibió el paquete. |
| **Ausente** | El destinatario no estaba en el domicilio (primer intento fallido). |
| **Devuelto** | Después de 2 intentos fallidos, el paquete volvió a bodega. |
| **Cancelado** | El envío fue cancelado. |

> **Advertencia:** por protección de datos (Ley 6534/2020), el portal NO muestra el nombre completo ni la C.I. del retirador. Si necesitás esos datos para auditoría, contactanos.

---

## 7. Descargar reportes

### 7.1. Acceder a reportes

**Pasos:**

1. En el dashboard, hacé clic en **Reportes** (header).
2. Se abre `/portal/reportes`.

### 7.2. Descargar reporte diario

**Pasos:**

1. En la pestaña **Diario**, elegí la **fecha**.
2. Hacé clic en **Descargar CSV diario**.

**Resultado esperado:** se descarga un archivo `reporte-diario-[tu-nombre]-[fecha].csv` con resumen, totales y detalle.

### 7.3. Descargar reporte mensual

**Pasos:**

1. En la pestaña **Mensual**, elegí el **mes**.
2. Hacé clic en **Descargar CSV mensual**.

### 7.4. Interpretar el CSV

| **Columna** | **Descripción** |
|-------------|-----------------|
| `Entregados` | Cantidad de paquetes entregados. |
| `Total tarifa flete` | Lo que te facturamos por el servicio. |
| `Total monto cobrado` | Lo cobrado en contra entrega. |
| `Total comisión` | 3% del monto cobrado. |
| `Total a rendir` | Monto cobrado - comisión. |
| `Total a facturar` | Tarifa flete (NO descuenta comisión). |

**Ejemplo:**

    Entregados,5
    Total tarifa flete (Gs.),110.000
    Total monto cobrado (Gs.),250.000
    Total comision (3%) (Gs.),7.500
    Total a rendir (Gs.),242.500
    Total a facturar (Gs.),110.000

**Interpretación:**
- 5 paquetes entregados.
- Te facturamos Gs. 110.000 (5 x 22.000).
- Cobramos Gs. 250.000 en contra entrega.
- Nuestra comisión: Gs. 7.500 (3% de 250.000).
- Te rendimos: Gs. 242.500 (250.000 - 7.500).
- Te facturamos: Gs. 110.000 (no se descuenta la comisión).

---

## 8. PWA en el celular

### 8.1. Instalar en el celular

**Android:**

1. Abrí `https://enc-logistica.vercel.app/portal` en Chrome.
2. Menú (tres puntos) -> **Instalar aplicación**.
3. Aceptar.

**iOS:**

1. Abrí en Safari.
2. Compartir -> **Añadir a pantalla de inicio**.

### 8.2. Actualizar la PWA

**Pasos:**

1. Si aparece el banner **Nueva versión disponible**, hacé clic en **Actualizar**.
2. La app se recarga con la última versión.

---

## 9. Problemas comunes

### 9.1. "No veo mis paquetes"

- Verificá que estés en `/portal` (no en `/dashboard`).
- Recargá con `Ctrl+Shift+R`.
- Si persiste, contactanos.

### 9.2. "No puedo descargar el reporte"

- Verificá que elegiste una fecha/mes.
- Verificá que estás logueado.
- Si persiste, contactanos.

### 9.3. "La PWA no se actualiza"

- Cerrá la PWA y abrila de nuevo.
- Si no funciona, desinstalá y reinstalá.

---

## 10. Glosario

| **Término** | **Definición** |
|-------------|----------------|
| **B2B** | Business-to-Business. Cliente empresarial. |
| **CSV** | Comma-Separated Values. Formato de archivo de texto para datos tabulares. |
| **Contra entrega** | Servicio donde el repartidor cobra al destinatario y rinde al cliente B2B. |
| **PWA** | Progressive Web App. Aplicación web instalable en el celular. |
| **Rendición** | Proceso de transferir al cliente B2B el dinero cobrado en contra entrega, descontando la comisión. |

---

## 11. Soporte y contacto

**Para consultas, problemas o sugerencias:**

- **Email:** contacto.enclogistica@gmail.com
- **Teléfono / WhatsApp:** +595 985 294 540
- **Horario de atención:** lunes a viernes, 08:00 a 18:00.
- **Tiempo de respuesta:** 24 horas hábiles.

---

## 12. Control de cambios

| **Versión** | **Fecha** | **Cambios** | **Autor** |
|-------------|-----------|-------------|-----------|
| 1.0.0 | 2026-10-28 | Versión inicial del manual del cliente B2B. | Pedro José Pirovani |

---

**Fin del documento.**