'use client';

import { useState, useTransition } from 'react';
import { marcarAusente, marcarEntregado, reintentarEntrega } from '@/app/actions/paquetes';

type Estado = 'En Ruta' | 'Entregado' | 'Ausente' | 'Cancelado';

type Props = {
  paqueteId: string;
  estado: Estado;
  intentos: number;
  nroGuia: string;
  clienteAsuncion: string;
  destinatario: string;
};

export function PaqueteAcciones({
  paqueteId,
  estado,
  intentos,
  nroGuia,
  clienteAsuncion,
  destinatario,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<'ausente' | 'entregar' | null>(null);

  const [obs, setObs] = useState('');
  const [retiradoPor, setRetiradoPor] = useState('');
  const [retiradoPorCi, setRetiradoPorCi] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setObs('');
    setRetiradoPor('');
    setRetiradoPorCi('');
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
    });
  };

  const confirmarEntrega = () => {
    if (!retiradoPor.trim() || !retiradoPorCi.trim()) {
      setError('Nombre y C.I. son obligatorios');
      return;
    }
    startTransition(async () => {
      const r = await marcarEntregado({
        paqueteId,
        retiradoPor,
        retiradoPorCi,
        observaciones: obs || null,
      });
      if (!r.ok) setError(r.error);
      else reset();
    });
  };

  if (estado === 'Entregado' || estado === 'Cancelado') {
    if (estado === 'Entregado') {
      const texto = `Hola ${clienteAsuncion}, tu paquete ${nroGuia} fue entregado a ${destinatario}.`;
      return (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600 inline-block"
        >
          Avisar por WhatsApp
        </a>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {estado === 'En Ruta' && !modal && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setModal('entregar')}
            className="bg-[#0A2540] text-white text-xs px-3 py-1 rounded hover:bg-[#06192b]"
          >
            Entregar
          </button>
          <button
            onClick={() => setModal('ausente')}
            className="bg-amber-500 text-white text-xs px-3 py-1 rounded hover:bg-amber-600"
          >
            Cliente Ausente
          </button>
        </div>
      )}

      {estado === 'Ausente' && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-amber-700 font-medium">
            Intento #{intentos} fallido
          </span>
          <button
            onClick={confirmarReintento}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
          >
            {isPending ? 'Procesando…' : 'Reintentar entrega'}
          </button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}

      {modal === 'ausente' && (
        <div className="border border-amber-300 bg-amber-50 rounded p-2 flex flex-col gap-2">
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Motivo / observación (opcional)"
            maxLength={500}
            rows={2}
            className="text-xs border rounded p-1"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={confirmarAusente}
              disabled={isPending}
              className="bg-amber-600 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Confirmar'}
            </button>
            <button onClick={reset} className="text-xs px-3 py-1 rounded border">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {modal === 'entregar' && (
        <div className="border border-blue-300 bg-blue-50 rounded p-2 flex flex-col gap-2">
          <input
            value={retiradoPor}
            onChange={(e) => setRetiradoPor(e.target.value)}
            placeholder="Quién retiró (nombre)"
            maxLength={120}
            className="text-xs border rounded p-1"
          />
          <input
            value={retiradoPorCi}
            onChange={(e) => setRetiradoPorCi(e.target.value)}
            placeholder="C.I. del retirador"
            maxLength={20}
            className="text-xs border rounded p-1"
          />
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Observaciones (opcional)"
            maxLength={500}
            rows={2}
            className="text-xs border rounded p-1"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={confirmarEntrega}
              disabled={isPending}
              className="bg-[#0A2540] text-white text-xs px-3 py-1 rounded disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Confirmar entrega'}
            </button>
            <button onClick={reset} className="text-xs px-3 py-1 rounded border">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}