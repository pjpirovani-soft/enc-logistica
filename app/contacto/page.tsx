'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMensaje('¡Mensaje enviado con éxito! Te responderemos a la brevedad.');
        (e.target as HTMLFormElement).reset();
      } else {
        setMensaje('Error al enviar el mensaje. Por favor, intentá de nuevo.');
      }
    } catch (err) {
      setMensaje('Error de conexión. Revisá tu internet.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-[#E63946] focus:border-[#E63946]";

  return (
    <div className="min-h-screen bg-[#F1F3F5] flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#0A2540] p-8 text-center">
            <img src="/alas-blanca-transparente.png" alt="ENC Logística" className="h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Contacto Comercial</h1>
            <p className="text-gray-300 text-sm mt-2">Dejanos tus datos y te contactamos en menos de 24hs.</p>
          </div>
          
          <div className="p-8">
            {mensaje && (
              <div className={`p-4 rounded-lg mb-6 text-center font-bold ${mensaje.includes('éxito') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-[#E63946]'}`}>
                {mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre o Empresa *</label>
                <input name="nombre" required className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input name="email" type="email" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono / WhatsApp</label>
                  <input name="telefono" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mensaje *</label>
                <textarea name="mensaje" required rows={4} className={inputClass} placeholder="Contanos qué tipo de envíos necesitás..."></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-[#0A2540] text-white font-bold py-4 rounded-lg hover:bg-[#06192b] disabled:opacity-50 transition text-base">
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              O escribinos directo a <a href="mailto:contacto.enclogistica@gmail.com" className="text-[#0A2540] font-bold">contacto.enclogistica@gmail.com</a>
            </p>
            <p className="text-center text-sm mt-2">
              <Link href="/" className="text-[#E63946] font-bold hover:underline">← Volver al inicio</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}