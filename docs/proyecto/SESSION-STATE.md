# Session State — enc-logistica

**Actualizado:** 2026-10-28

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Validación con clientes reales o Fase 14.7 (Google OAuth).
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado.
- [x] SMTP con Gmail confirmado.
- [x] Fases 9-17 verificadas en producción.
- [x] Portal B2B funcionando (login, dashboard, reportes, invitación, ayuda).
- [x] Ley 6534/2020 documentada y aplicada.
- [x] Formulario de contacto y links cruzados funcionando.
- [x] Fix RLS en departamentos y ciudades.

## Follow-ups (tareas diferidas)

- [ ] Fase 14.7: Google OAuth en /portal/login y /portal/register.
- [ ] Fase 15: Facturación electrónica (SIFEN).
- [ ] Fase 18: Tracking público para destinatario.
- [ ] Multi-repartidor (campo paquetes.asignado_a).
- [ ] Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- [ ] Tests automatizados (Vitest + Playwright).
- [ ] Dominio propio (enclogistica.com.py).
- [ ] Activar RUC de Pedro (6628192-0) en DNIT.
- [ ] Crear E.I.R.L. o S.R.L. cuando el negocio escale.

## Decisiones de la sesión (Fase 17)

- **Formulario de Contacto:** API Route `/api/contacto` (simula envío de email, listo para Nodemailer).
- **Centro de Ayuda:** Páginas `/dashboard/ayuda` y `/portal/ayuda` con guías rápidas.
- **Links Cruzados:** Operador y cliente pueden saltar de un login a otro.
- **CTA en PDF:** WhatsApp y Email al final del documento.
- **Fix RLS (Migración 008):** Destrabó la lectura de los 18 departamentos y 92 ciudades.

## Próximos 3 pasos (para la próxima sesión)

1. Validar con 2-3 clientes reales (enviar PDF y usar el formulario de contacto).
2. Fase 14.7: Google OAuth (30 min).
3. Fase 18: Tracking público + email de notificación.