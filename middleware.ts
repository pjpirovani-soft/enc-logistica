import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Almacén simple en memoria para el Rate Limiting (se reinicia al reiniciar el servidor)
// En producción a gran escala, se usaría Upstash Redis o Vercel KV.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 3; // 3 peticiones por minuto por IP

export function middleware(request: NextRequest) {
  // Solo aplicar Rate Limiting a la ruta de la API de contacto
  if (request.nextUrl.pathname === '/api/contacto' && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const windowData = rateLimitMap.get(ip);

    if (windowData) {
      // Si la ventana de tiempo expiró, reiniciar contador
      if (now - windowData.lastReset > WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return NextResponse.next();
      }

      // Si superó el límite, bloquear
      if (windowData.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Demasiadas solicitudes. Por favor, intentá de nuevo en un minuto.' },
          { status: 429 }
        );
      }

      // Incrementar contador
      windowData.count++;
    } else {
      // Primera petición de esta IP
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/contacto',
};