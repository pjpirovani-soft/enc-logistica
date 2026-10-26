# Session State — enc-logistica

**Actualizado:** 2026-10-26

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Fase 12 (refactor cliente_id + UI clientes B2B).
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado (https://enc-logistica.vercel.app).
- [x] SMTP con Gmail confirmado.
- [x] Estado Ausente + reintento + entrega con C.I. (Fase 9) verificados en producción.
- [x] Tarifa flete + cobrado + devuelto + tope 2 intentos (Fase 10) en producción.
- [x] Multi-origen con departamentos/ciudades (Fase 11) en producción.

## Follow-ups (tareas diferidas)

- [ ] Fase 12: refactor crearPaquete para usar cliente_id. UI para crear/editar clientes B2B.
- [ ] Fase 13: reportes por cliente + facturación (PDF/Excel diario).
- [ ] Fase 14: portal B2B (login separado, ver sus paquetes).
- [ ] Limpiar app/dashboard/clientes/ (3 páginas huérfanas del blueprint).
- [ ] Mover app/actions/paquetes.ts a lib/actions/paquetes.ts según CONVENCIONES.md.
- [ ] Verificar que el archivo 001_clientes.sql no rompa si se corre fresh (es legacy).

## Decisiones de la sesión

- Fase 9: estado Ausente + reintento + C.I. + observaciones + fecha_entrega.
- Fase 10: tarifa_flete (default 22000), cobrado (boolean), devuelto_a_remitente (boolean), tope de 2 intentos.
- Fase 11: multi-origen con departamentos (18) + ciudades (88) + clientes B2B + cascada en formulario.
- ADRs documentados en ARCHITECTURE.md (multi-origen, cliente opcional, tope intentos).
- Migraciones SQL versionadas en supabase/migrations/ (003, 004, 005).

## Próximos 3 pasos (para la próxima sesión)

1. Ejecutar Fase 12: refactor crearPaquete para usar cliente_id.
2. UI para crear/editar clientes B2B (tabla clientes ya existe).
3. Reportes por cliente (Fase 13).