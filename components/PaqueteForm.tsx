'use client'

import { useState, useEffect } from 'react';
import { crearPaquete } from '@/app/actions/paquetes';
import { obtenerCiudadesPorDepartamento, type Departamento, type Ciudad } from '@/app/actions/ubicaciones';
import { type ClienteB2B } from '@/app/actions/clientes';
import { PaqueteFormData } from '@/lib/schemas/paqueteSchema';

type Props = {
  departamentos: Departamento[];
  clientes: ClienteB2B[];
};

export default function PaqueteForm({ departamentos, clientes }: Props) {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);
  const [departamentoId, setDepartamentoId] = useState<string>('');
  const [ciudadId, setCiudadId] = useState<string>('');
  const [modoCliente, setModoCliente] = useState<'existente' | 'libre'>(
    clientes.length > 0 ? 'existente' : 'libre'
  );
  const [clienteId, setClienteId] = useState<string>('');

  useEffect(() => {
    if (!departamentoId) {
      setCiudades([]);
      setCiudadId('');
      return;
    }
    setCargandoCiudades(true);
    setCiudadId('');
    obtenerCiudadesPorDepartamento(Number(departamentoId)).then((lista) => {
      setCiudades(lista);
      setCargandoCiudades(false);
    });
  }, [departamentoId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    if (!departamentoId || !ciudadId) {
      setMensaje('Error: selecciona departamento y ciudad de origen');
      setLoading(false);
      return;
    }

    if (modoCliente === 'existente' && !clienteId) {
      setMensaje('Error: selecciona un cliente B2B o elegi "Otro (texto libre)"');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    let clienteNombre = '';
    if (modoCliente === 'existente' && clienteId) {
      const cliente = clientes.find((c) => c.id === clienteId);
      clienteNombre = cliente?.nombre ?? '';
    } else {
      clienteNombre = (formData.get('cliente_libre') as string) || '';
    }

    const data: PaqueteFormData = {
      nro_guia: formData.get('nro_guia') as string,
      cliente_asuncion: clienteNombre,
      cliente_id: modoCliente === 'existente' && clienteId ? clienteId : null,
      destinatario: formData.get('destinatario') as string,
      direccion: formData.get('direccion') as string,
      telefono: formData.get('telefono') as string,
      tipo_servicio: formData.get('tipo_servicio') as 'Normal' | 'Contra Entrega',
      monto_cobro: Number(formData.get('monto_cobro')) || 0,
      tarifa_flete: Number(formData.get('tarifa_flete')) || 22000,
      departamento_origen: Number(departamentoId),
      ciudad_origen: Number(ciudadId),
    };

    const res = await crearPaquete(data);

    if (res.error) {
      setMensaje('Error: ' + res.error);
    } else {
      setMensaje('Paquete registrado con éxito');
      (e.target as HTMLFormElement).reset();
      setDepartamentoId('');
      setCiudadId('');
      setCiudades([]);
      setClienteId('');
      setModoCliente(clientes.length > 0 ? 'existente' : 'libre');
    }
    setLoading(false);
  }

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-lg p-3 text-base";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 md:mb-8 text-black">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-[#0A2540]">Registrar Nuevo Paquete</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">N° de Guía</label>
          <input name="nro_guia" required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente Origen</label>
          <select
            value={modoCliente === 'libre' ? '__libre__' : clienteId}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '__libre__') { setModoCliente('libre'); setClienteId(''); }
              else if (v === '__nuevo__') { window.location.href = '/dashboard/clientes'; }
              else { setModoCliente('existente'); setClienteId(v); }
            }}
            className={inputClass}
          >
            <option value="">-- Elegir --</option>
            {clientes.length > 0 && (
              <optgroup label="Clientes B2B registrados">
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </optgroup>
            )}
            <option value="__libre__">Otro (texto libre)</option>
            <option value="__nuevo__">+ Nuevo cliente B2B</option>
          </select>
          {modoCliente === 'libre' && (
            <input
              name="cliente_libre"
              required
              placeholder="Nombre del cliente"
              className={`${inputClass} mt-2`}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Departamento Origen</label>
          <select
            value={departamentoId}
            onChange={(e) => setDepartamentoId(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Seleccioná un departamento...</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ciudad Origen</label>
          <select
            value={ciudadId}
            onChange={(e) => setCiudadId(e.target.value)}
            required
            disabled={!departamentoId || cargandoCiudades}
            className={`${inputClass} disabled:bg-gray-100`}
          >
            <option value="">
              {!departamentoId ? 'Primero elegí un departamento'
                : cargandoCiudades ? 'Cargando ciudades...'
                : ciudades.length === 0 ? 'Sin ciudades'
                : 'Seleccioná una ciudad...'}
            </option>
            {ciudades.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Destinatario (Encarnación)</label>
          <input name="destinatario" required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input name="direccion" required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input name="telefono" type="tel" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Servicio</label>
          <select name="tipo_servicio" className={inputClass}>
            <option value="Normal">Entrega Normal</option>
            <option value="Contra Entrega">Cobro Contra Entrega</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto a Cobrar (Gs.)</label>
          <input name="monto_cobro" type="number" inputMode="numeric" defaultValue={0} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tarifa Flete (Gs.)</label>
          <input name="tarifa_flete" type="number" inputMode="numeric" defaultValue={22000} className={inputClass} />
        </div>

        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2540] text-white font-bold py-4 rounded-lg hover:bg-[#06192b] disabled:opacity-50 text-base"
          >
            {loading ? 'Guardando...' : 'Agregar a la Ruta'}
          </button>
        </div>
      </form>

      {mensaje && (
        <p className={`mt-4 font-bold text-center ${mensaje.includes('Error') ? 'text-[#E63946]' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}