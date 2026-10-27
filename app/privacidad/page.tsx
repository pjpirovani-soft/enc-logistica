import Link from 'next/link';
import { LEGAL } from '@/lib/legal';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 pb-4 border-b-2 border-[#E63946]">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <img src="/alas-azul-transparente.png" alt="ENC Logística" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold text-[#0A2540]">
              ENC <span className="text-[#E63946]">Logística</span>
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A2540]">Política de Privacidad</h1>
          <p className="text-sm text-gray-500 mt-2">Última actualización: {LEGAL.ultimaActualizacion}</p>
        </header>

        <div className="prose prose-sm md:prose-base max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de los datos personales recolectados a través de esta plataforma es:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Nombre:</strong> {LEGAL.titular}</li>
              <li><strong>RUC:</strong> {LEGAL.ruc}</li>
              <li><strong>Nombre comercial:</strong> {LEGAL.nombreComercial}</li>
              <li><strong>Domicilio:</strong> {LEGAL.domicilio}</li>
              <li><strong>Email:</strong> {LEGAL.email}</li>
              <li><strong>Teléfono:</strong> {LEGAL.telefono}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">2. Marco legal</h2>
            <p>
              Esta política se rige por la <strong>Ley N° 6534/2020 de Protección de Datos Personales</strong> de la República del Paraguay, y demás normativas aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">3. Datos personales que recolectamos</h2>
            <p>Recolectamos los siguientes datos personales:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Del cliente B2B:</strong> nombre o razón social, RUC, email, teléfono, domicilio.</li>
              <li><strong>Del destinatario final:</strong> nombre, dirección, teléfono.</li>
              <li><strong>De la entrega:</strong> nombre del retirador, C.I. del retirador, fecha y hora de entrega, observaciones.</li>
              <li><strong>De la operación:</strong> número de guía, estado del paquete, monto de cobro contra entrega, tarifa de flete.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">4. Finalidad del tratamiento</h2>
            <p>Los datos personales son utilizados exclusivamente para:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Prestar el servicio de logística de última milla contratado.</li>
              <li>Gestionar la entrega de paquetes en el domicilio del destinatario.</li>
              <li>Emitir facturas legales y realizar la rendición de cuentas.</li>
              <li>Registrar la trazabilidad de las entregas (quién retiró, cuándo, cómo).</li>
              <li>Atender consultas, reclamos y solicitudes de los titulares.</li>
              <li>Cumplir con obligaciones legales, contables y tributarias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">5. Base legal del tratamiento</h2>
            <p>
              El tratamiento de los datos se basa en:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>El <strong>consentimiento</strong> del titular, otorgado al utilizar nuestros servicios.</li>
              <li>La <strong>ejecución del contrato</strong> de servicio de logística.</li>
              <li>El <strong>cumplimiento de obligaciones legales</strong> (facturación, contabilidad, trazabilidad).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">6. Destinatarios de los datos</h2>
            <p>
              Los datos personales del destinatario son compartidos con el <strong>cliente B2B</strong> que contrató el servicio, para fines de rendición de cuentas y trazabilidad. <strong>No compartimos datos con terceros no autorizados.</strong>
            </p>
            <p>
              El cliente B2B tiene la obligación de informar al destinatario final sobre el tratamiento de sus datos, en el momento de la compra o contratación del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">7. Derechos del titular</h2>
            <p>Los titulares de los datos tienen derecho a:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ellos.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Cancelación:</strong> solicitar la eliminación de sus datos.</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos.</li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, el titular debe enviar un email a <strong>{LEGAL.email}</strong>. Plazo de respuesta: <strong>15 días hábiles</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">8. Seguridad de los datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger los datos personales contra acceso no autorizado, pérdida o alteración. Los datos se almacenan en servidores seguros con cifrado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">9. Retención de datos</h2>
            <p>
              Los datos se conservan durante el tiempo necesario para cumplir con la finalidad del tratamiento y las obligaciones legales aplicables. Los datos contables y de facturación se conservan por <strong>5 años</strong>, según lo exige la legislación tributaria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar esta política en cualquier momento. Las modificaciones serán publicadas en esta página con la fecha de última actualización.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">11. Contacto</h2>
            <p>Para consultas sobre esta política, contactanos:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Email:</strong> {LEGAL.email}</li>
              <li><strong>Teléfono:</strong> {LEGAL.telefono}</li>
              <li><strong>Domicilio:</strong> {LEGAL.domicilio}</li>
            </ul>
          </section>
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <Link href="/" className="text-sm text-[#0A2540] hover:text-[#E63946]">
            ← Volver al inicio
          </Link>
        </footer>
      </div>
    </div>
  );
}