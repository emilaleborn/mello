'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuthStore } from '@/stores/authStore';
import { subscribeToUserParties } from '@/lib/firebase/parties';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserAvatar } from '@/components/auth/UserAvatar';
import { PartyCard } from '@/components/party/PartyCard';
import type { Party } from '@/types';

function ProfileContent() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserParties(user.uid, setParties);
    return () => unsub();
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="bg-[var(--background)] pb-4">
      <div className="flex flex-col items-center border-b border-[var(--border)] px-4 py-8">
        <UserAvatar
          uid={user.uid}
          photoURL={user.photoURL}
          displayName={user.displayName}
          size={80}
        />
        <h1 className="mt-3 text-lg font-bold text-white">{user.displayName}</h1>
        {!user.isAnonymous && (
          <p className="text-sm text-[var(--foreground-muted)]">{user.isAnonymous ? 'Anonym' : 'Google-konto'}</p>
        )}
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        {parties.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-medium text-[var(--foreground-muted)]">Mina sällskap</h2>
            <div className="space-y-3">
              {parties.map((party) => (
                <PartyCard key={party.id} party={party} />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-[var(--background-surface)] py-3 text-sm font-medium text-red-400 active:opacity-80"
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
