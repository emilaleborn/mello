'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinParty } from '@/lib/firebase/parties';
import { useAuthStore } from '@/stores/authStore';

interface JoinPartyFormProps {
  initialCode?: string;
  onJoined?: (partyId: string) => void;
}

export function JoinPartyForm({ initialCode = '', onJoined }: JoinPartyFormProps) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleJoin = async () => {
    if (!user || code.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      const party = await joinParty(code.toUpperCase(), user.uid, user.displayName, user.photoURL);
      if (!party) {
        setError('Ingen sällskap hittades med den koden.');
        return;
      }
      setCode('');
      if (onJoined) {
        onJoined(party.id);
      } else {
        router.push(`/party/${party.id}`);
      }
    } catch {
      setError('Kunde inte gå med. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="ABCDEF"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
        maxLength={6}
        className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-center text-xl font-mono tracking-[0.3em] text-white placeholder-zinc-600 outline-none focus:ring-2 focus:ring-violet-500"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        onClick={handleJoin}
        disabled={code.length !== 6 || loading}
        className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white disabled:opacity-50 active:bg-violet-700"
      >
        {loading ? 'Ansluter...' : 'Gå med'}
      </button>
    </div>
  );
}
