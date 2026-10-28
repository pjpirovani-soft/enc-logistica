'use client';

import { useState } from 'react';
import { login } from '@/lib/auth-actions';
import { PasswordInput } from '@/components/PasswordInput';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    const res = await login(formData);
    if (res?.error) setError(res.error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#0A2540] p-8 text-center flex flex-col items-center">
          <img src="/alas-blanca-transparente.png" alt="ENC Logística" className="h-24 w-auto object-contain mb-4" />
          <h1 className="text-3xl font-bold text-white">
            ENC <span className="text-[#E63946]">Logística</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Panel de Control</p>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#0A2540] mb-6 text-center">Iniciar Sesión</h2>
          {error && (
            <div className="bg-red-50 text-[#E63946] p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input name="email" type="email" required className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-[#E63946] focus:border-[#E63946]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <PasswordInput name="password" />
            </div>
            <button type="submit" className="w-full bg-[#0A2540] text-white font-bold p-3 rounded-lg hover:bg-[#06192b] transition-colors">
              Ingresar
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#E63946] font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            ¿Sos cliente B2B? <Link href="/portal/login" className="text-[#0A2540] font-bold hover:underline">Ir al portal B2B</Link>
          </p>
          <p className="mt-4 text-center text-xs text-gray-400">
            ¿Sos cliente B2B?{' '}
            <Link href="/portal/login" className="text-[#0A2540] hover:underline">
              Ir al portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}