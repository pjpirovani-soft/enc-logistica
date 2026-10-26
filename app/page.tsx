import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CONTACTO, EMPRESA } from '@/lib/config';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/alas-azul-transparente.png"
              alt="ENC Logistica"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <h1 className="text-xl md:text-2xl font-bold text-[#0A2540]">
              ENC <span className="text-[#E63946]">Logistica</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <a
              href="/login"
              className="text-sm font-semibold text-[#0A2540] hover:text-[#E63946] px-4 py-2 rounded-lg border border-[#0A2540]"
            >
              Iniciar Sesion
            </a>
            <a
              href={CONTACTO.whatsapp + '?text=' + encodeURIComponent(CONTACTO.whatsappMensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white bg-[#0A2540] hover:bg-[#06192b] px-4 py-2 rounded-lg"
            >
              Contactar
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#0A2540] text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Entregas puerta a puerta en <span className="text-[#E63946]">Encarnacion</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Recibimos paquetes de todo Paraguay y los entregamos en el dia en Encarnacion y Gran Encarnacion. Con confirmacion fotografica y cobro contra entrega.
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <a
              href={CONTACTO.whatsapp + '?text=' + encodeURIComponent(CONTACTO.whatsappMensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E63946] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-base"
            >
              Consultar por WhatsApp
            </a>
            <a
              href={'mailto:' + CONTACTO.email}
              className="bg-white text-[#0A2540] hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-base"
            >
              Enviar email
            </a>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] text-center mb-6">
            Quienes somos
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-4">
            ENC Logistica es una empresa de logistica de ultima milla con base en Encarnacion, Paraguay.
          </p>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
            Funcionamos como extension operativa de empresas de todo el pais que venden en Encarnacion y el Gran Encarnacion pero no tienen presencia fisica local. Un interlocutor unico, comunicacion directa por WhatsApp y flexibilidad para acuerdos B2B.
          </p>
        </div>
      </section>

      {/* QUE HACEMOS */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] text-center mb-10">
            Que hacemos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Entrega puerta a puerta</h3>
              <p className="text-gray-600">
                Retiramos en la terminal de omnibus y entregamos en el domicilio del destinatario. Confirmacion fotografica de cada entrega.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Cobro contra entrega</h3>
              <p className="text-gray-600">
                Cobramos al destinatario y te transferimos el monto el mismo dia, descontando nuestra comision. Rendicion diaria.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Logistica inversa</h3>
              <p className="text-gray-600">
                Si el cliente no esta, reintentamos al dia siguiente. Despues del tope de intentos, devolvemos el paquete a tu bodega.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A2540] mb-2">Cobertura Gran Encarnacion</h3>
              <p className="text-gray-600">
                Entregamos en {EMPRESA.cobertura.join(', ')}. Viajes programados a localidades vecinas con tarifa diferenciada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] text-center mb-10">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Envias</h3>
              <p className="text-gray-600 text-sm">
                Despachas el paquete por bus a la terminal de Encarnacion, a nombre de ENC Logistica.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Recibimos</h3>
              <p className="text-gray-600 text-sm">
                Retiramos, verificamos y entregamos en el domicilio del destinatario el mismo dia.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Te avisamos</h3>
              <p className="text-gray-600 text-sm">
                Te enviamos foto de la entrega y, si es contra entrega, rendimos el cobro el mismo dia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
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
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 flex items-center gap-3"
            >
              <span className="text-3xl">💬</span>
              <div className="text-left">
                <p className="font-bold">WhatsApp</p>
                <p className="text-sm">{CONTACTO.telefonoDisplay}</p>
              </div>
            </a>
            <a
              href={'mailto:' + CONTACTO.email}
              className="bg-[#E63946] hover:bg-red-700 text-white rounded-lg p-4 flex items-center gap-3"
            >
              <span className="text-3xl">✉️</span>
              <div className="text-left">
                <p className="font-bold">Email</p>
                <p className="text-sm break-all">{CONTACTO.email}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">
            <span className="text-white font-bold">ENC</span> <span className="text-[#E63946] font-bold">Logistica</span>
          </p>
          <p className="text-sm mb-4">Logistica de ultima milla en Encarnacion, Paraguay.</p>
          <div className="flex gap-4 justify-center text-sm">
            <a href="/login" className="hover:text-white">Iniciar Sesion</a>
            <a href={CONTACTO.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
            <a href={'mailto:' + CONTACTO.email} className="hover:text-white">Email</a>
          </div>
          <p className="text-xs mt-6">© 2026 ENC Logistica. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}