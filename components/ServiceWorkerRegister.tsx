'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('SW registrado:', reg.scope);
      })
      .catch((err) => {
        console.warn('SW registro fallido:', err);
      });
  }, []);

  return null;
}