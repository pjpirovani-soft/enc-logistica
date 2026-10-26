# Glosario — enc-logistica

## Términos del studio

- **Blueprint:** plantilla de proyecto (código funcional + tests + config) que se copia para crear un proyecto nuevo.
- **Cliente:** proyecto concreto en clients/. Se origina copiando un blueprint.
- **Sesión:** unidad de trabajo. Empieza con STATUS.md, termina con commit + push.
- **Dump:** volcado de contexto (repo + docs + código) para pegar a una IA en una sesión nueva.
- **CDD:** Context-Driven Development. Metodología del studio.
- **ADR:** Architecture Decision Record. Decisión técnica documentada.
- **MVP:** Minimum Viable Product. Versión mínima que funciona.

## Términos del dominio (enc-logistica)

- **Paquete:** envío individual identificado por N° de guía.
- **Guía (N° de guía):** identificador único del paquete (ej: TEST-620700).
- **Cliente B2B:** empresa (tienda online, distribuidora) que contrata el servicio. Puede estar registrada (tabla `clientes`) o ser informal (texto `cliente_asuncion`).
- **Destinatario:** persona que recibe el paquete en Encarnación. No confundir con cliente B2B.
- **Origen:** ciudad + departamento desde donde se envía el paquete (ej: Ciudad del Este / Alto Paraná).
- **Destino:** ciudad + departamento donde se entrega el paquete. Por ahora, siempre Encarnación o Gran Encarnación.
- **Gran Encarnación:** Encarnación + Cambyretá + Capitán Miranda + San Juan del Paraná.
- **Tipo de servicio:**
  - **Normal:** solo entrega, sin cobro.
  - **Contra Entrega:** el repartidor cobra `monto_cobro` al destinatario y lo rinde al cliente B2B.
- **Tarifa flete:** lo que se cobra al cliente B2B por el servicio de entrega (default Gs. 22.000).
- **Monto cobro:** lo que se cobra al destinatario en contra entrega.
- **Comisión:** 3% del `monto_cobro` que se queda el repartidor (configurable por cliente).
- **Intentos de entrega:** contador de visitas al domicilio (1er intento, 2do intento, etc.).
- **Estado "Ausente":** el cliente no estaba en el domicilio.
- **Estado "Devuelto":** después del tope de intentos, el paquete vuelve al cliente B2B.
- **Estado "En Ruta":** el paquete está en poder del repartidor, pendiente de entrega.
- **Estado "Entregado":** el destinatario recibió el paquete.
- **Estado "Cancelado":** el paquete no se entrega por decisión del cliente B2B.
- **Hub regional:** Encarnación como centro de recepción y distribución regional (recibe de todo el país, entrega en el sur).
- **Rendición:** proceso de transferir al cliente B2B el dinero cobrado en contra entrega (descontando comisión).