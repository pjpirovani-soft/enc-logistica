'use client';

import { useState, useTransition } from 'react';
import { marcarAusente, marcarEntregado, reintentarEntrega } from '@/app/actions/paquetes';

type Estado = 'En Ruta' | 'Entregado' | 'Ausente' | 'Devuelto' | 'Cancelado';

type Props = {
  paqueteId: string;
  estado: Estado;
  intentos: number;
  nroGuia: string;
  clienteAsuncion: string;
  destinatario: string;
  tipoServicio: 'Normal' | 'Contra Entrega';
  montoCobro: number;
};

export function PaqueteAcciones({
  paqueteId,
  estado,
  intentos,
  nroGuia,
  clienteAsuncion,
  destinatario,
  tipoServicio,
  montoCobro,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<'ausente' | 'entregar' | null>(null);
  const [obs, setObs] = useState('');
  const [retiradoPor, setRetiradoPor] = useState('');
  const [retiradoPorCi, setRetiradoPorCi] = useState('');
  const [cobrado, setCobrado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setObs('');
    setRetiradoPor('');
    setRetiradoPorCi('');
    setCobrado(false);
    setError(null);
    setModal(null);
  };

  const confirmarAusente = () => {
    startTransition(async () => {
      const r = await marcarAusente({ paqueteId, observaciones: obs || null });
      if (!r.ok) setError(r.error);
      else reset();
    });
  };

  const confirmarReintento = () => {
    startTransition(async () => {
      const r = await reintentarEntrega(paqueteId);
      if (!r.ok) setError(r.error);
      else if (r.devuelto) alert('Se alcanzó el tope de 2 intentos. El paquete fue marcado como Devuelto.');
    });
  };

  const confirmarEntrega = () => {
    if (!retiradoPor.trim() || !retiradoPorCi.trim()) {
      setError('Nombre y C.I. son obligatorios');
      return;
    }
    if (tipoServicio === 'Contra Entrega' && montoCobro > 0 && !cobrado) {
      setError('Debés confirmar el cobro antes de marcar entregado');
      return;
    }
    startTransition(async () => {
      const r = await marcarEntregado({
        paqueteId,
        retiradoPor,
        retiradoPorCi,
        observaciones: obs || null,
        cobrado: tipoServicio === 'Contra Entrega' ? cobrado : false,
      });
      if (!r.ok) setError(r.error);
      else reset();
    });
  };

  if (estado === 'Entregado') {
    const texto = `Hola ${clienteAsuncion}, tu paquete ${nroGuia} fue entregado a ${destinatario}.`;
    return (
      <a
        href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-500 text-white text-sm font-medium px-4 py-3 rounded-lg hover:bg-green-600"
      >
        Avisar por WhatsApp
      </a>
    );
  }

  if (estado === 'Cancelado' || estado === 'Devuelto') {
    return (
      <span className="block text-center text-sm text-gray-500 italic py-2">
        {estado === 'Devuelto' ? 'Devuelto a remitente' : 'Cancelado'}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {estado === 'En Ruta' && !modal && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setModal('entregar')}
            className="bg-[#0A2540] text-white text-sm font-medium py-3 rounded-lg hover:bg-[#06192b]"
          >
            Entregar
          </button>
          <button
            onClick={() => setModal('ausente')}
            className="bg-amber-500 text-white text-sm font-medium py-3 rounded-lg hover:bg-amber-600"
          >
            Ausente
          </button>
        </div>
      )}

      {estado === 'Ausente' && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-amber-700 font-medium text-center">
            Intento #{intentos} fallido{intentos >= 2 ? ' (ultimo)' : ''}
          </span>
          <button
            onClick={confirmarReintento}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50"
          >
            {isPending ? 'Procesando...' : intentos >= 2 ? 'Devolver a remitente' : 'Reintentar entrega'}
          </button>
          {error && <p className="text-xs text-red-600 text-center">{error}</p>}
        </div>
      )}

      {modal === 'ausente' && (
        <div className="border border-amber-300 bg-amber-50 rounded-lg p-3 flex flex-col gap-3">
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Motivo / observación (opcional)"
            maxLength={500}
            rows={2}
            className="text-sm border border-gray-300 rounded-lg p-3"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={confirmarAusente}
              disabled={isPending}
              className="bg-amber-600 text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : 'Confirmar'}
            </button>
            <button onClick={reset} className="text-sm font-medium py-3 rounded-lg border border-gray-300">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {modal === 'entregar' && (
        <div className="border border-blue-300 bg-blue-50 rounded-lg p-3 flex flex-col gap-3">
          <input
            value={retiradoPor}
            onChange={(e) => setRetiradoPor(e.target.value)}
            placeholder="Quién retiró (nombre)"
            maxLength={120}
            className="text-sm border border-gray-300 rounded-lg p-3"
          />
          <input
            value={retiradoPorCi}
            onChange={(e) => setRetiradoPorCi(e.target.value)}
            placeholder="C.I. del retirador"
            maxLength={20}
            className="text-sm border border-gray-300 rounded-lg p-3"
          />
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Observaciones (opcional)"
            maxLength={500}
            rows={2}
            className="text-sm border border-gray-300 rounded-lg p-3"
          />
          {tipoServicio === 'Contra Entrega' && montoCobro > 0 && (
            <label className="flex items-center gap-3 text-sm bg-white border border-green-300 rounded-lg p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cobrado}
                onChange={(e) => setCobrado(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-medium text-green-700">
                Confirma cobro de Gs. {montoCobro.toLocaleString('es-PY')}
              </span>
            </label>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={confirmarEntrega}
              disabled={isPending}
              className="bg-[#0A2540] text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : 'Confirmar'}
            </button>
            <button onClick={reset} className="text-sm font-medium py-3 rounded-lg border border-gray-300">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}