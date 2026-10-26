# Session State — enc-logistica

**Actualizado:** 2026-10-26

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Fase 13 (reportes por cliente + facturación).
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado (https://enc-logistica.vercel.app).
- [x] SMTP con Gmail confirmado.
- [x] Fase 9: Ausente + reintento + C.I. verificados en producción.
- [x] Fase 10: tarifa_flete + cobrado + devuelto + tope 2 intentos en producción.
- [x] Fase 11: multi-origen (departamentos + ciudades + cascada) en producción.
- [x] Fase 12: gestión clientes B2B en producción.
- [x] Fase 13-bis: PWA + responsive mobile-first. Verificado en celular real (se ve genial).

## Follow-ups (tareas diferidas)

- [ ] Fase 13: reportes por cliente + facturación (PDF/Excel).
- [ ] Fase 14: portal B2B (login separado).
- [ ] Fase 15: facturación electrónica (SIFEN).
- [ ] Multi-repartidor (campo paquetes.asignado_a).
- [ ] Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- [ ] Verificar que 001_clientes.sql no rompa si se corre fresh.
- [ ] Tests automatizados (Vitest + Playwright).
- [ ] Dominio propio (enclogistica.com.py).
- [ ] Cámara + GPS en modal de entregar (Fase 13-ter).
- [ ] Offline completo con sync (Fase 13-ter).

## Decisiones de la sesión

- Fase 12: gestión de clientes B2B (página separada + form inline + selector en paquete).
- Fase 13-bis: PWA + responsive mobile-first.
  - Service Worker: network-first para páginas públicas, cache-first para assets, network-only para /dashboard.
  - Install prompt: solo en mobile, sessionStorage para no molestar.
  - Responsive: cards en mobile (<768px), tabla en desktop (>=768px).
  - Touch-friendly: botones py-3, inputs p-3, checkbox w-5 h-5.

## Próximos 3 pasos (para la próxima sesión)

1. Fase 13: reportes por cliente (PDF/Excel diario).
2. Fase 13: facturación (total por cliente, comisiones, rendición).
3. Fase 14: portal B2B (login separado, solo lectura).