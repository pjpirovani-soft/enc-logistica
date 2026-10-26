# Changelog — enc-logistica

Formato basado en Keep a Changelog y Semantic Versioning.

## [Unreleased]

## [0.4.0] - 2026-10-26

### Added
- Fase 11: Multi-origen con tablas `departamentos` (18), `ciudades` (88), `clientes` (B2B).
- Cascada Departamento -> Ciudad en formulario.
- Columna "Origen" en tabla de paquetes.
- ADRs documentados en ARCHITECTURE.md (ADR-001, ADR-002, ADR-003).
- Migración SQL 005 versionada.

### Changed
- `paquetes` ahora tiene `departamento_origen`, `ciudad_origen`, `cliente_id`.

### Fixed
- Backfill de paquetes existentes a Asunción.

## [0.3.0] - 2026-10-26

### Added
- Fase 10: `tarifa_flete`, `cobrado`, `devuelto_a_remitente`.
- Tope de 2 intentos de reintento (protocolo).
- Estado "Devuelto" en CHECK de estado.
- Checkbox "Confirma cobro" en modal Entregar (solo contra entrega).
- Columna "Tipo" en tabla de paquetes.
- Migración SQL 004 versionada.

### Changed
- `marcarEntregado` acepta `cobrado: boolean`.
- `reintentarEntrega` chequea tope y pasa a 'Devuelto'.

## [0.2.0] - 2026-10-25

### Added
- Fase 9: Estado "Ausente" + flujo de reintento.
- Campos `observaciones`, `retirado_por`, `retirado_por_ci`, `intentos_entrega`, `fecha_entrega`, `fecha_ausente`.
- Componente `PaqueteAcciones.tsx` (client) con modales.
- Migración SQL 003 versionada.

### Fixed
- Encoding del dashboard (adiós "LogÃ­stica").
- `crearPaquete` restaurado (commit 4cb7c63).

## [0.1.0] - 2026-10-24

### Added
- Proyecto creado desde blueprint web-app.
- Fases 1-8: auth, UI, lógica básica, deploy, documentos de negocio.