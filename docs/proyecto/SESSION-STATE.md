# Session State — enc-logistica

**Actualizado:** 2026-10-26

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Fase 14 (Portal B2B) o Fase 14-pre (Landing comercial).
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado.
- [x] SMTP con Gmail confirmado.
- [x] Fase 9: Ausente + reintento + C.I. en producción.
- [x] Fase 10: tarifa_flete + cobrado + devuelto + tope 2 intentos en producción.
- [x] Fase 11: multi-origen en producción.
- [x] Fase 12: gestión clientes B2B en producción.
- [x] Fase 13-bis: PWA + responsive mobile-first. Verificado en celular real.
- [x] Fase 13: reportes CSV diario + mensual en producción.

## Follow-ups (tareas diferidas)

- [ ] Fase 14: portal B2B (login separado, solo lectura).
- [ ] Fase 14-pre: rediseñar landing pública `/` orientada a captación B2B + redirect a /dashboard si autenticado.
- [ ] Fase 15: facturación electrónica (SIFEN).
- [ ] Fase 13-ter: PDF (en lugar de CSV) para reportes.
- [ ] Fase 13-ter: cámara + GPS en modal de entregar.
- [ ] Fase 13-ter: offline completo con sync.
- [ ] Multi-repartidor (campo paquetes.asignado_a).
- [ ] Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- [ ] Verificar que 001_clientes.sql no rompa si se corre fresh.
- [ ] Tests automatizados (Vitest + Playwright).
- [ ] Dominio propio (enclogistica.com.py).

## Decisiones de la sesión

- Fase 13: Reportes por cliente (CSV diario + mensual).
  - Route Handlers en /api/reportes/diario y /api/reportes/mensual.
  - Autenticación obligatoria (401 si no hay sesión).
  - Cálculos separados: tarifa_flete, monto_cobro, comision_cobro, importe_a_rendir, importe_a_facturar.
  - NO descuenta comisión de facturación del flete sin regla explícita.
  - UI: /dashboard/reportes con tabs Diario/Mensual + selector cliente + descarga.
  - Link "Reportes" en headers de /dashboard y /dashboard/clientes.
  - Formato: CSV (sin dependencias nuevas). PDF queda para Fase 13-ter.

## Próximos 3 pasos (para la próxima sesión)

1. Decidir: Fase 14 (Portal B2B) o Fase 14-pre (Landing comercial).
2. Fase 14-pre: rediseñar landing `/` con servicios + contacto + CTA + redirect si autenticado.
3. Fase 14: portal B2B con login separado (solo lectura).