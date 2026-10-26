import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PaqueteForm from '@/components/PaqueteForm';
import { logout } from '@/lib/auth-actions';
import { PaqueteAcciones } from '@/components/PaqueteAcciones';
import { obtenerDepartamentos } from '@/app/actions/ubicaciones';
import { obtenerClientes } from '@/app/actions/clientes';

type Estado = 'En Ruta' | 'Entregado' | 'Ausente' | 'Devuelto' | 'Cancelado';

const estadoBadge: Record<Estado, string> = {
  'En Ruta': 'bg-yellow-100 text-yellow-800',
  Entregado: 'bg-green-100 text-green-800',
  Ausente: 'bg-amber-100 text-amber-800',
  Devuelto: 'bg-red-100 text-red-800',
  Cancelado: 'bg-gray-100 text-gray-700',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: paquetes } = await supabase
    .from('paquetes')
    .select('*')
    .order('created_at', { ascending: false });

  const departamentos = await obtenerDepartamentos();
  const clientes = await obtenerClientes();
  const { data: todasCiudades } = await supabase
    .from('ciudades')
    .select('id, nombre, departamento_id');

  const nombreDepto = new Map<number, string>();
  const nombreCiudad = new Map<number, string>();
  const nombreCliente = new Map<string, string>();
  departamentos.forEach((d) => nombreDepto.set(d.id, d.nombre));
  (todasCiudades ?? []).forEach((c) => nombreCiudad.set(c.id, c.nombre));
  clientes.forEach((c) => nombreCliente.set(c.id, c.nombre));

  return (
    <div className="min-h-screen bg-[#F1F3F5] p-3 md:p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6 md:mb-8 border-b-2 border-[#E63946] pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/alas-azul-transparente.png"
              alt="ENC Logística"
              className="h-10 md:h-14 w-auto object-contain"
            />
            <h1 className="text-xl md:text-3xl font-bold text-[#0A2540]">
              ENC <span className="text-[#E63946]">Logística</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <a
              href="/dashboard/reportes"
              className="flex-1 md:flex-none text-center text-sm font-semibold text-[#0A2540] hover:text-[#E63946] px-3 py-2 rounded-lg border border-[#0A2540]"
            >
              Reportes
            </a>
            <a
              href="/dashboard/clientes"
              className="flex-1 md:flex-none text-center text-sm font-semibold text-[#0A2540] hover:text-[#E63946] px-3 py-2 rounded-lg border border-[#0A2540]"
            >
              Clientes B2B
            </a>
            <form action={logout} className="flex-1 md:flex-none">
              <button className="w-full text-sm font-semibold text-gray-500 hover:text-[#E63946] px-3 py-2">
                Cerrar Sesion
              </button>
            </form>
          </div>
        </header>

        <PaqueteForm departamentos={departamentos} clientes={clientes} />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold p-4 bg-[#0A2540] text-white">
            Paquetes en Sistema
          </h2>

          {!paquetes || paquetes.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No hay paquetes registrados aún.
            </p>
          ) : (
            <>
              {/* CARDS en mobile */}
              <div className="md:hidden divide-y divide-gray-100">
                {paquetes.map((paquete) => {
                  const estado = paquete.estado as Estado;
                  const deptoNombre = paquete.departamento_origen
                    ? nombreDepto.get(paquete.departamento_origen) ?? '-'
                    : '-';
                  const ciudadNombre = paquete.ciudad_origen
                    ? nombreCiudad.get(paquete.ciudad_origen) ?? '-'
                    : '-';
                  const clienteMostrado = paquete.cliente_id
                    ? nombreCliente.get(paquete.cliente_id) ?? paquete.cliente_asuncion
                    : paquete.cliente_asuncion;

                  return (
                    <div key={paquete.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0A2540] text-base">{paquete.nro_guia}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{clienteMostrado}</p>
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${estadoBadge[estado] ?? estadoBadge['En Ruta']}`}>
                          {paquete.estado}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Destinatario:</span>
                          <span className="text-right font-medium">{paquete.destinatario}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dirección:</span>
                          <span className="text-right text-xs">{paquete.direccion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Origen:</span>
                          <span className="text-right text-xs">
                            {ciudadNombre}, {deptoNombre}
                          </span>
                        </div>
                        {paquete.tipo_servicio && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tipo:</span>
                            <span className="text-right text-xs">{paquete.tipo_servicio}</span>
                          </div>
                        )}
                        {paquete.tipo_servicio === 'Contra Entrega' && paquete.monto_cobro > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Cobro:</span>
                            <span className="text-right text-xs font-medium">
                              Gs. {Number(paquete.monto_cobro).toLocaleString('es-PY')}
                              {paquete.cobrado && <span className="ml-1 text-green-600 font-bold">OK</span>}
                            </span>
                          </div>
                        )}
                      </div>

                      <PaqueteAcciones
                        paqueteId={paquete.id}
                        estado={estado}
                        intentos={paquete.intentos_entrega ?? 1}
                        nroGuia={paquete.nro_guia}
                        clienteAsuncion={clienteMostrado}
                        destinatario={paquete.destinatario}
                        tipoServicio={(paquete.tipo_servicio ?? 'Normal') as 'Normal' | 'Contra Entrega'}
                        montoCobro={Number(paquete.monto_cobro ?? 0)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* TABLA en desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="p-4 border-b">Guía</th>
                      <th className="p-4 border-b">Origen</th>
                      <th className="p-4 border-b">Cliente</th>
                      <th className="p-4 border-b">Destinatario</th>
                      <th className="p-4 border-b">Tipo</th>
                      <th className="p-4 border-b">Estado</th>
                      <th className="p-4 border-b">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paquetes.map((paquete) => {
                      const estado = paquete.estado as Estado;
                      const deptoNombre = paquete.departamento_origen
                        ? nombreDepto.get(paquete.departamento_origen) ?? '-'
                        : '-';
                      const ciudadNombre = paquete.ciudad_origen
                        ? nombreCiudad.get(paquete.ciudad_origen) ?? '-'
                        : '-';
                      const clienteMostrado = paquete.cliente_id
                        ? nombreCliente.get(paquete.cliente_id) ?? paquete.cliente_asuncion
                        : paquete.cliente_asuncion;

                      return (
                        <tr key={paquete.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-bold text-[#0A2540]">{paquete.nro_guia}</td>
                          <td className="p-4 text-xs">
                            <span className="font-medium text-[#0A2540]">{ciudadNombre}</span>
                            <br />
                            <span className="text-gray-500">{deptoNombre}</span>
                          </td>
                          <td className="p-4">{clienteMostrado}</td>
                          <td className="p-4">
                            {paquete.destinatario}
                            <br />
                            <span className="text-xs text-gray-500">{paquete.direccion}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                              {paquete.tipo_servicio ?? 'Normal'}
                            </span>
                            {paquete.tipo_servicio === 'Contra Entrega' && paquete.monto_cobro > 0 && (
                              <div className="text-xs text-gray-600 mt-1">
                                Gs. {Number(paquete.monto_cobro).toLocaleString('es-PY')}
                                {paquete.cobrado && <span className="ml-1 text-green-600 font-bold">OK</span>}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${estadoBadge[estado] ?? estadoBadge['En Ruta']}`}>
                              {paquete.estado}
                            </span>
                          </td>
                          <td className="p-4">
                            <PaqueteAcciones
                              paqueteId={paquete.id}
                              estado={estado}
                              intentos={paquete.intentos_entrega ?? 1}
                              nroGuia={paquete.nro_guia}
                              clienteAsuncion={clienteMostrado}
                              destinatario={paquete.destinatario}
                              tipoServicio={(paquete.tipo_servicio ?? 'Normal') as 'Normal' | 'Contra Entrega'}
                              montoCobro={Number(paquete.monto_cobro ?? 0)}
                            />
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
      </div>
    </div>
  );
}