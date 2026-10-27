import Link from 'next/link';
import { LEGAL } from '@/lib/legal';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="mb-2">
          <span className="text-white font-bold">ENC</span> <span className="text-[#E63946] font-bold">Logística</span>
        </p>
        <p className="text-sm mb-1">Logística de última milla en Encarnación, Paraguay.</p>
        <p className="text-xs mb-4">{LEGAL.titular} — RUC {LEGAL.ruc}</p>
        <div className="flex flex-wrap gap-4 justify-center text-sm mb-4">
          <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
          <Link href="/terminos" className="hover:text-white">Términos</Link>
          <Link href="/login" className="hover:text-white">Iniciar Sesión</Link>
          <a href={`mailto:${LEGAL.email}`} className="hover:text-white">Email</a>
        </div>
        <p className="text-xs mt-6">© 2026 ENC Logística. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}