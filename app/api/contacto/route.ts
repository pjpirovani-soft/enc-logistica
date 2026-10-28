import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactoSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  mensaje: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Simulamos el envío de correo (en el futuro se conecta con Nodemailer o Resend)
    console.log('📧 Email de contacto recibido:', parsed.data);
    console.log('📤 Enviando a: contacto.enclogistica@gmail.com');

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}