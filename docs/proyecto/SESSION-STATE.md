# Session State — enc-logistica

**Actualizado:** 2026-10-26

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Fase 13-bis (PWA + responsive) - pendiente Service Worker + Install Prompt + mobile-first.
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado (https://enc-logistica.vercel.app).
- [x] SMTP con Gmail confirmado.
- [x] Fase 9: Ausente + reintento + C.I. verificados en producción.
- [x] Fase 10: tarifa_flete + cobrado + devuelto + tope 2 intentos en producción.
- [x] Fase 11: multi-origen (departamentos + ciudades + cascada) en producción.
- [x] Fase 12: gestión clientes B2B en producción.
- [x] Fase 13-bis (inicio): PWA manifest + metadata.
- [ ] Fase 13-bis (completar): Service Worker + Install Prompt + responsive mobile.
- [ ] Verificar en producción: crear paquete con cliente B2B (TEST-B2B-001).

## Follow-ups (tareas diferidas)

- [ ] Fase 13-bis (completar): Service Worker + Install Prompt + responsive mobile.
- [ ] Fase 13: reportes por cliente + facturación (PDF/Excel).
- [ ] Fase 14: portal B2B (login separado).
- [ ] Fase 15: facturación electrónica (SIFEN).
- [ ] Multi-repartidor (campo paquetes.asignado_a).
- [ ] Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- [ ] Verificar que 001_clientes.sql no rompa si se corre fresh.
- [ ] Tests automatizados (Vitest + Playwright).
- [ ] Dominio propio (enclogistica.com.py).

## Decisiones de la sesión

- Fase 12: gestión de clientes B2B (página separada + form inline + selector en paquete).
- Decisión de producto: pausar Fase 13 (reportes) y hacer primero Fase 13-bis (PWA + mobile).
- Razón: sin responsive + PWA, la app NO es usable en la calle (vos, con el Ractis).

## Próximos 3 pasos (para la próxima sesión)

1. Fase 13-bis: Service Worker (public/sw.js + registro + install prompt).
2. Fase 13-bis: responsive mobile-first (tablas -> cards, forms apilados).
3. Verificar en producción: instalar PWA en celular, probar flujos.