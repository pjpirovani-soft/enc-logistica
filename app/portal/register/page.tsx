'use client';

import { useState, useEffect } from 'react';
import { register } from '@/lib/auth-actions';
import { vincularClienteAUsuario } from '@/app/actions/portal';
import { PasswordInput } from '@/components/PasswordInput';
import Link from 'next/link';

export default function PortalRegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vinculado, setVinculado] = useState(false);
  const [emailInicial, setEmailInicial] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmailInicial(emailParam);
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setError('');
    setSuccess('');

    const res = await register(formData);
    if (res?.error) {
      setError(res.error);
      return;
    }

    const vinculacion = await vincularClienteAUsuario();

    if (vinculacion.ok) {
      setVinculado(true);
      setSuccess('¡Cuenta creada y vinculada! Redirigiendo al portal...');
      setTimeout(() => {
        window.location.href = '/portal';
      }, 1500);
    } else {
      setSuccess('Cuenta creada. Pero tu email no coincide con ningún cliente registrado.');
      setError('Contactanos para que vinculemos tu cuenta: contacto.enclogistica@gmail.com');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#0A2540] p-8 text-center flex flex-col items-center">
          <img src="/alas-blanca-transparente.png" alt="ENC Logística" className="h-20 w-auto object-contain mb-4" />
          <h1 className="text-2xl font-bold text-white">
            ENC <span className="text-[#E63946]">Logística</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Crear cuenta de cliente B2B</p>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#0A2540] mb-6 text-center">Registro</h2>
          {error && (
            <div className="bg-red-50 text-[#E63946] p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm text-center">
              {success}
            </div>
          )}
          {!vinculado && (
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={emailInicial}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-[#E63946] focus:border-[#E63946]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usá el mismo email que le diste a ENC Logística para contratar el servicio.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <PasswordInput name="password" minLength={6} />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres.</p>
              </div>
              <label className="flex items-start gap-2 text-xs text-gray-600">
                <input type="checkbox" required className="mt-0.5" />
                <span>
                  Acepto los <a href="/terminos" target="_blank" className="text-[#0A2540] underline">términos y condiciones</a> y la{' '}
                  <a href="/privacidad" target="_blank" className="text-[#0A2540] underline">política de privacidad</a>.
                </span>
              </label>
              <button type="submit" className="w-full bg-[#0A2540] text-white font-bold p-3 rounded-lg hover:bg-[#06192b] transition-colors">
                Crear Cuenta
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tenés cuenta?{' '}
            <Link href="/portal/login" className="text-[#E63946] font-bold hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}