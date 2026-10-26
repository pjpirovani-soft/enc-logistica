import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { obtenerClientes } from '@/app/actions/clientes';
import { logout } from '@/lib/auth-actions';
import { ClienteForm } from '@/components/ClienteForm';

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const clientes = await obtenerClientes();

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
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm font-semibold text-[#0A2540] hover:text-[#E63946]">
              Volver al Dashboard
            </a>
            <form action={logout}>
              <button className="text-sm font-semibold text-gray-500 hover:text-[#E63946]">
                Cerrar Sesion
              </button>
            </form>
          </div>
        </header>

        <ClienteForm />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-bold p-4 bg-[#0A2540] text-white">
            Clientes B2B ({clientes.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="p-4 border-b">Nombre</th>
                  <th className="p-4 border-b">RUC</th>
                  <th className="p-4 border-b">Telefono</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Tarifa Base</th>
                  <th className="p-4 border-b">Comision</th>
                  <th className="p-4 border-b">Max Intentos</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No hay clientes registrados aun. Crea el primero con el formulario de arriba.
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}