# Session State — enc-logistica

**Actualizado:** 2026-10-28

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Fase 15 (Facturación SIFEN) o Fase 14.7 (Google OAuth).
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado.
- [x] SMTP con Gmail confirmado.
- [x] Fases 9-14 verificadas en producción.
- [x] Portal B2B funcionando (login, dashboard, reportes, invitación).
- [x] Ley 6534/2020 documentada y aplicada.

## Follow-ups (tareas diferidas)

- [ ] Fase 14.7: Google OAuth en /portal/login y /portal/register.
- [ ] Fase 15: Facturación electrónica (SIFEN).
- [ ] Fase 16: Tracking público para destinatario.
- [ ] Fase 16: Política de privacidad + Términos y condiciones.
- [ ] Fase 16: Email de notificación al destinatario (Ley 6534/2020).
- [ ] Multi-repartidor (campo paquetes.asignado_a).
- [ ] Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- [ ] Verificar que 001_clientes.sql no rompa si se corre fresh.
- [ ] Tests automatizados (Vitest + Playwright).
- [ ] Dominio propio (enclogistica.com.py).
- [ ] Migración a Zod 4 (CVE no explotable en app, pero buena práctica).

## Decisiones de la sesión (Fase 14 completa)

- **Portal B2B** con login separado (`/portal/*`) + dashboard del cliente + reportes CSV.
- **Vinculación automática por email**: cliente se registra con el email del `clientes.email`. Si coincide, vincula. Si no, "contactanos".
- **Invitación por WhatsApp**: el operador clic "Invitar" en `/dashboard/clientes` → genera mensaje pre-armado con link `?email=X`.
- **Ley 6534/2020**: el portal B2B NO muestra `retirado_por`, `retirado_por_ci`, `observaciones`. Los reportes del portal tampoco.
- **Route Handlers separados**: operador (con datos completos) vs cliente B2B (datos filtrados por Ley).
- **PasswordInput con Eye/EyeOff**: toggle mostrar/ocultar en 4 páginas (login/register operador + portal).
- **SW cache v2** + banner "Nueva versión disponible".
- **APP_VERSION = 0.9.0** (SemVer) en `lib/config.ts`.
- **Landing pública** (`/`) con hero, nosotros, servicios, contacto (WhatsApp + email).

## Próximos 3 pasos (para la próxima sesión)

1. Decidir: Fase 14.7 (Google OAuth) o Fase 15 (SIFEN).
2. Fase 14.7: configurar Google Cloud Console + Supabase OAuth (30 min).
3. Fase 15: integración con DNIT para facturación electrónica.