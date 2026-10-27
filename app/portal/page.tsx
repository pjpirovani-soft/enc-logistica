import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { obtenerMiCliente } from '@/app/actions/portal';
import { logoutPortal } from '@/lib/auth-actions';

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/portal/login');
  }

  const cliente = await obtenerMiCliente();

  if (!cliente) {
    return (
      <div className="min-h-screen bg-[#F1F3F5] p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#0A2540] mb-4">Cuenta no vinculada</h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta está creada, pero no está vinculada a ningún cliente registrado.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contactanos para que vinculemos tu cuenta:
            <br />
            <a href="mailto:contacto.enclogistica@gmail.com" className="text-[#E63946] font-bold">
              contacto.enclogistica@gmail.com
            </a>
          </p>
          <form action={logoutPortal}>
            <button className="text-sm font-semibold text-gray-500 hover:text-[#E63946]">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F5] p-4 md:p-8 text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6 border-b-2 border-[#E63946] pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/alas-azul-transparente.png"
              alt="ENC Logística"
              className="h-10 md:h-14 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-[#0A2540]">
                ENC <span className="text-[#E63946]">Logística</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-500">Portal Clientes B2B</p>
            </div>
          </div>
          <form action={logoutPortal}>
            <button className="text-sm font-semibold text-gray-500 hover:text-[#E63946]">
              Cerrar Sesión
            </button>
          </form>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#0A2540] mb-2">Hola, {cliente.nombre}</h2>
          <p className="text-gray-600 mb-4">
            Este es tu portal. Próximamente vas a poder ver tus paquetes y descargar reportes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">RUC</p>
              <p className="font-bold text-[#0A2540]">{cliente.ruc || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-bold text-[#0A2540]">{cliente.email || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Tarifa base</p>
              <p className="font-bold text-[#0A2540]">Gs. {Number(cliente.tarifa_base).toLocaleString('es-PY')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Comisión contra entrega</p>
              <p className="font-bold text-[#0A2540]">{cliente.comision_pct}%</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Próximamente:</strong> listado de paquetes y descarga de reportes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}