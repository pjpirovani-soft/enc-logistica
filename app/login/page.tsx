'use client'

import { useState } from 'react';
import { login } from '@/lib/auth-actions';
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
        
        {/* Encabezado de Marca */}
        <div className="bg-[#0A2540] p-6 text-center">
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
              <input 
                name="email" 
                type="email" 
                required 
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-[#E63946] focus:border-[#E63946]" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input 
                name="password" 
                type="password" 
                required 
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-[#E63946] focus:border-[#E63946]" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#0A2540] text-white font-bold p-3 rounded hover:bg-[#06192b] transition-colors"
            >
              Ingresar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#E63946] font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}