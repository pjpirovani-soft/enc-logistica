# Session State — enc-logistica

**Actualizado:** 2026-10-28

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Fase 14.7 (Google OAuth) o Fase 15 (SIFEN) o Fase 17 (tracking público).
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado.
- [x] SMTP con Gmail confirmado.
- [x] Fases 9-14 verificadas en producción.
- [x] Portal B2B funcionando (login, dashboard, reportes, invitación).
- [x] Ley 6534/2020 documentada y aplicada.
- [x] Términos y Condiciones + Política de Privacidad en producción.
- [x] Titular legal documentado (Luciana Noelia Da Silva, RUC 8971446-6).
- [x] Contacto operativo (Pedro José Pirovani) en lib/legal.ts.
- [x] Links legales accesibles desde landing, portal y dashboard.

## Follow-ups (tareas diferidas)

- [ ] Fase 14.7: Google OAuth en /portal/login y /portal/register.
- [ ] Fase 15: Facturación electrónica (SIFEN) — requiere RUC activo de Pedro o E.I.R.L.
- [ ] Fase 17: Tracking público para destinatario.
- [ ] Fase 17: Email de notificación al destinatario (Ley 6534/2020).
- [ ] Multi-repartidor (campo paquetes.asignado_a).
- [ ] Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- [ ] Verificar que 001_clientes.sql no rompa si se corre fresh.
- [ ] Tests automatizados (Vitest + Playwright).
- [ ] Dominio propio (enclogistica.com.py).
- [ ] Migración a Zod 4 (CVE no explotable en app, pero buena práctica).
- [ ] Activar RUC de Pedro (6628192-0) en DNIT.
- [ ] Crear E.I.R.L. o S.R.L. cuando el negocio escale.

## Decisiones de la sesión (Fases 14 y 16)

- **Portal B2B** con login separado (`/portal/*`) + dashboard del cliente + reportes CSV.
- **Vinculación automática por email**: cliente se registra con el email del `clientes.email`. Si coincide, vincula. Si no, "contactanos".
- **Invitación por WhatsApp**: el operador clic "Invitar" en `/dashboard/clientes` → genera mensaje pre-armado con link `?email=X`.
- **Ley 6534/2020**: el portal B2B NO muestra `retirado_por`, `retirado_por_ci`, `observaciones`. Los reportes del portal tampoco.
- **Route Handlers separados**: operador (con datos completos) vs cliente B2B (datos filtrados por Ley).
- **PasswordInput con Eye/EyeOff**: toggle mostrar/ocultar en 4 páginas.
- **SW cache v2** + banner "Nueva versión disponible".
- **APP_VERSION = 1.0.0** (SemVer) en `lib/config.ts`.
- **Términos y Condiciones + Política de Privacidad**: implementadas con 13 y 11 secciones respectivamente.
- **Titular legal:** Luciana Noelia Da Silva, RUC 8971446-6 (activo). Facturación a su nombre.
- **Contacto operativo:** Pedro José Pirovani. RUC 6628192-0 (en proceso de activación).
- **Roadmap legal:** Fase 1 (RUC de Luciana) → Fase 2 (definir titular cuando Pedro active RUC) → Fase 3 (E.I.R.L. o S.R.L.).
- **Accesibilidad legal:** links a `/privacidad` y `/terminos` en header de landing + footer de `/portal` y `/dashboard`.
- **Checkbox de aceptación:** obligatorio en `/register` y `/portal/register`.

## Próximos 3 pasos (para la próxima sesión)

1. Decidir: Fase 14.7 (Google OAuth) o Fase 15 (SIFEN) o Fase 17 (tracking público).
2. Fase 14.7: configurar Google Cloud Console + Supabase OAuth (30 min).
3. Fase 17: tracking público + email de notificación (más simple que SIFEN).