'use client';

import { useState } from 'react';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { type ClienteB2B } from '@/app/actions/clientes';
import { VincularClienteModal } from './VincularClienteModal';

type Props = {
  clientes: ClienteB2B[];
};

export function ClientesTable({ clientes }: Props) {
  const [modalCliente, setModalCliente] = useState<ClienteB2B | null>(null);

  if (clientes.length === 0) {
    return (
      <p className="p-6 text-center text-gray-500">
        No hay clientes registrados aún.
      </p>
    );
  }

  return (
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
                <span className="text-gray-500">Portal:</span>
                <span className="text-right">
                  {cliente.auth_user_id ? (
                    <span className="text-green-600 font-bold inline-flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Vinculado
                    </span>
                  ) : (
                    <button
                      onClick={() => setModalCliente(cliente)}
                      className="bg-green-600 text-white text-xs px-3 py-1 rounded inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Invitar
                    </button>
                  )}
                </span>
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
              <th className="p-4 border-b">Portal</th>
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
                <td className="p-4">
                  {cliente.auth_user_id ? (
                    <span className="text-green-600 font-bold text-sm inline-flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Vinculado
                    </span>
                  ) : (
                    <button
                      onClick={() => setModalCliente(cliente)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Invitar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalCliente && (
        <VincularClienteModal
          cliente={modalCliente}
          onClose={() => setModalCliente(null)}
        />
      )}
    </>
  );
}