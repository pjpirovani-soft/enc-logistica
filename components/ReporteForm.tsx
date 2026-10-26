'use client';

import { useState } from 'react';
import { type ClienteB2B } from '@/app/actions/clientes';

type Props = {
  clientes: ClienteB2B[];
};

type TipoReporte = 'diario' | 'mensual';

export function ReporteForm({ clientes }: Props) {
  const [tipo, setTipo] = useState<TipoReporte>('diario');
  const [clienteId, setClienteId] = useState<string>(clientes.length > 0 ? clientes[0].id : '');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().slice(0, 10));
  const [mes, setMes] = useState<string>(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  async function handleDescargar() {
    if (!clienteId) {
      setError('Selecciona un cliente');
      return;
    }
    if (tipo === 'diario' && !fecha) {
      setError('Selecciona una fecha');
      return;
    }
    if (tipo === 'mensual' && !mes) {
      setError('Selecciona un mes');
      return;
    }

    setLoading(true);
    setError(null);
    setExito(null);

    try {
      const cliente = clientes.find((c) => c.id === clienteId);
      const clienteNombre = cliente?.nombre || 'cliente';

      const params = new URLSearchParams();
      params.set('cliente_id', clienteId);

      let url = '';
      let filename = '';

      if (tipo === 'diario') {
        params.set('fecha', fecha);
        url = `/api/reportes/diario?${params.toString()}`;
        filename = `reporte-diario-${clienteNombre.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${fecha}.csv`;
      } else {
        params.set('mes', mes);
        url = `/api/reportes/mensual?${params.toString()}`;
        filename = `reporte-mensual-${clienteNombre.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${mes}.csv`;
      }

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
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);

      setExito('Reporte descargado con exito');
    } catch (err) {
      console.error(err);
      setError('Error al descargar el reporte');
    } finally {
      setLoading(false);
    }
  }

  if (clientes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-black">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No hay clientes B2B registrados.</p>
          <a
            href="/dashboard/clientes"
            className="inline-block bg-[#0A2540] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#06192b]"
          >
            + Crear primer cliente
          </a>
        </div>
      </div>
    );
  }

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-lg p-3 text-base";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 text-black">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-[#0A2540]">Generar Reporte</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de reporte</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo('diario')}
              className={`py-3 rounded-lg font-medium transition ${
                tipo === 'diario'
                  ? 'bg-[#0A2540] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Diario
            </button>
            <button
              type="button"
              onClick={() => setTipo('mensual')}
              className={`py-3 rounded-lg font-medium transition ${
                tipo === 'mensual'
                  ? 'bg-[#0A2540] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mensual
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente B2B</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className={inputClass}
          >
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
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
          className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 text-base"
        >
          {loading ? 'Generando...' : `Descargar CSV ${tipo === 'diario' ? 'diario' : 'mensual'}`}
        </button>

        {error && (
          <p className="text-center font-bold text-red-600">{error}</p>
        )}
        {exito && (
          <p className="text-center font-bold text-green-600">{exito}</p>
        )}
      </div>
    </div>
  );
}