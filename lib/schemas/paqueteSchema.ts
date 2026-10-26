import { z } from 'zod';

export const paqueteSchema = z.object({
  nro_guia: z.string().min(1, 'El numero de guia es obligatorio'),
  cliente_asuncion: z.string().min(1, 'El nombre del cliente es obligatorio'),
  destinatario: z.string().min(1, 'El nombre del destinatario es obligatorio'),
  direccion: z.string().min(1, 'La direccion es obligatoria'),
  telefono: z.string().optional(),
  tipo_servicio: z.enum(['Normal', 'Contra Entrega']),
  monto_cobro: z.coerce.number().min(0, 'El monto no puede ser negativo').default(0),
  tarifa_flete: z.coerce.number().min(0, 'La tarifa no puede ser negativa').default(22000),
});

export type PaqueteFormData = z.infer<typeof paqueteSchema>;