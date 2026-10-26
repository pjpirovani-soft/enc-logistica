import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PaqueteForm from '@/components/PaqueteForm';
import { logout } from '@/lib/auth-actions';
import { PaqueteAcciones } from '@/components/PaqueteAcciones';

type Estado = 'En Ruta' | 'Entregado' | 'Ausente' | 'Devuelto' | 'Cancelado';

const estadoBadge: Record<Estado, string> = {
  'En Ruta': 'bg-yellow-100 text-yellow-800',
  'Entregado': 'bg-green-100 text-green-800',
  'Ausente': 'bg-amber-100 text-amber-800',
  'Devuelto': 'bg-red-100 text-red-800',
  'Cancelado': 'bg-gray-100 text-gray-700',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: paquetes } = await supabase
    .from('paquetes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F1F3F5] p-8 text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b-2 border-[#E63946] pb-4">
          <div className="flex items-center gap-4">
            <img
              src="/alas-azul-transparente.png"
              alt="ENC Logistica"
              className="h-14 w-auto object-contain"
            />
            <h1 className="text-3xl font-bold text-[#0A2540]">
              ENC <span className="text-[#E63946]">Logistica</span>
            </h1>
          </div>
          <form action={logout}>
            <button className="text-sm font-semibold text-gray-500 hover:text-[#E63946]">
              Cerrar Sesion
            </button>
          </form>
        </header>

        <PaqueteForm />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-bold p-4 bg-[#0A2540] text-white">
            Paquetes en Sistema
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="p-4 border-b">Guia</th>
                  <th className="p-4 border-b">Cliente</th>
                  <th className="p-4 border-b">Destinatario</th>
                  <th className="p-4 border-b">Tipo</th>
                  <th className="p-4 border-b">Estado</th>
                  <th className="p-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!paquetes || paquetes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No hay paquetes registrados aun.
                    </td>
                  </tr>
                ) : (
                  paquetes.map((paquete) => {
                    const estado = paquete.estado as Estado;
                    return (
                      <tr key={paquete.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-bold text-[#0A2540]">
                          {paquete.nro_guia}
                        </td>
                        <td className="p-4">{paquete.cliente_asuncion}</td>
                        <td className="p-4">
                          {paquete.destinatario}
                          <br />
                          <span className="text-xs text-gray-500">
                            {paquete.direccion}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                            {paquete.tipo_servicio ?? 'Normal'}
                          </span>
                          {paquete.tipo_servicio === 'Contra Entrega' && paquete.monto_cobro > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              Gs. {Number(paquete.monto_cobro).toLocaleString('es-PY')}
                              {paquete.cobrado && (
                                <span className="ml-1 text-green-600 font-bold">✓</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              estadoBadge[estado] ?? estadoBadge['En Ruta']
                            }`}
                          >
                            {paquete.estado}
                          </span>
                        </td>
                        <td className="p-4">
                          <PaqueteAcciones
                            paqueteId={paquete.id}
                            estado={estado}
                            intentos={paquete.intentos_entrega ?? 1}
                            nroGuia={paquete.nro_guia}
                            clienteAsuncion={paquete.cliente_asuncion}
                            destinatario={paquete.destinatario}
                            tipoServicio={(paquete.tipo_servicio ?? 'Normal') as 'Normal' | 'Contra Entrega'}
                            montoCobro={Number(paquete.monto_cobro ?? 0)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}