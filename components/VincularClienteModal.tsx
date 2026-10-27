'use client';

import { useState } from 'react';
import { MessageCircle, Copy, X } from 'lucide-react';
import { type ClienteB2B } from '@/app/actions/clientes';

type Props = {
  cliente: ClienteB2B;
  onClose: () => void;
};

export function VincularClienteModal({ cliente, onClose }: Props) {
  const [copiado, setCopiado] = useState(false);

  const email = cliente.email || '';
  const registerUrl = `https://enc-logistica.vercel.app/portal/register${email ? `?email=${encodeURIComponent(email)}` : ''}`;

  const mensaje = email
    ? `Hola ${cliente.nombre}, te invito a registrarte en el portal de ENC Logística para ver tus envíos.\n\n1. Entrá acá: ${registerUrl}\n2. Usá este email: ${email}\n\nCualquier consulta, respondé este mensaje.`
    : `Hola ${cliente.nombre}, te invito a registrarte en el portal de ENC Logística.\n\nEntrá acá: ${registerUrl}\n\nNecesito que me confirmes tu email para vincular tu cuenta.`;

  const whatsappUrl = `https://wa.me/${cliente.telefono?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(mensaje)}`;

  async function copiarEmail() {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#0A2540]">Invitar al portal</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-[#E63946]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Cliente: <strong>{cliente.nombre}</strong></p>
          {email ? (
            <p className="text-sm text-gray-600">
              Email registrado: <strong>{email}</strong>
              <button
                onClick={copiarEmail}
                className="ml-2 text-[#0A2540] hover:text-[#E63946] inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </p>
          ) : (
            <p className="text-sm text-red-600">
              ⚠️ Este cliente no tiene email registrado. Editá el cliente y agregá un email para enviar la invitación.
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800 mb-2"><strong>Cómo funciona:</strong></p>
          <ol className="text-xs text-blue-800 list-decimal list-inside space-y-1">
            <li>Enviás este WhatsApp al cliente.</li>
            <li>El cliente se registra con el email indicado.</li>
            <li>La app vincula automáticamente su cuenta al cliente.</li>
            <li>El cliente ya puede ver sus paquetes y reportes.</li>
          </ol>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar invitación por WhatsApp
          </a>
          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#0A2540] text-white font-bold py-3 rounded-lg hover:bg-[#06192b] text-center text-sm"
          >
            Copiar link de registro
          </a>
        </div>
      </div>
    </div>
  );
}