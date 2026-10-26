'use client'

import { useState } from 'react';
import { crearPaquete } from '@/app/actions/paquetes';
import { PaqueteFormData } from '@/lib/schemas/paqueteSchema';

export default function PaqueteForm() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    const formData = new FormData(e.currentTarget);
    const data: PaqueteFormData = {
      nro_guia: formData.get('nro_guia') as string,
      cliente_asuncion: formData.get('cliente_asuncion') as string,
      destinatario: formData.get('destinatario') as string,
      direccion: formData.get('direccion') as string,
      telefono: formData.get('telefono') as string,
      tipo_servicio: formData.get('tipo_servicio') as 'Normal' | 'Contra Entrega',
      monto_cobro: Number(formData.get('monto_cobro')) || 0,
      tarifa_flete: Number(formData.get('tarifa_flete')) || 22000,
    };

    const res = await crearPaquete(data);

    if (res.error) {
      setMensaje('Error: ' + res.error);
    } else {
      setMensaje('Paquete registrado con exito');
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-black">
      <h2 className="text-xl font-bold mb-4 text-[#0A2540]">Registrar Nuevo Paquete</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">N de Guia</label>
          <input name="nro_guia" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente (Asuncion)</label>
          <input name="cliente_asuncion" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Destinatario (Encarnacion)</label>
          <input name="destinatario" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Direccion</label>
          <input name="direccion" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefono</label>
          <input name="telefono" className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Servicio</label>
          <select name="tipo_servicio" className="mt-1 block w-full border border-gray-300 rounded p-2">
            <option value="Normal">Entrega Normal</option>
            <option value="Contra Entrega">Cobro Contra Entrega</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto a Cobrar (Gs.)</label>
          <input name="monto_cobro" type="number" defaultValue={0} className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tarifa Flete (Gs.)</label>
          <input name="tarifa_flete" type="number" defaultValue={22000} className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div className="flex items-end md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2540] text-white font-bold p-2 rounded hover:bg-[#06192b] disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Agregar a la Ruta'}
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