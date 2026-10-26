'use client';

import { useState } from 'react';
import { crearCliente, type ClienteInput } from '@/app/actions/clientes';

export function ClienteForm() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [abierto, setAbierto] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    const formData = new FormData(e.currentTarget);
    const data: ClienteInput = {
      nombre: formData.get('nombre') as string,
      ruc: (formData.get('ruc') as string) || null,
      telefono: (formData.get('telefono') as string) || null,
      email: (formData.get('email') as string) || null,
      departamento_id: null,
      ciudad_id: null,
      tarifa_base: Number(formData.get('tarifa_base')) || 22000,
      comision_pct: Number(formData.get('comision_pct')) || 3,
      max_intentos: Number(formData.get('max_intentos')) || 2,
    };

    const res = await crearCliente(data);

    if (res.ok) {
      setMensaje('Cliente creado con exito');
      (e.target as HTMLFormElement).reset();
      setAbierto(false);
    } else {
      setMensaje('Error: ' + res.error);
    }
    setLoading(false);
  }

  if (!abierto) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setAbierto(true)}
          className="bg-[#0A2540] text-white font-bold px-6 py-3 rounded hover:bg-[#06192b]"
        >
          + Nuevo Cliente B2B
        </button>
        {mensaje && (
          <p className={`mt-2 font-bold ${mensaje.includes('Error') ? 'text-[#E63946]' : 'text-green-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#0A2540]">Nuevo Cliente B2B</h2>
        <button
          onClick={() => setAbierto(false)}
          className="text-sm text-gray-500 hover:text-[#E63946]"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            name="nombre"
            required
            placeholder="Ej: Tienda Moda SA"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">RUC</label>
          <input
            name="ruc"
            placeholder="Ej: 80012345-6"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefono</label>
          <input
            name="telefono"
            placeholder="Ej: 0981-123456"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Ej: contacto@tienda.com"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tarifa Base (Gs.)</label>
          <input
            name="tarifa_base"
            type="number"
            defaultValue={22000}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Comision (%)</label>
          <input
            name="comision_pct"
            type="number"
            step="0.01"
            defaultValue={3}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Intentos</label>
          <input
            name="max_intentos"
            type="number"
            defaultValue={2}
            min={1}
            max={5}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex items-end md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2540] text-white font-bold p-2 rounded hover:bg-[#06192b] disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Crear Cliente'}
          </button>
        </div>
      </form>

      {mensaje && (
        <p className={`mt-4 font-bold ${mensaje.includes('Error') ? 'text-[#E63946]' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}