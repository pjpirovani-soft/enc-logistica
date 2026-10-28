# Manual del Operador — ENC Logística

**Última actualización:** 2026-10-28

> Guía para usar el dashboard operativo. Para el portal del cliente B2B, ver `CLIENTE-B2B.md`.

---

## 1. Acceso

### Iniciar sesión

1. Andá a `https://enc-logistica.vercel.app/login`.
2. Ingresá tu email (`pirovanipedrojose@gmail.com`) y contraseña.
3. Clic en **"Ingresar"**.
4. Te redirige a `/dashboard`.

### Cerrar sesión

1. En cualquier página, clic en **"Cerrar Sesión"** (arriba a la derecha).
2. Te redirige a `/login`.

---

## 2. Dashboard principal (`/dashboard`)

### Qué ves

- **Header:** logo, link "Reportes", link "Clientes B2B", botón "Cerrar Sesión".
- **Formulario "Registrar Nuevo Paquete":** para cargar paquetes.
- **Tabla "Paquetes en Sistema":** con filtros por estado.

### Crear un paquete

1. En el formulario, completá:
   - **N° de Guía:** el número de la encomienda (ej: `TEST-001`).
   - **Cliente Origen:** elegí de la lista de clientes B2B registrados, o "Otro (texto libre)", o "+ Nuevo cliente B2B".
   - **Departamento Origen:** elegí de los 18 departamentos.
   - **Ciudad Origen:** elegí de las 88 ciudades cargadas.
   - **Destinatario (Encarnación):** nombre del que recibe.
   - **Dirección:** domicilio en Encarnación.
   - **Teléfono:** del destinatario.
   - **Tipo de Servicio:** "Entrega Normal" o "Cobro Contra Entrega".
   - **Monto a Cobrar (Gs.):** si es contra entrega.
   - **Tarifa Flete (Gs.):** default 22.000.
2. Clic en **"Agregar a la Ruta"**.
3. El paquete aparece en la tabla con estado **"En Ruta"**.

### Cambiar estado de un paquete

**Entregar:**
1. Clic en **"Entregar"** en la fila del paquete.
2. Se abre un modal con:
   - Quién retiró (nombre).
   - C.I. del retirador.
   - Observaciones (opcional).
   - Checkbox "Confirma cobro" (si es contra entrega).
3. Clic en **"Confirmar entrega"**.
4. El paquete pasa a **"Entregado"**.
5. Aparece botón **"Avisar por WhatsApp"**.

**Cliente Ausente:**
1. Clic en **"Ausente"**.
2. Se abre un textarea para observación.
3. Clic en **"Confirmar"**.
4. El paquete pasa a **"Ausente"** con "Intento #N fallido".

**Reintentar entrega:**
1. Si el paquete está "Ausente" y `intentos < 2`.
2. Clic en **"Reintentar entrega"**.
3. El paquete vuelve a **"En Ruta"**.
4. El contador de intentos sube a 2.

**Devolver a remitente:**
1. Si el paquete está "Ausente" y `intentos = 2`.
2. Clic en **"Devolver a remitente"**.
3. El paquete pasa a **"Devuelto"**.

---

## 3. Gestión de clientes B2B (`/dashboard/clientes`)

### Ver clientes

1. Clic en **"Clientes B2B"** en el header del dashboard.
2. Ves la tabla con:
   - Nombre, RUC, Teléfono, Email, Tarifa Base, Comisión, Portal.
   - **Portal:** "✅ Vinculado" o botón "Invitar".

### Crear cliente

1. Clic en **"+ Nuevo Cliente B2B"**.
2. Completá:
   - **Nombre:** del cliente (ej: "Tienda Moda S.A.").
   - **RUC:** obligatorio para facturación.
   - **Teléfono:** para contacto.
   - **Email:** obligatorio para vincular al portal.
   - **Tarifa Base (Gs.):** default 22.000.
   - **Comisión (%):** default 3%.
   - **Máx. Intentos:** default 2.
3. Clic en **"Crear Cliente"**.

### Invitar cliente al portal

**Requisito:** el cliente debe tener email cargado.

1. En la tabla de clientes, buscá el cliente sin `✅ Vinculado`.
2. Clic en **"Invitar"**.
3. Se abre un modal con:
   - Email del cliente.
   - Link de registro con `?email=X` pre-cargado.
   - Botón "Enviar invitación por WhatsApp".
   - Botón "Copiar link de registro".
4. Clic en **"Enviar invitación por WhatsApp"**.
5. Se abre WhatsApp con mensaje pre-armado.
6. El cliente clic en el link → se registra → **se vincula automáticamente**.

**Si el cliente no se vincula:**
- Verificá que el email del registro coincida con `clientes.email`.
- Si no coincide, editá el cliente con el email correcto.

---

## 4. Reportes (`/dashboard/reportes`)

### Descargar reporte diario

1. Clic en **"Reportes"** en el header.
2. Tab **"Diario"**.
3. Elegí cliente + fecha.
4. Clic en **"Descargar CSV diario"**.
5. Se descarga un archivo `.csv` con:
   - Resumen (entregados, ausentes, etc.).
   - Totales (tarifa, cobro, comisión, a rendir, a facturar).
   - Detalle de paquetes.

### Descargar reporte mensual

1. Tab **"Mensual"**.
2. Elegí cliente + mes.
3. Clic en **"Descargar CSV mensual"**.

### Verificar datos

**Abrí el CSV en Excel/Google Sheets:**

- **Entregados:** cantidad de paquetes entregados.
- **Total tarifa flete:** lo que se factura al cliente B2B.
- **Total monto cobrado:** lo que se cobró en contra entrega.
- **Total comisión:** 3% del monto cobrado.
- **Total a rendir:** monto cobrado - comisión.
- **Total a facturar:** tarifa flete (NO descuenta comisión).

---

## 5. PWA (Progressive Web App)

### Instalar en el celular

**Android:**
1. Abrí `https://enc-logistica.vercel.app/` en Chrome.
2. Menú ⋮ → "Instalar aplicación".
3. Aceptar.

**iOS:**
1. Abrí en Safari.
2. Compartir → "Añadir a pantalla de inicio".

### Actualizar la PWA

Cuando cambia el código, la PWA se actualiza automáticamente. Si ves el banner **"Nueva versión disponible"**:
1. Clic en **"Actualizar"**.
2. Se recarga con la última versión.

### Limpiar cache (si algo no se actualiza)

**Android:**
1. Configuración del sitio → Borrar datos.

**iOS:**
1. Ajustes → Safari → Borrar historial y datos.

---

## 6. Problemas comunes

### "No veo el link de Reportes"

- Recargá con `Ctrl+Shift+R`.
- Verificá que estés en `/dashboard` (no en `/portal`).

### "El cliente no aparece como Vinculado"

- Verificá que el email del cliente coincida con `clientes.email`.
- Si no coincide, editá el cliente.

### "El modal no se abre"

- Verificá que estés en `/dashboard/clientes` (no en `/portal`).
- Recargá la página.

### "La PWA no se actualiza"

- Cerrá la PWA y abrila de nuevo.
- Si no funciona, desinstalá y reinstalá.

---

## 7. Contacto

- **Email:** contacto.enclogistica@gmail.com
- **Teléfono:** +595 985 294 540
- **Domicilio:** Encarnación, Itapúa, Paraguay