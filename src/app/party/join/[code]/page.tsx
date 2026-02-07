'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { joinParty } from '@/lib/firebase/parties';
import { useAuthStore } from '@/stores/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';

function JoinPartyContent() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [status, setStatus] = useState<'joining' | 'error'>('joining');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const party = await joinParty(code, user.uid, user.displayName, user.photoURL);
        if (cancelled) return;
        if (!party) {
          setStatus('error');
          setErrorMsg('Ingen sällskap hittades med den koden.');
          return;
        }
        router.replace(`/party/${party.id}`);
      } catch {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg('Kunde inte gå med. Försök igen.');
        }
      }
    })();

    return () => { cancelled = true; };
  }, [user, code, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      {status === 'joining' && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--mello-gold)] border-t-transparent" />
          <p className="text-sm text-[var(--foreground-muted)]">Ansluter till sällskapet...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <p className="mb-4 text-red-400">{errorMsg}</p>
          <button
            onClick={() => router.push('/')}
            className="rounded-xl bg-[var(--background-surface)] px-6 py-3 text-sm font-medium text-[var(--foreground)]"
          >
            Tillbaka
          </button>
        </div>
      )}
    </div>
  );
}

export default function JoinPartyPage() {
  return (
    <AuthGuard>
      <JoinPartyContent />
    </AuthGuard>
  );
}
