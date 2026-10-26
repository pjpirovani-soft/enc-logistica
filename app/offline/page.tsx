export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#F1F3F5] flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        <img
          src="/alas-azul-transparente.png"
          alt="ENC Logistica"
          className="h-16 w-auto object-contain mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-[#0A2540] mb-4">
          Sin conexion
        </h1>
        <p className="text-gray-600 mb-6">
          No hay conexion a internet. Verifica tu red y vuelve a intentar.
        </p>
        <p className="text-sm text-gray-500">
          Los datos de paquetes y clientes requieren conexion para mostrarse actualizados.
        </p>
      </div>
    </div>
  );
}