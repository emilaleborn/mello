'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'mello-install-dismissed';

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone)
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if already dismissed or in standalone mode
    if (isStandalone()) return;
    const wasDismissed = localStorage.getItem(DISMISS_KEY);
    if (wasDismissed) return;

    setDismissed(false);

    if (isIOS()) {
      setShowIOSInstructions(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setDismissed(true);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIOSInstructions(false);
  }, []);

  if (dismissed || isStandalone()) return null;
  if (!deferredPrompt && !showIOSInstructions) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-in slide-in-from-bottom-4">
      <div className="rounded-2xl bg-[var(--background-surface)] p-4 shadow-xl ring-1 ring-[var(--border)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--mello-purple)] text-lg font-bold text-white">
            M
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[var(--foreground)]">Installera Mello-appen</p>
            {showIOSInstructions ? (
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Tryck på <span className="text-[var(--foreground)]">Dela</span> &#8594;{' '}
                <span className="text-[var(--foreground)]">Lägg till på hemskärmen</span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Installera för snabb åtkomst direkt från hemskärmen
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {!showIOSInstructions && (
            <button
              onClick={handleInstall}
              className="flex-1 rounded-xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] py-2 text-sm font-medium text-black transition-colors"
            >
              Installera
            </button>
          )}
          <button
            onClick={handleDismiss}
            className={`rounded-xl bg-[var(--background-elevated)] py-2 text-sm text-[var(--foreground)] transition-colors hover:opacity-80 ${showIOSInstructions ? 'flex-1' : 'px-4'}`}
          >
            {showIOSInstructions ? 'OK, jag förstår' : 'Inte nu'}
          </button>
        </div>
      </div>
    </div>
  );
}
