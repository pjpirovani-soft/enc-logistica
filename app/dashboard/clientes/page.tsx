import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { obtenerClientes } from '@/app/actions/clientes';
import { logout } from '@/lib/auth-actions';
import { ClienteForm } from '@/components/ClienteForm';

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const clientes = await obtenerClientes();

  return (
    <div className="min-h-screen bg-[#F1F3F5] p-3 md:p-8 text-black">
      <div className="max-w-5xl mx-auto">
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
              href="/dashboard"
              className="flex-1 md:flex-none text-center text-sm font-semibold text-[#0A2540] hover:text-[#E63946] px-3 py-2 rounded-lg border border-[#0A2540]"
            >
              Volver al Dashboard
            </a>
            <form action={logout} className="flex-1 md:flex-none">
              <button className="w-full text-sm font-semibold text-gray-500 hover:text-[#E63946] px-3 py-2">
                Cerrar Sesion
              </button>
            </form>
          </div>
        </header>

        <ClienteForm />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold p-4 bg-[#0A2540] text-white">
            Clientes B2B ({clientes.length})
          </h2>

          {clientes.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No hay clientes registrados aún.
            </p>
          ) : (
            <>
              {/* CARDS en mobile */}
              <div className="md:hidden divide-y divide-gray-100">
                {clientes.map((cliente) => (
                  <div key={cliente.id} className="p-4">
                    <p className="font-bold text-[#0A2540] text-base mb-2">{cliente.nombre}</p>
                    <div className="space-y-1 text-sm">
                      {cliente.ruc && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">RUC:</span>
                          <span className="text-right">{cliente.ruc}</span>
                        </div>
                      )}
                      {cliente.telefono && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Teléfono:</span>
                          <span className="text-right">{cliente.telefono}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-right text-xs break-all">{cliente.email}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tarifa:</span>
                        <span className="text-right font-medium">
                          Gs. {Number(cliente.tarifa_base).toLocaleString('es-PY')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Comisión:</span>
                        <span className="text-right">{cliente.comision_pct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Máx. intentos:</span>
                        <span className="text-right">{cliente.max_intentos}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TABLA en desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="p-4 border-b">Nombre</th>
                      <th className="p-4 border-b">RUC</th>
                      <th className="p-4 border-b">Teléfono</th>
                      <th className="p-4 border-b">Email</th>
                      <th className="p-4 border-b">Tarifa Base</th>
                      <th className="p-4 border-b">Comisión</th>
                      <th className="p-4 border-b">Máx. Intentos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-bold text-[#0A2540]">{cliente.nombre}</td>
                        <td className="p-4 text-sm">{cliente.ruc || '-'}</td>
                        <td className="p-4 text-sm">{cliente.telefono || '-'}</td>
                        <td className="p-4 text-sm">{cliente.email || '-'}</td>
                        <td className="p-4 text-sm">
                          Gs. {Number(cliente.tarifa_base).toLocaleString('es-PY')}
                        </td>
                        <td className="p-4 text-sm">{cliente.comision_pct}%</td>
                        <td className="p-4 text-sm">{cliente.max_intentos}</td>
                      </tr>
                    ))}
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