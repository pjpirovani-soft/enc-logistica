import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { obtenerMiCliente, obtenerMisPaquetes } from '@/app/actions/portal';
import { logoutPortal } from '@/lib/auth-actions';
import { Package, CheckCircle, XCircle, RotateCcw, Truck, Clock } from 'lucide-react';

type Estado = 'En Ruta' | 'Entregado' | 'Ausente' | 'Devuelto' | 'Cancelado';

const estadoBadge: Record<Estado, string> = {
  'En Ruta': 'bg-yellow-100 text-yellow-800',
  'Entregado': 'bg-green-100 text-green-800',
  'Ausente': 'bg-amber-100 text-amber-800',
  'Devuelto': 'bg-red-100 text-red-800',
  'Cancelado': 'bg-gray-100 text-gray-700',
};

type Filtro = 'Todos' | 'En Ruta' | 'Entregado' | 'Ausente' | 'Devuelto';

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
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

  const paquetes = await obtenerMisPaquetes();
  const params = await searchParams;
  const filtro = (params.filtro || 'Todos') as Filtro;

  const paquetesFiltrados = filtro === 'Todos'
    ? paquetes
    : paquetes.filter((p) => p.estado === filtro);

  // KPIs (solo de entregados para totales de dinero)
  const total = paquetes.length;
  const entregados = paquetes.filter((p) => p.estado === 'Entregado').length;
  const ausentes = paquetes.filter((p) => p.estado === 'Ausente').length;
  const devueltos = paquetes.filter((p) => p.estado === 'Devuelto').length;
  const enRuta = paquetes.filter((p) => p.estado === 'En Ruta').length;

  const totalCobrado = paquetes
    .filter((p) => p.estado === 'Entregado')
    .reduce((sum, p) => sum + Number(p.monto_cobro ?? 0), 0);

  const totalTarifa = paquetes
    .filter((p) => p.estado === 'Entregado')
    .reduce((sum, p) => sum + Number(p.tarifa_flete ?? 0), 0);

  const filtros: { label: string; value: Filtro; count: number }[] = [
    { label: 'Todos', value: 'Todos', count: total },
    { label: 'En Ruta', value: 'En Ruta', count: enRuta },
    { label: 'Entregados', value: 'Entregado', count: entregados },
    { label: 'Ausentes', value: 'Ausente', count: ausentes },
    { label: 'Devueltos', value: 'Devuelto', count: devueltos },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F5] p-3 md:p-8 text-black">
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-[#0A2540] mb-1">Hola, {cliente.nombre}</h2>
          <p className="text-sm text-gray-600">Estos son tus paquetes en sistema.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-xs text-gray-500">Total paquetes</p>
            <p className="text-2xl font-bold text-[#0A2540]">{total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-xs text-gray-500">Entregados</p>
            <p className="text-2xl font-bold text-green-600">{entregados}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-xs text-gray-500">Total cobrado</p>
            <p className="text-lg font-bold text-[#0A2540]">Gs. {totalCobrado.toLocaleString('es-PY')}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-xs text-gray-500">Total a facturar</p>
            <p className="text-lg font-bold text-[#0A2540]">Gs. {totalTarifa.toLocaleString('es-PY')}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filtros.map((f) => (
            <a
              key={f.value}
              href={f.value === 'Todos' ? '/portal' : `/portal?filtro=${encodeURIComponent(f.value)}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filtro === f.value
                  ? 'bg-[#0A2540] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label} ({f.count})
            </a>
          ))}
        </div>

        {/* Lista */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h3 className="text-lg font-bold p-4 bg-[#0A2540] text-white">
            {filtro === 'Todos' ? 'Todos los paquetes' : `Paquetes: ${filtro}`} ({paquetesFiltrados.length})
          </h3>

          {paquetesFiltrados.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay paquetes con este filtro.</p>
            </div>
          ) : (
            <>
              {/* Cards mobile */}
              <div className="md:hidden divide-y divide-gray-100">
                {paquetesFiltrados.map((p) => {
                  const estado = p.estado as Estado;
                  return (
                    <div key={p.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-[#0A2540]">{p.nro_guia}</p>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${estadoBadge[estado] ?? estadoBadge['En Ruta']}`}>
                          {p.estado}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Destinatario:</span>
                          <span className="text-right font-medium">{p.destinatario}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dirección:</span>
                          <span className="text-right text-xs">{p.direccion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tipo:</span>
                          <span className="text-right text-xs">{p.tipo_servicio}</span>
                        </div>
                        {p.tipo_servicio === 'Contra Entrega' && Number(p.monto_cobro) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Monto cobro:</span>
                            <span className="text-right text-xs font-medium">
                              Gs. {Number(p.monto_cobro).toLocaleString('es-PY')}
                              {p.cobrado && <span className="ml-1 text-green-600 font-bold">OK</span>}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tarifa flete:</span>
                          <span className="text-right text-xs">Gs. {Number(p.tarifa_flete).toLocaleString('es-PY')}</span>
                        </div>
                        {p.fecha_entrega && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Fecha entrega:</span>
                            <span className="text-right text-xs">
                              {new Date(p.fecha_entrega).toLocaleString('es-PY')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tabla desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="p-3 border-b">Guía</th>
                      <th className="p-3 border-b">Destinatario</th>
                      <th className="p-3 border-b">Dirección</th>
                      <th className="p-3 border-b">Estado</th>
                      <th className="p-3 border-b">Tipo</th>
                      <th className="p-3 border-b">Monto cobro</th>
                      <th className="p-3 border-b">Tarifa flete</th>
                      <th className="p-3 border-b">Fecha entrega</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paquetesFiltrados.map((p) => {
                      const estado = p.estado as Estado;
                      return (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-bold text-[#0A2540]">{p.nro_guia}</td>
                          <td className="p-3 text-sm">{p.destinatario}</td>
                          <td className="p-3 text-xs text-gray-600">{p.direccion}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${estadoBadge[estado] ?? estadoBadge['En Ruta']}`}>
                              {p.estado}
                            </span>
                          </td>
                          <td className="p-3 text-xs">{p.tipo_servicio}</td>
                          <td className="p-3 text-sm">
                            Gs. {Number(p.monto_cobro).toLocaleString('es-PY')}
                            {p.cobrado && <span className="ml-1 text-green-600 font-bold">OK</span>}
                          </td>
                          <td className="p-3 text-sm">Gs. {Number(p.tarifa_flete).toLocaleString('es-PY')}</td>
                          <td className="p-3 text-xs text-gray-600">
                            {p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleString('es-PY') : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ¿Consultas? Escribinos a contacto.enclogistica@gmail.com
        </p>
      </div>
    </div>
  );
}