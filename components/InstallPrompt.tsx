'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Solo mostrar en mobile
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (!isMobile) return;

    // No mostrar si ya se instaló
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // No mostrar si el usuario ya lo cerró (en esta sesión)
    const wasDismissed = sessionStorage.getItem('install-prompt-dismissed');
    if (wasDismissed === '1') {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('install-prompt-dismissed', '1');
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-[#0A2540] text-white rounded-lg shadow-2xl p-4 flex items-center gap-3 md:left-auto md:right-4 md:max-w-sm">
      <img
        src="/android-chrome-192x192.png"
        alt="ENC"
        className="w-12 h-12 rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">Instala ENC Logistica</p>
        <p className="text-xs text-gray-300">Acceso rapido desde tu pantalla de inicio</p>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={handleInstall}
          className="bg-white text-[#0A2540] font-bold text-xs px-3 py-1.5 rounded"
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="text-xs text-gray-400 hover:text-white"
        >
          Despues
        </button>
      </div>
    </div>
  );
}