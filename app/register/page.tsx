'use client'

import { useState } from 'react';
import { register } from '@/lib/auth-actions';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(formData: FormData) {
    const res = await register(formData);
    if (res?.error) setError(res.error);
    if (res?.success) setSuccess(res.success);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#0A2540] p-6 text-center flex flex-col items-center">
          <img src="/logo.png" alt="ENC Logística" className="h-24 w-auto mb-2" />
          <h1 className="text-3xl font-bold text-white">
            ENC <span className="text-[#E63946]">Logística</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Crear nueva cuenta</p>
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
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input name="email" type="email" required className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-[#E63946] focus:border-[#E63946]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input name="password" type="password" required className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-[#E63946] focus:border-[#E63946]" />
            </div>
            <button type="submit" className="w-full bg-[#0A2540] text-white font-bold p-3 rounded hover:bg-[#06192b] transition-colors">
              Registrarse
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#E63946] font-bold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}