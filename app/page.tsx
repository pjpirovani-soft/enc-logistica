import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CONTACTO, EMPRESA } from '@/lib/config';
import { Footer } from '@/components/Footer';
import { MessageCircle, Mail, Phone, MapPin, Clock, Package, Truck, CheckCircle, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/alas-azul-transparente.png"
              alt="ENC Logística"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <div className="text-xl md:text-2xl font-bold text-[#0A2540]">
              ENC <span className="text-[#E63946]">Logística</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="/login"
              className="text-sm font-semibold text-[#0A2540] hover:text-[#E63946] px-4 py-2 rounded-lg border border-[#0A2540]"
            >
              Iniciar Sesión
            </a>
            <a
              href={CONTACTO.whatsapp + '?text=' + encodeURIComponent(CONTACTO.whatsappMensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white bg-[#0A2540] hover:bg-[#06192b] px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contactar
            </a>
          </div>
        </div>
      </header>

      <section className="bg-[#0A2540] text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Entregas puerta a puerta en <span className="text-[#E63946]">Encarnación</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Recibimos paquetes de todo Paraguay y los entregamos en el día en Encarnación y Gran Encarnación. Con confirmación fotográfica y cobro contra entrega.
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <a
              href={CONTACTO.whatsapp + '?text=' + encodeURIComponent(CONTACTO.whatsappMensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E63946] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-base flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Consultar por WhatsApp
            </a>
            <a
              href={'mailto:' + CONTACTO.email}
              className="bg-white text-[#0A2540] hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-base flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Enviar email
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] text-center mb-6">
            Quiénes somos
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-4">
            ENC Logística es una empresa de logística de última milla con base en Encarnación, Paraguay.
          </p>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
            Funcionamos como extensión operativa de empresas de todo el país que venden en Encarnación y el Gran Encarnación pero no tienen presencia física local. Un interlocutor único, comunicación directa por WhatsApp y flexibilidad para acuerdos B2B.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] text-center mb-10">
            Qué hacemos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Entrega puerta a puerta</h3>
              <p className="text-gray-600">
                Retiramos en la terminal de ómnibus y entregamos en el domicilio del destinatario. Confirmación fotográfica de cada entrega.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Cobro contra entrega</h3>
              <p className="text-gray-600">
                Cobramos al destinatario y te transferimos el monto el mismo día, descontando nuestra comisión. Rendición diaria.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Logística inversa</h3>
              <p className="text-gray-600">
                Si el cliente no está, reintentamos al día siguiente. Después del tope de intentos, devolvemos el paquete a tu bodega.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Cobertura Gran Encarnación</h3>
              <p className="text-gray-600">
                Entregamos en {EMPRESA.cobertura.join(', ')}. Viajes programados a localidades vecinas con tarifa diferenciada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] text-center mb-10">
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Enviás</h3>
              <p className="text-gray-600 text-sm">
                Despachás el paquete por bus a la terminal de Encarnación, a nombre de ENC Logística.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Recibimos</h3>
              <p className="text-gray-600 text-sm">
                Retiramos, verificamos y entregamos en el domicilio del destinatario el mismo día.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Te avisamos</h3>
              <p className="text-gray-600 text-sm">
                Te enviamos foto de la entrega y, si es contra entrega, rendimos el cobro el mismo día.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#0A2540] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Contactanos</h2>
          <p className="text-lg text-gray-300 mb-8">
            Estamos para ayudarte. Consultanos sin compromiso.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a
              href={CONTACTO.whatsapp + '?text=' + encodeURIComponent(CONTACTO.whatsappMensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 flex items-center gap-3 transition"
            >
              <div className="bg-white/20 rounded-full p-2">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold">WhatsApp</p>
                <p className="text-sm">{CONTACTO.telefonoDisplay}</p>
              </div>
            </a>
            <a
              href={'mailto:' + CONTACTO.email}
              className="bg-[#E63946] hover:bg-red-700 text-white rounded-lg p-4 flex items-center gap-3 transition"
            >
              <div className="bg-white/20 rounded-full p-2">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold">Email</p>
                <p className="text-sm break-all">{CONTACTO.email}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}