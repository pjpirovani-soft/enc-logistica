# ACTA DE CIERRE TÉCNICO CON RESERVAS
## Proyecto ENC Logística — Versión 1.3.2

**Fecha:** 29 de octubre de 2026
**Repositorio:** https://github.com/pjpirovani-soft/enc-logistica
**Rama declarada:** `master`
**Commit de referencia:** `888cb7e`
**Commit anterior relacionado:** `9a24f23`

### 1. Objeto

La presente acta documenta el estado de cierre de la auditoría técnica de seguridad de ENC Logística v1.3.2, identificando las correcciones informadas, las evidencias disponibles y las reservas que impiden considerar todos los controles plenamente verificados en producción.

El cierre se emite **con reservas**, sin equivaler a una certificación integral de seguridad ni a una garantía de ausencia de vulnerabilidades.

### 2. Estado de los hallazgos

| ID | Hallazgo | Estado |
|---|---|---|
| H-01 | Asignación de roles y privilegios de usuarios | Pendiente de validación en producción |
| H-02 | Políticas RLS de la tabla `clientes` | Pendiente de validación en producción |
| H-03 | Permisos SQL excesivos | Pendiente de validación en producción |
| H-04 | Limitación de intentos de autenticación (*rate limiting*) | Corrección informada y prueba de concurrencia aportada; publicación remota pendiente de conciliación independiente |
| H-05 | Tratamiento de datos personales y respuesta del endpoint de contacto | Corrección previamente informada; requiere validación funcional y de producción para confirmar el cierre |
| H-06 | Riesgo de seguridad asociado a la dependencia Zod | Riesgo aceptado y documentado en `BITACORA.md`; no se declara vulnerabilidad corregida |

### 3. Evidencias declaradas

Para H-04, el responsable del proyecto aporta las siguientes evidencias:

- Verificación mediante `git show HEAD:supabase/migrations/012_funcion_check_rate_limit.sql` de la presencia de `ON CONFLICT (ip, ruta) DO NOTHING`.
- Verificación de la invocación de `supabase.rpc('check_rate_limit', ...)` en `lib/auth-actions.ts`.
- Referencia a `888cb7e` como último commit de `master` y `origin/master`.
- Ejecución informada de la función corregida en Supabase.
- Prueba informada de diez solicitudes concurrentes, con cinco intentos contabilizados y cinco solicitudes adicionales bloqueadas.

Estas pruebas respaldan la corrección de H-04, pero los resultados de ejecución se registran como evidencia aportada por el responsable y no como una prueba reproducida de manera independiente durante esta auditoría.

### 4. Reservas expresas

**Reserva A — H-01, H-02 y H-03.** La existencia de las migraciones `009` y `010` en el repositorio no acredita por sí sola que se hayan aplicado correctamente ni que las políticas y permisos efectivos de producción sean los previstos. Se requiere validación en Supabase.

**Reserva B — H-04.** La consulta independiente de GitHub realizada durante la revisión mostró contenido que no coincidía con la evidencia local aportada. Se debe conciliar la discrepancia comprobando el contenido remoto de `master`, el identificador del commit desplegado y la migración efectivamente aplicada en Supabase. Hasta entonces, el cierre de este hallazgo queda condicionado a esa verificación.

**Reserva C — H-05.** El cierre definitivo requiere comprobar el comportamiento real del endpoint, el tratamiento de los datos personales y la entrega efectiva de las comunicaciones previstas.

**Reserva D — H-06.** La aceptación documentada del riesgo no implica que la dependencia esté libre de vulnerabilidades. La aceptación debe quedar asociada a una evaluación de exposición, medidas compensatorias y revisión futura de la dependencia.

### 5. Condiciones para el cierre definitivo

Para levantar las reservas deberán completarse, como mínimo, las siguientes comprobaciones:

1. Confirmar que el código remoto de `master` corresponde a la versión revisada.
2. Confirmar que Vercel despliega el commit previsto.
3. Verificar en Supabase las políticas RLS, los permisos SQL y las migraciones aplicadas.
4. Reproducir la prueba de concurrencia de H-04 sobre la versión desplegada.
5. Validar el endpoint de contacto en el entorno correspondiente.
6. Mantener documentada la aceptación del riesgo H-06 y establecer un criterio de revisión.

### 6. Dictamen

Se emite el presente documento como **acta de cierre técnico con reservas** para ENC Logística v1.3.2.

El estado documental permite cerrar la etapa de revisión inicial con observaciones pendientes, pero no declarar que todos los hallazgos están definitivamente resueltos. H-01, H-02 y H-03 quedan sujetos a validación de producción; H-04 queda condicionado a la conciliación independiente de la publicación remota; H-05 requiere confirmación funcional y H-06 permanece como riesgo aceptado.

**Responsable técnico:** Pedro José Pirovani
**Revisor de auditoría:** ChatGPT (IA)
**Fecha de levantamiento de reservas:** (Pendiente)
**Resultado de la validación final:** (Pendiente)