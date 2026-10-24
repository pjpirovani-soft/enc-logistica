import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F3F5] p-4 text-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl w-full">
        
        <div className="bg-[#0A2540] p-8 rounded-t-lg mb-8 -mt-10 -mx-10">
          <h1 className="text-5xl font-bold text-white mb-2">
            ENC <span className="text-[#E63946]">Logística</span>
          </h1>
          <p className="text-xl text-gray-300">Logística de Última Milla en Encarnación</p>
        </div>
        
        <p className="text-gray-600 mb-8 text-lg">
          Plataforma de gestión interna para la recepción, distribución y entrega de paquetes. 
          Conectando empresas de Asunción con clientes en el Gran Encarnación.
        </p>

        <div className="flex gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="bg-[#0A2540] text-white font-bold py-3 px-8 rounded hover:bg-[#06192b] transition-colors"
          >
            Ir al Panel
          </Link>
          <Link 
            href="/login" 
            className="bg-[#E63946] text-white font-bold py-3 px-8 rounded hover:bg-red-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}