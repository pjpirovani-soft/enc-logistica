# Toma de Decisiones — enc-logistica

## Prioridades (en orden)

1. **Seguridad.** Nunca comprometer RLS, auth, o validación por velocidad.
2. **Funcionalidad.** Que el MVP funcione, aunque no sea elegante.
3. **Mantenibilidad.** Código legible > código clever.
4. **Performance.** Optimizar solo cuando hay problema medible.
5. **Estética.** Última prioridad.

## Cuándo preguntar vs. cuándo asumir

**Preguntar:**
- Ambigüedad en requisitos.
- Decisiones de negocio (qué pasa si X).
- Trade-offs con impacto en el cliente.

**Asumir (y documentar en ARCHITECTURE.md):**
- Decisiones técnicas con default claro.
- Convenciones de código (naming, estructura).
- Librerías estándar del stack.

## Trade-offs documentados (ADR)

Cada decisión con impacto va a ARCHITECTURE.md como ADR:
- **Contexto:** qué problema.
- **Decisión:** qué se eligió.
- **Alternativas:** qué se descartó y por qué.
- **Consecuencias:** qué implica.

## Anti-patrones (evitar)

- Over-engineering: capas de abstracción que no se usan.
- Premature optimization: índices en tablas vacías.
- Copy-paste sin entender.
- Silent failures: catch {} vacío.
- Secretos en código.
