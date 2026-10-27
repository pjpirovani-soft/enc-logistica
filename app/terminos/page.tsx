import Link from 'next/link';
import { LEGAL } from '@/lib/legal';

export default function TerminosPage() {
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
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A2540]">Términos y Condiciones del Servicio</h1>
          <p className="text-sm text-gray-500 mt-2">Última actualización: {LEGAL.ultimaActualizacion}</p>
        </header>

        <div className="prose prose-sm md:prose-base max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">1. Identificación del prestador</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Nombre:</strong> {LEGAL.titular}</li>
              <li><strong>RUC:</strong> {LEGAL.ruc}</li>
              <li><strong>Nombre comercial:</strong> {LEGAL.nombreComercial}</li>
              <li><strong>Domicilio:</strong> {LEGAL.domicilio}</li>
              <li><strong>Email:</strong> {LEGAL.email}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">2. Objeto</h2>
            <p>
              El presente documento regula los términos y condiciones del servicio de logística de última milla ofrecido por <strong>{LEGAL.nombreComercial}</strong>, que incluye la recepción, traslado y entrega de paquetes en Encarnación y Gran Encarnación, así como el cobro contra entrega y la logística inversa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">3. Aceptación de los términos</h2>
            <p>
              El uso del portal de clientes B2B y de los servicios de {LEGAL.nombreComercial} implica la aceptación plena de estos términos y condiciones. Si el cliente no está de acuerdo, debe abstenerse de utilizar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">4. Servicios ofrecidos</h2>
            <p>{LEGAL.nombreComercial} ofrece los siguientes servicios:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Recepción de paquetes en la Terminal de Ómnibus de Encarnación.</li>
              <li>Entrega puerta a puerta en Encarnación y Gran Encarnación.</li>
              <li>Cobro contra entrega con rendición diaria.</li>
              <li>Logística inversa (devolución a bodega después del tope de intentos).</li>
              <li>Entregas programadas a localidades vecinas con tarifa diferenciada.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">5. Límites operativos</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Peso máximo por paquete: <strong>15 kg</strong>.</li>
              <li>Dimensiones máximas: <strong>100 cm x 60 cm x 50 cm</strong>.</li>
              <li>No se transportan: alimentos perecederos, sustancias peligrosas, armas, dinero en efectivo (excepto cobro contra entrega), objetos de valor superior a <strong>Gs. 5.000.000</strong> sin previo acuerdo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">6. Tarifas y facturación</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Tarifa base de entrega urbana en Encarnación: <strong>Gs. 22.000</strong> (variable por cliente B2B según contrato).</li>
              <li>Servicio de cobro contra entrega: comisión del <strong>3%</strong> sobre el monto cobrado (configurable por cliente).</li>
              <li>Tarifas diferenciadas para Cambyretá, Capitán Miranda y San Juan del Paraná.</li>
              <li>{LEGAL.nombreComercial} emite <strong>Factura Legal</strong> con timbrado vigente de la DNIT, a nombre de <strong>{LEGAL.titular}, RUC {LEGAL.ruc}</strong>.</li>
              <li>El cliente B2B abonará el total en un plazo de <strong>15 a 30 días</strong> según contrato.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">7. Responsabilidad</h2>
            <p>
              {LEGAL.nombreComercial} no se hace responsable por daños preexistentes en el embalaje al momento de retirar el paquete de la terminal. En caso de pérdida total o destrucción comprobada por negligencia de {LEGAL.nombreComercial}, se compromete a indemnizar hasta un máximo de <strong>Gs. 1.500.000 por paquete</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">8. Cobro contra entrega y rendición</h2>
            <p>
              Cuando el cliente B2B solicite cobro contra entrega, {LEGAL.nombreComercial} cobrará el monto estipulado al destinatario y transferirá el monto al cliente B2B en un plazo máximo de <strong>24 horas hábiles</strong>, descontando la comisión correspondiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">9. Protocolo de reintento y devolución</h2>
            <p>
              Si el destinatario no se encuentra en el domicilio, se realizará un segundo intento de entrega al día siguiente. Si el segundo intento falla, el paquete se devuelve a bodega y se notifica al cliente B2B para su retiro o reenvío.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">10. Protección de datos personales</h2>
            <p>
              El tratamiento de datos personales se rige por la <strong>Ley N° 6534/2020</strong>. Para más información, consultar nuestra{' '}
              <Link href="/privacidad" className="text-[#0A2540] underline">Política de Privacidad</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">11. Vigencia y modificación</h2>
            <p>
              Estos términos tienen vigencia indefinida. {LEGAL.nombreComercial} se reserva el derecho de modificarlos en cualquier momento, publicando la versión actualizada en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">12. Jurisdicción</h2>
            <p>
              Cualquier controversia derivada de estos términos será resuelta en los tribunales ordinarios de la ciudad de <strong>Encarnación, Paraguay</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">13. Contacto</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Email:</strong> {LEGAL.email}</li>
              <li><strong>Teléfono:</strong> {LEGAL.telefono}</li>
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