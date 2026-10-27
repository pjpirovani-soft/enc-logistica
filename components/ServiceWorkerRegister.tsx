'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        console.log('SW registrado:', reg.scope);

        // Detectar cuando hay una nueva versión del SW
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => {
        console.warn('SW registro fallido:', err);
      });
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-[#E63946] text-white rounded-lg shadow-2xl p-3 flex items-center gap-3 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex-1">
        <p className="font-bold text-sm">Nueva versión disponible</p>
        <p className="text-xs text-white/80">Actualizá para ver los últimos cambios</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="bg-white text-[#E63946] font-bold text-xs px-3 py-2 rounded"
      >
        Actualizar
      </button>
    </div>
  );
}