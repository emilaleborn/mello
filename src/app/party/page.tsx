'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { subscribeToUserParties } from '@/lib/firebase/parties';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PartyCard } from '@/components/party/PartyCard';
import { CreatePartyModal } from '@/components/party/CreatePartyModal';
import { JoinPartyForm } from '@/components/party/JoinPartyForm';
import type { Party } from '@/types';

function PartyListContent() {
  const user = useAuthStore((s) => s.user);
  const [parties, setParties] = useState<Party[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserParties(user.uid, setParties);
    return () => unsub();
  }, [user]);

  return (
    <div className="bg-[var(--background)] pb-4">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <h1 className="text-xl font-bold text-white">Mina sällskap</h1>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex-1 rounded-xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] py-3 text-sm font-bold text-black active:opacity-90"
          >
            Skapa sällskap
          </button>
          <button
            onClick={() => setShowJoin(!showJoin)}
            className="flex-1 rounded-xl bg-[var(--background-surface)] py-3 text-sm font-medium text-white active:opacity-80"
          >
            Gå med
          </button>
        </div>

        {showJoin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 overflow-hidden rounded-2xl bg-[var(--background-elevated)] p-4"
          >
            <h3 className="mb-3 text-sm font-medium text-[var(--foreground)]">Ange kod</h3>
            <JoinPartyForm />
          </motion.div>
        )}

        {parties.length === 0 ? (
          <div className="rounded-2xl bg-[var(--background-elevated)] p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-[var(--foreground-muted)]" />
            <p className="text-sm text-[var(--foreground-muted)]">
              Du är inte med i något sällskap ännu. Skapa ett eller gå med via en kod!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {parties.map((party) => (
              <PartyCard key={party.id} party={party} />
            ))}
          </div>
        )}
      </div>

      <CreatePartyModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export default function PartyListPage() {
  return (
    <AuthGuard>
      <PartyListContent />
    </AuthGuard>
  );
}
