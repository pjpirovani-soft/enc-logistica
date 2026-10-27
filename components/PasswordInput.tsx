'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = {
  name: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
};

export function PasswordInput({ name, required = true, minLength, placeholder }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={visible ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="mt-1 block w-full border border-gray-300 rounded-lg p-3 pr-12 focus:ring-[#E63946] focus:border-[#E63946]"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2 top-1/2 -translate-y-1/2 mt-0.5 p-2 text-gray-500 hover:text-[#0A2540]"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}