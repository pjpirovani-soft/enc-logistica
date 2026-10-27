'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, FileText, Calendar } from 'lucide-react';

type TipoReporte = 'diario' | 'mensual';

export default function PortalReportesPage() {
  const [tipo, setTipo] = useState<TipoReporte>('diario');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().slice(0, 10));
  const [mes, setMes] = useState<string>(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  async function handleDescargar() {
    setLoading(true);
    setError(null);
    setExito(null);

    try {
      const url = tipo === 'diario'
        ? `/api/reportes/portal/diario?fecha=${fecha}`
        : `/api/reportes/portal/mensual?mes=${mes}`;

      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();
        setError('Error: ' + (errorText || res.statusText));
        setLoading(false);
        return;
      }

      const csv = await res.text();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `reporte-${tipo}-${tipo === 'diario' ? fecha : mes}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      setExito('Reporte descargado con éxito');
    } catch (err) {
      console.error(err);
      setError('Error al descargar el reporte');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-lg p-3 text-base";

  return (
    <div className="min-h-screen bg-[#F1F3F5] p-4 md:p-8 text-black">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6 border-b-2 border-[#E63946] pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/alas-azul-transparente.png"
              alt="ENC Logística"
              className="h-10 md:h-14 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#0A2540]">
                ENC <span className="text-[#E63946]">Logística</span>
              </h1>
              <p className="text-xs text-gray-500">Portal Clientes B2B</p>
            </div>
          </div>
          <Link
            href="/portal"
            className="text-sm font-semibold text-[#0A2540] hover:text-[#E63946] px-3 py-2 rounded-lg border border-[#0A2540] text-center"
          >
            Volver al Portal
          </Link>
        </header>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg md:text-xl font-bold text-[#0A2540] mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reportes
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Descargá tus reportes diarios o mensuales. Incluyen detalle de entregas, cobros, comisiones y montos a rendir/facturar.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de reporte</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipo('diario')}
                  className={`py-3 rounded-lg font-medium transition ${
                    tipo === 'diario' ? 'bg-[#0A2540] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Diario
                </button>
                <button
                  type="button"
                  onClick={() => setTipo('mensual')}
                  className={`py-3 rounded-lg font-medium transition ${
                    tipo === 'mensual' ? 'bg-[#0A2540] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mensual
                </button>
              </div>
            </div>

            {tipo === 'diario' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className={inputClass}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Mes</label>
                <input
                  type="month"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleDescargar}
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 text-base flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Generando...' : `Descargar CSV ${tipo}`}
            </button>

            {error && <p className="text-center font-bold text-red-600">{error}</p>}
            {exito && <p className="text-center font-bold text-green-600">{exito}</p>}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> los reportes incluyen solo los datos de tus envíos. Por protección de datos (Ley 6534/2020), no se muestran datos personales del destinatario como C.I. ni quién retiró el paquete.
          </p>
        </div>
      </div>
    </div>
  );
}