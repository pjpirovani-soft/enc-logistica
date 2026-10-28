import Link from 'next/link';
import { ArrowLeft, BookOpen, MessageCircle } from 'lucide-react';

export default function AyudaPortalPage() {
  return (
    <div className="min-h-screen bg-[#F1F3F5] p-4 md:p-8 text-black">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-[#E63946]">
          <Link href="/portal" className="text-[#0A2540] hover:text-[#E63946]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-[#0A2540]">Centro de Ayuda — Cliente B2B</h1>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Guías rápidas
            </h2>
            <p className="text-gray-600 mb-4">Todo lo que necesitás saber para usar tu portal:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Ver tus paquetes:</strong> En el dashboard ves todos tus envíos con su estado actual.</li>
              <li><strong>Descargar reportes:</strong> Hacé clic en "Reportes" y elegí si querés el diario o el mensual.</li>
              <li><strong>Estados:</strong> "En Ruta" (en camino), "Entregado" (recibido), "Ausente" (no estaba), "Devuelto" (volvió a bodega).</li>
            </ul>
          </section>

          <section className="border-t pt-6">
            <h2 className="text-xl font-bold text-[#0A2540] mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> ¿Necesitás más ayuda?
            </h2>
            <p className="text-gray-600">Escribinos a <a href="mailto:contacto.enclogistica@gmail.com" className="text-[#E63946] font-bold">contacto.enclogistica@gmail.com</a> o al WhatsApp +595 985 294 540.</p>
          </section>
        </div>
      </div>
    </div>
  );
}