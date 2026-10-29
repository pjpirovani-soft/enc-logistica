import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // El Rate Limiting real ahora se hace en la API Route de contacto
  // y en la Server Action de login (que corren en Node.js, no en Edge).
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/contacto', '/login', '/portal/login'],
};