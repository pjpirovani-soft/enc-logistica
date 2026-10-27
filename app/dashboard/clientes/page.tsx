import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { obtenerClientes } from '@/app/actions/clientes';
import { logout } from '@/lib/auth-actions';
import { ClienteForm } from '@/components/ClienteForm';
import { ClientesTable } from '@/components/ClientesTable';
import { APP_VERSION } from '@/lib/config';

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
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>

        <ClienteForm />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold p-4 bg-[#0A2540] text-white">
            Clientes B2B ({clientes.length})
          </h2>

          <ClientesTable clientes={clientes} />
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">ENC Logística v{APP_VERSION}</p>
      </div>
    </div>
  );
}